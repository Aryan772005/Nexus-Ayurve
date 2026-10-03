export const maxDuration = 60;

// Working Groq models on this account (verified)
const MODEL_TEXT_PRIMARY = 'openai/gpt-oss-20b';    // strong, good JSON output
const MODEL_TEXT_FALLBACK = 'groq/compound-mini';   // fast, reliable fallback

async function groqChat(
  key: string,
  systemPrompt: string,
  userContent: string,
  maxTokens = 1500,
  modelOverride?: string
): Promise<string | null> {
  const models = modelOverride
    ? [modelOverride]
    : [MODEL_TEXT_PRIMARY, MODEL_TEXT_FALLBACK];

  for (const model of models) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          max_tokens: maxTokens,
          temperature: 0.35,
        }),
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) {
        const errBody = await r.text();
        console.warn(`[food-analyze] ${model} HTTP ${r.status}:`, errBody.slice(0, 200));
        continue;
      }
      const d = await r.json();
      const content = d.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch (e: any) {
      console.warn(`[food-analyze] ${model} error:`, e?.message);
    }
  }
  return null;
}

function extractJSON(text: string): any | null {
  const clean = text.replace(/```(?:json)?\n?|```/g, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  if (!groqKey) return res.status(401).json({ error: 'GROQ_API_KEY not configured.' });

  try {
    // Accept both imageBase64 (for camera/upload) AND optional foodName text
    const { imageBase64, foodName: foodNameInput } = req.body;
    if (!imageBase64 && !foodNameInput) {
      return res.status(400).json({ error: 'No image or food name provided' });
    }

    // --- Step 1: Identify the food name from image (via compound-mini which supports vision) ---
    let foodName = foodNameInput?.trim() || '';

    if (imageBase64 && !foodName) {
      const base64Data = imageBase64.startsWith('data:')
        ? imageBase64.split(',')[1]
        : imageBase64;
      const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

      // Try compound-mini with vision (it supports images)
      try {
        const visionRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'groq/compound-mini',
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Look at this food image. Identify the dish and return ONLY a JSON object: {"food_name":"exact dish name","estimated_portion":"e.g. 1 plate 300g"}. No other text.'
                },
                {
                  type: 'image_url',
                  image_url: { url: `data:${mimeType};base64,${base64Data}` }
                }
              ]
            }],
            max_tokens: 100,
            temperature: 0.1,
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (visionRes.ok) {
          const vd = await visionRes.json();
          const vText = vd.choices?.[0]?.message?.content?.trim();
          if (vText) {
            const parsed = extractJSON(vText);
            if (parsed?.food_name) foodName = parsed.food_name;
          }
        } else {
          const errBody = await visionRes.text();
          console.warn('[food-analyze] vision error:', visionRes.status, errBody.slice(0, 150));
        }
      } catch (e: any) {
        console.warn('[food-analyze] vision fetch error:', e?.message);
      }
    }

    // If still no food name, use a generic but accurate food label
    if (!foodName) foodName = 'Indian home-cooked meal plate';

    console.log(`[food-analyze] Analysing: "${foodName}"`);

    // --- Step 2: Full nutritional + Ayurvedic analysis via text model ---
    const systemPrompt = `You are a premier clinical nutritionist and Ayurvedic Vaidya (physician) specialising in Indian cuisine.
Return ONLY a valid raw JSON object. No markdown, no backticks, no extra text before or after.`;

    const userPrompt = `Provide a COMPLETE and ACCURATE nutritional and Ayurvedic analysis for: "${foodName}" (typical Indian serving).
Use real nutritional values from established databases. Make the data specific to this exact dish — not generic.

Return this exact JSON structure (fill all fields accurately):
{
  "food_name": "${foodName}",
  "portion_size": "realistic serving size with weight",
  "calories": "accurate kcal for this portion",
  "health_category": "Healthy OR Moderate OR Indulgent",
  "ayurvedic_nature": "specific Ayurvedic quality (e.g. Pitta-aggravating, Kapha-pacifying)",
  "macros": {
    "protein": "Xg",
    "carbs": "Xg",
    "fats": "Xg",
    "fiber": "Xg"
  },
  "vitamins": [
    { "name": "Vitamin Name", "amount": "X mcg/mg", "daily_value": "X%", "benefit": "specific health benefit" },
    { "name": "Vitamin Name", "amount": "X mcg/mg", "daily_value": "X%", "benefit": "specific health benefit" },
    { "name": "Vitamin Name", "amount": "X mcg/mg", "daily_value": "X%", "benefit": "specific health benefit" }
  ],
  "minerals": [
    { "name": "Mineral Name", "amount": "X mg", "daily_value": "X%", "benefit": "specific benefit" },
    { "name": "Mineral Name", "amount": "X mg", "daily_value": "X%", "benefit": "specific benefit" },
    { "name": "Mineral Name", "amount": "X mg", "daily_value": "X%", "benefit": "specific benefit" }
  ],
  "ayurvedic_profile": {
    "dominant_dosha": "e.g. Pitta-pacifying",
    "dosha_effect": "how this dish affects Vata, Pitta and Kapha with specific reasoning",
    "rasa": ["Primary Taste (Sanskrit)", "Secondary Taste"],
    "virya": "Sheeta (Cooling) or Ushna (Heating)",
    "vipaka": "Madhura (Sweet) or Katu (Pungent) or Amla (Sour)",
    "agni_impact": "specific impact on digestive fire"
  },
  "key_ingredients": ["real ingredient 1", "real ingredient 2", "real ingredient 3", "real ingredient 4"],
  "suggestion": "specific Ayurvedic tip for this exact dish"
}`;

    const rawText = await groqChat(groqKey, systemPrompt, userPrompt, 1800);

    if (!rawText) {
      return res.status(503).json({ error: 'AI analysis service temporarily unavailable. Please retry.' });
    }

    const parsed = extractJSON(rawText);
    if (!parsed) {
      console.error('[food-analyze] JSON parse failed. Raw:', rawText.slice(0, 300));
      return res.status(503).json({ error: 'Could not parse AI response. Please retry.' });
    }

    // Normalise and return
    return res.status(200).json({
      food_name: parsed.food_name || foodName,
      portion_size: parsed.portion_size || '1 serving',
      calories: parsed.calories || 'N/A',
      health_category: parsed.health_category || 'Moderate',
      ayurvedic_nature: parsed.ayurvedic_nature || 'Balanced',
      macros: {
        protein: parsed.macros?.protein || 'N/A',
        carbs: parsed.macros?.carbs || 'N/A',
        fats: parsed.macros?.fats || 'N/A',
        fiber: parsed.macros?.fiber || 'N/A',
      },
      vitamins: Array.isArray(parsed.vitamins) ? parsed.vitamins : [],
      minerals: Array.isArray(parsed.minerals) ? parsed.minerals : [],
      ayurvedic_profile: {
        dominant_dosha: parsed.ayurvedic_profile?.dominant_dosha || 'Tridoshic',
        dosha_effect: parsed.ayurvedic_profile?.dosha_effect || '',
        rasa: Array.isArray(parsed.ayurvedic_profile?.rasa) ? parsed.ayurvedic_profile.rasa : ['Sweet (Madhura)'],
        virya: parsed.ayurvedic_profile?.virya || 'Neutral',
        vipaka: parsed.ayurvedic_profile?.vipaka || 'Sweet (Madhura)',
        agni_impact: parsed.ayurvedic_profile?.agni_impact || 'Moderate',
      },
      key_ingredients: Array.isArray(parsed.key_ingredients) ? parsed.key_ingredients : [],
      suggestion: parsed.suggestion || 'Consume fresh and warm with digestive spices.',
    });

  } catch (error: any) {
    console.error('[food-analyze] Unexpected error:', error?.message);
    return res.status(503).json({ error: 'Analysis failed. Please retry.' });
  }
}
