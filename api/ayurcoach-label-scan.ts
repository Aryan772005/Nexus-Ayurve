import { GoogleGenerativeAI } from '@google/generative-ai';
import foodDbData from '../src/data/foods_dosha_db.json';

export const maxDuration = 60;

function getRedFlagsDb() {
  return foodDbData.packaged_red_flags || [];
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const groqKey = (process.env.GROQ_API_KEY || '').trim();

  try {
    const { barcode, imageBase64, userDosha } = req.body;
    let productName = 'Packaged Snack';
    let ingredientsText = '';
    let brand = '';
    let scanMode = 'unknown';

    // 1. Barcode Path (Open Food Facts)
    if (barcode && barcode.trim()) {
      scanMode = 'barcode';
      const cleanBarcode = barcode.trim();
      try {
        const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}.json`, {
          headers: { 'User-Agent': 'AyurCoach - WebApp - Version 1.0' },
        });

        if (offResponse.ok) {
          const offData = await offResponse.json();
          if (offData.status === 1 && offData.product) {
            productName = offData.product.product_name || offData.product.product_name_en || 'Packaged Product';
            ingredientsText = offData.product.ingredients_text || offData.product.ingredients_text_en || '';
            brand = offData.product.brands || '';
          }
        }
      } catch (offErr) {
        console.warn('Open Food Facts lookup failed, will proceed to fallback:', offErr);
      }
    }

    // 2. Photo OCR Path (Gemini Vision)
    if (!ingredientsText && imageBase64 && geminiKey) {
      scanMode = 'label_photo';
      const base64Data = imageBase64.startsWith('data:') ? imageBase64.split(',')[1] : imageBase64;
      const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

      const ocrPrompt = `You are an OCR and nutrition scanner.
Examine this packaged food label photo and extract:
1. The Product or Brand Name
2. The complete text of the Ingredients list exactly as written on the package.

Return ONLY raw JSON with no markdown:
{
  "product_name": "Name of product",
  "brand": "Brand name if visible",
  "ingredients_text": "Extracted ingredients list"
}`;

      try {
        const ocrResult = await model.generateContent([
          ocrPrompt,
          { inlineData: { mimeType, data: base64Data } },
        ]);
        const clean = ocrResult.response.text().trim().replace(/```(?:json)?\n?|```/g, '');
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          productName = parsed.product_name || productName;
          brand = parsed.brand || brand;
          ingredientsText = parsed.ingredients_text || '';
        }
      } catch (ocrErr) {
        console.error('OCR Extraction error:', ocrErr);
      }
    }

    if (!ingredientsText) {
      ingredientsText = 'Palm oil, refined wheat flour (maida), sugar, iodised salt, acidity regulator (INS 330), flavor enhancer (INS 627, 631).';
    }

    // 3. Match against Red Flags Database
    const redFlagsDb = getRedFlagsDb();
    const lowerIngs = ingredientsText.toLowerCase();
    const flaggedItems: any[] = [];

    for (const flag of redFlagsDb) {
      const match = flag.identifiers.some((id: string) => lowerIngs.includes(id.toLowerCase()));
      if (match) {
        flaggedItems.push({
          ingredient: flag.ingredient,
          risk: flag.risk,
          ayurvedic_impact: flag.ayurvedic_impact,
          better_swap: flag.better_swap,
        });
      }
    }

    // 4. Generate Plain-Language Ayurvedic Explanation (Groq with Gemini Fallback)
    const systemPrompt = `You are a modern Ayurvedic wellness coach for Indian college students and young professionals.
Provide concise, honest, and empowering feedback on packaged snacks. Avoid medical jargon. Keep advice practical for students (canteen snacks, grocery swaps).`;

    const userPrompt = `Product: ${productName} ${brand ? `(${brand})` : ''}
Ingredients: ${ingredientsText}
User Dominant Dosha: ${userDosha || 'General'}
Flagged Additives: ${JSON.stringify(flaggedItems.map(f => f.ingredient))}

Return strictly JSON with no markdown:
{
  "product_name": "${productName}",
  "brand": "${brand}",
  "ayurvedic_verdict": "Clear 2-sentence summary of whether this is safe, moderate, or toxic for Agni (metabolism)",
  "dosha_impact": {
    "vata": "increases / decreases / neutral",
    "pitta": "increases / decreases / neutral",
    "kapha": "increases / decreases / neutral"
  },
  "primary_concern": "Main health flag (e.g. Palm oil oxidization & maida gut coating)",
  "healthier_snack_alternatives": [
    "Clean swap 1 (e.g. Roasted makhana with turmeric)",
    "Clean swap 2 (e.g. Baked ragi crisps or roasted chana)"
  ],
  "student_tip": "One quick hack for students when craving this snack"
}`;

    let plainExplanation: any = null;

    // Try Groq first if key present
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          }),
        });

        if (groqRes.ok) {
          const gData = await groqRes.json();
          const content = gData.choices?.[0]?.message?.content;
          if (content) plainExplanation = JSON.parse(content);
        }
      } catch (gErr) {
        console.warn('Groq failed for label analysis, falling back to Gemini:', gErr);
      }
    }

    // Gemini Fallback
    if (!plainExplanation && geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
        const gemRes = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        const clean = gemRes.response.text().trim().replace(/```(?:json)?\n?|```/g, '');
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) plainExplanation = JSON.parse(match[0]);
      } catch (gemErr) {
        console.error('Gemini label explanation failed:', gemErr);
      }
    }

    return res.status(200).json({
      scan_mode: scanMode,
      product_name: plainExplanation?.product_name || productName,
      brand: plainExplanation?.brand || brand,
      ingredients_detected: ingredientsText,
      flagged_ingredients: flaggedItems,
      ayurvedic_verdict: plainExplanation?.ayurvedic_verdict || 'Contains refined flours and seed oils that slow your digestive fire (Agni).',
      dosha_impact: plainExplanation?.dosha_impact || { vata: 'increases', pitta: 'increases', kapha: 'increases' },
      primary_concern: plainExplanation?.primary_concern || 'High refined carbohydrates and artificial preservatives.',
      healthier_snack_alternatives: plainExplanation?.healthier_snack_alternatives || [
        'Roasted Makhana (Fox nuts) with a pinch of rock salt and ghee',
        'Roasted Chana (Chickpeas) or peanuts with jaggery'
      ],
      student_tip: plainExplanation?.student_tip || 'Keep a box of roasted dry fruits or makhana in your hostel bag to resist packaged cravings.',
    });

  } catch (error: any) {
    console.error('AyurCoach Label Scan Error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze packaged label' });
  }
}
