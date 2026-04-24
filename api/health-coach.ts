import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Groq API Key
  const apiKey = (process.env.GROQ_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured. Get a free key at https://console.groq.com' });
  }

  // Safe body parsing
  const body = req.body || {};

  const {
    age, gender, height, weight, goal,
    activityLevel, foodPreference,
    conditions, bpm, bpmArray,
    caloriesToday, foodList,
    skinType, hairCondition, imageData,
  } = body;

  // Validation
  if (!age || !gender || !height || !weight || !goal) {
    return res.status(400).json({
      error: 'Missing required fields (age, gender, height, weight, goal)',
    });
  }

  // Concise System Prompt
  const SYSTEM_PROMPT = `You are a professional Indian health coach (Ayurveda + Modern Nutrition). Generate high-precision, actionable health blueprints. Follow the 13-section structure precisely within JSON. Focus on budget-friendly Indian solutions.`;

  // Structured Output Request (JSON Mapping)
  const USER_PROMPT = `Return Strictly JSON. No other text.
  Profile: Age ${age}, ${gender}, ${height}cm, ${weight}kg, Goal: ${goal}, Activity: ${activityLevel}, Diet: ${foodPreference}, Med: ${conditions || 'None'}.
  Real-time: BPM ${bpm || 'N/A'}, Cals Today ${caloriesToday || '0'}, Food: ${foodList || 'None'}, Skin: ${skinType}, Hair: ${hairCondition}.

  JSON Map:
  {
    "healthAnalysis": "Detailed analysis (min 100 words) of heart rate trends, classification, and Ayurvedic dosha balance.",
    "calories": { 
      "required": "Total daily calorie requirement (e.g., 2500 kcal)", 
      "protein": "Protein in grams (e.g., 120g)", 
      "carbs": "Carbs in grams (e.g., 300g)", 
      "fats": "Fats in grams (e.g., 70g)" 
    },
    "dietPlan": { 
      "breakfast": "Item + calorie count", 
      "lunch": "Item + calorie count", 
      "dinner": "Item + calorie count", 
      "snacks": "Item + calorie count" 
    },
    "foodAnalysis": "Detailed evaluation (min 50 words) of today's consumed food vs required metrics.",
    "recommendations": ["3-5 specific actionable health steps"],
    "hairCare": { 
      "issue": "Identified hair condition and cause", 
      "remedies": ["Specific daily routine", "Weekly treatment", "Herbal suggestions"] 
    },
    "skinCare": { 
      "routine": "Morning and Night step-by-step routine", 
      "remedies": ["Natural packs or remedies based on skin type"] 
    },
    "fitness": "Specific workout, sleep, and hydration plan.",
    "alerts": ["Any detected health risks or abnormalities"],
    "tips": { 
      "hair": "One short hair tip", 
      "skin": "One short skin tip", 
      "health": "One short general wellness tip" 
    },
    "summary": ["5 clear actionable steps for the next 24 hours"]
  }
`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT },
        ],
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: `AI API error: ${response.status}`,
        details: errText,
      });
    }

    const data = await response.json();
    let output = data.choices?.[0]?.message?.content || '';

    // Regex-based JSON extraction (finds the first { and last })
    let jsonText = output.trim();
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    // Repair common LLM JSON errors: unquoted values with units like 120 g or 2500 kcal
    // This finds patterns like : 120g or : 120 g and replaces with : "120g"
    jsonText = jsonText.replace(/:\s*(\d+(?:\.\d+)?\s*(?:g|kcal|mg|kg|ml|mcg|IU|cup|item|cal|calories))\b/gi, ': "$1"');

    // JSON Safe Parse
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({
        error: 'AI response parsing failed',
        raw: output, // Return full output for debugging
      });
    }

    return res.status(200).json(parsed);

  } catch (error: any) {
    return res.status(500).json({
      error: error.name === 'AbortError'
        ? 'Request timeout'
        : error.message || 'Internal server error',
    });
  }
}
