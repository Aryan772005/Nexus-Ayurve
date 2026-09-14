import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!geminiKey) {
    return res.status(401).json({ error: 'GEMINI_API_KEY not configured in .env file.' });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    const base64Data = imageBase64.startsWith('data:')
      ? imageBase64.split(',')[1]
      : imageBase64;
    const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const promptText = `You are a premier clinical nutritionist and Ayurvedic Vaidya (physician).
Carefully inspect this food image and generate a comprehensive nutritional and Ayurvedic breakdown.
Strictly return ONLY a valid raw JSON object (no markdown, no backticks, no explanatory text).

Required JSON structure:
{
  "food_name": "Accurate name of the dish or meal",
  "portion_size": "Estimated portion/serving size (e.g. 1 bowl ~250g, 2 pieces)",
  "calories": "Total estimated energy with unit (e.g. 380 kcal)",
  "health_category": "Healthy / Moderate / Indulgent",
  "ayurvedic_nature": "Short summary (e.g. Pitta-pacifying & Deeply Nourishing)",
  "macros": {
    "protein": "e.g. 16g",
    "carbs": "e.g. 48g",
    "fats": "e.g. 14g",
    "fiber": "e.g. 6g"
  },
  "vitamins": [
    {
      "name": "e.g. Vitamin A / Vitamin C / Vitamin B12 / Folate",
      "amount": "e.g. 420 mcg / 25 mg",
      "daily_value": "e.g. 45%",
      "benefit": "Brief clinical health benefit for energy, immunity, or skin"
    }
  ],
  "minerals": [
    {
      "name": "e.g. Iron / Calcium / Magnesium / Potassium / Zinc",
      "amount": "e.g. 3.8 mg / 250 mg",
      "daily_value": "e.g. 21%",
      "benefit": "Specific functional benefit like hemoglobin, bones, or electrolytes"
    }
  ],
  "ayurvedic_profile": {
    "dominant_dosha": "Tridoshic / Vata-pacifying / Pitta-pacifying / Kapha-pacifying",
    "dosha_effect": "Clear sentence detailing how this meal affects Vata, Pitta, and Kapha",
    "rasa": ["Sweet (Madhura)", "Pungent (Katu)", "Astringent (Kashaya)"],
    "virya": "Sheeta (Cooling) or Ushna (Heating)",
    "vipaka": "Madhura (Sweet) or Katu (Pungent) or Amla (Sour)",
    "agni_impact": "How it impacts digestive fire (e.g. Easy on Agni, kindle digestive fire)"
  },
  "key_ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
  "suggestion": "One or two practical Ayurvedic recommendations (spices, timing, or complementary food pairing)"
}`;

    let result: any = null;
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await model.generateContent([
          promptText,
          { inlineData: { mimeType, data: base64Data } },
        ]);
        if (result) break;
      } catch (err: any) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        }
      }
    }
    if (!result) {
      throw lastError || new Error('Failed to generate meal analysis');
    }

    let aiText = result.response.text().trim();
    aiText = aiText.replace(/```(?:json)?\n?|```/g, '').trim();

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'AI returned an unexpected response format. Please try again.' });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Normalize data structure in case model flattens or alters field names slightly
    const normalized = {
      food_name: parsed.food_name || 'Detected Meal',
      portion_size: parsed.portion_size || '1 serving',
      calories: parsed.calories || (parsed.calorie ? `${parsed.calorie} kcal` : 'N/A'),
      health_category: parsed.health_category || 'Healthy',
      ayurvedic_nature: parsed.ayurvedic_nature || parsed.nature || 'Balanced',
      macros: {
        protein: parsed.macros?.protein || parsed.protein || 'N/A',
        carbs: parsed.macros?.carbs || parsed.carbs || 'N/A',
        fats: parsed.macros?.fats || parsed.fats || parsed.fat || 'N/A',
        fiber: parsed.macros?.fiber || parsed.fiber || 'N/A',
      },
      vitamins: Array.isArray(parsed.vitamins) ? parsed.vitamins : [],
      minerals: Array.isArray(parsed.minerals) ? parsed.minerals : [],
      ayurvedic_profile: {
        dominant_dosha: parsed.ayurvedic_profile?.dominant_dosha || parsed.ayurvedic_nature || 'Tridoshic',
        dosha_effect: parsed.ayurvedic_profile?.dosha_effect || parsed.ayurvedic_nature || '',
        rasa: Array.isArray(parsed.ayurvedic_profile?.rasa) ? parsed.ayurvedic_profile.rasa : [],
        virya: parsed.ayurvedic_profile?.virya || 'Neutral',
        vipaka: parsed.ayurvedic_profile?.vipaka || 'Sweet (Madhura)',
        agni_impact: parsed.ayurvedic_profile?.agni_impact || 'Balanced digestion',
      },
      key_ingredients: Array.isArray(parsed.key_ingredients) ? parsed.key_ingredients : [],
      suggestion: parsed.suggestion || parsed.ayurvedic_tip || '',
    };

    return res.status(200).json(normalized);

  } catch (error: any) {
    console.error('Food analyze error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Failed to analyse image.' });
  }
}
