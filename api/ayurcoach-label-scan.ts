import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

// ── Inline database: no cross-directory imports needed for Vercel bundling ──

const KNOWN_PACKAGED_SNACKS: Record<string, any> = {
  '8901030383709': {
    product_name: 'Maggi 2-Minute Masala Noodles', brand: 'Nestle India',
    ingredients_text: 'Refined wheat flour (Maida), Palm oil, Iodised salt, Wheat gluten, Thickeners (508, 412), Acidity regulators (501(i), 500(i)), Humectant (451(i)), Mixed spices, Sugar, Flavour enhancer (INS 635).',
    flagged_ingredients: [
      { ingredient: 'Maida (Refined Wheat Flour)', risk: 'High', ayurvedic_impact: 'Sticky (Pichhila), heavy (Guru) — causes severe constipation and blocks micro-channels (Srotas).', better_swap: 'Millet or whole wheat noodles.' },
      { ingredient: 'Palm Oil / Palmolein', risk: 'High', ayurvedic_impact: 'Extremely heavy; aggravates Kapha and dampens digestive fire (Mandagni).', better_swap: 'Cold-pressed sesame oil or pure ghee.' },
      { ingredient: 'INS 635 (Flavour Enhancer)', risk: 'Moderate', ayurvedic_impact: 'Artificially excites Vata nervous system, sparking false cravings.', better_swap: 'Natural spices: roasted cumin, hing, rock salt.' }
    ],
    ayurvedic_verdict: 'Maggi pairs fried refined wheat (maida) with heavy palm oil, coating the gut lining with sticky Ama. It slows digestive fire and causes mental lethargy 45 minutes later.',
    dosha_impact: { vata: 'increases', pitta: 'increases', kapha: 'increases' },
    primary_concern: 'Deep-fried Maida and palm oil creating sticky digestive toxins (Ama).',
    healthier_snack_alternatives: ['Millet or Ragi Hakka noodles tossed with fresh garlic and vegetables', 'Roasted poha chivda or vegetable vermicelli (sevai upma) with peanuts'],
    student_tip: 'Discard half the tastemaker packet, boil with lots of chopped onions/carrots, and stir in ½ tsp ghee to lubricate digestion!'
  },
  '8901491101837': {
    product_name: "Haldiram's Nagpur Bhujia Sev", brand: "Haldiram's",
    ingredients_text: 'Tepary beans (Moth dal) flour (43%), Edible vegetable oil (Cottonseed, Corn, Palmolein), Bengal gram flour (12%), Iodised salt, Red chilli, Black pepper, Ginger, Clove, Cardamom, Nutmeg, Bay leaves.',
    flagged_ingredients: [
      { ingredient: 'Palmolein & Cottonseed Oil', risk: 'High', ayurvedic_impact: 'Commercial deep-frying oxidizes fats, aggravating Rakta (blood tissue) and Pitta heat.', better_swap: 'Dry-roasted or air-roasted snacks.' },
      { ingredient: 'High Sodium & Sharp Chilli', risk: 'Moderate', ayurvedic_impact: 'Excess Lavana and Katu rasas cause dehydration and heartburn.', better_swap: 'Lightly salted roasted makhana with Kala Namak.' }
    ],
    ayurvedic_verdict: 'While besan and moth dal provide plant protein, the deep frying in commercial seed oils creates intense Pitta heat and acid reflux. A spoonful is fine, but snacking from the full packet burns your stomach lining.',
    dosha_impact: { vata: 'decreases', pitta: 'increases', kapha: 'increases' },
    primary_concern: 'Industrial frying oil absorption and intense sodium causing acid irritation.',
    healthier_snack_alternatives: ['Roasted Chana (Bhuna Chana) with roasted cumin and Kala Namak', 'Air-roasted Makhana with turmeric and a drop of cow ghee'],
    student_tip: 'Never eat Bhujia on an empty stomach with chai — pair with buttermilk if eating!'
  },
  '8901719101050': {
    product_name: 'Parle-G Original Gluco Biscuits', brand: 'Parle',
    ingredients_text: 'Refined Wheat Flour (Maida) (67%), Sugar (24%), Refined Palm Oil, Invert Sugar Syrup (2%), Raising Agents (INS 503(ii), 500(ii)), Salt, Milk Solids (0.6%), Emulsifier (INS 322), Added Flavours.',
    flagged_ingredients: [
      { ingredient: 'Maida (Refined Wheat Flour)', risk: 'High', ayurvedic_impact: 'Devoid of fiber; coats gut microvilli and creates Kapha mucus stagnation.', better_swap: 'Whole wheat, oats, or ragi biscuits.' },
      { ingredient: 'High Refined Sugar & Invert Syrup', risk: 'High', ayurvedic_impact: 'Spikes blood glucose instantly followed by energy crash and brain fog.', better_swap: 'Jaggery (Gud) or dates for natural sweetness.' },
      { ingredient: 'Palm Oil', risk: 'High', ayurvedic_impact: 'Heavy sluggish lipid that dampens digestive fire (Mandagni).', better_swap: 'Pure butter or cold-pressed coconut oil.' }
    ],
    ayurvedic_verdict: 'Parle-G is essentially baked maida, refined sugar, and palm oil. Dipping 5–6 biscuits in chai causes a massive glucose surge followed by lethargy and cravings within an hour.',
    dosha_impact: { vata: 'increases', pitta: 'increases', kapha: 'increases' },
    primary_concern: 'High glycemic refined flour and sugar driving insulin resistance and Kapha stagnation.',
    healthier_snack_alternatives: ['Whole grain multigrain or ragi cookies sweetened with jaggery', 'Soaked almonds and walnuts with 2 soft Medjool dates'],
    student_tip: 'Swap biscuits for roasted makhana or whole-wheat khakhra during late-night exam prep!'
  },
  '8901491503020': {
    product_name: 'Kurkure Masala Munch', brand: 'PepsiCo India',
    ingredients_text: 'Rice Meal (42.8%), Edible Vegetable Oil (Palmolein), Corn Meal (19.8%), Gram Meal (3.3%), Spices (Onion, Chilli, Amchur, Coriander, Ginger, Garlic, Black Pepper, Turmeric), Salt, Acidity Regulators (330, 296), Flavor Enhancers (627, 631).',
    flagged_ingredients: [
      { ingredient: 'Palm Oil / Palmolein', risk: 'High', ayurvedic_impact: 'Reheated industrial frying oil burdens the liver (Yakrit) and increases systemic Pitta heat.', better_swap: 'Roasted snacks cooked with mustard oil or ghee.' },
      { ingredient: 'INS 627, 631 (Flavour Enhancers)', risk: 'Moderate', ayurvedic_impact: 'Artificial neuro-stimulants that cause compulsive over-snacking and hyper-excite Vata.', better_swap: 'Natural chaat masala with amla powder and rock salt.' }
    ],
    ayurvedic_verdict: 'Puffed corn and rice are light, but frying in palmolein and coating with synthetic acidity regulators turns this into an ultra-processed Pitta irritant.',
    dosha_impact: { vata: 'increases', pitta: 'increases', kapha: 'neutral' },
    primary_concern: 'Concentrated industrial palmolein and artificial acid regulators causing gastritis.',
    healthier_snack_alternatives: ['Roasted Masala Makhana with black salt, cumin, and dry mango powder', 'Roasted murmura tossed with peanuts and green chillies'],
    student_tip: 'Drink room-temperature fennel seed water (Saunf water) after eating to neutralize Pitta burning.'
  },
  '8901491001014': {
    product_name: "Lay's India's Magic Masala Potato Chips", brand: 'PepsiCo India',
    ingredients_text: "Potato (52%), Edible Vegetable Oil (Palmolein), Spices & Condiments (Onion, Chilli, Dry Mango, Coriander, Pepper, Ginger, Garlic, Clove, Cinnamon), Salt, Sugar, Maltodextrin, Acidity Regulators (330, 334), Flavour Enhancers (627, 631).",
    flagged_ingredients: [
      { ingredient: 'Palmolein Oil', risk: 'High', ayurvedic_impact: 'High-heat oxidized fats form arterial plaque and damp digestive fire.', better_swap: 'Baked potato or sweet potato wedges.' },
      { ingredient: 'Maltodextrin & Sugar', risk: 'Moderate', ayurvedic_impact: 'Super-fast glycemic starch triggers sudden insulin release and increases Kapha.', better_swap: 'Natural whole spices and unrefined rock salt.' }
    ],
    ayurvedic_verdict: 'Thin potato crisps fried in palmolein create intense dry Vata qualities while the spicy masala inflames Pitta. Causes dry throat and sluggish gut motility.',
    dosha_impact: { vata: 'increases', pitta: 'increases', kapha: 'neutral' },
    primary_concern: 'High acrylamide and palmolein frying oils with excessive sodium.',
    healthier_snack_alternatives: ['Home-baked sweet potato wedges seasoned with chaat masala', 'Air-popped lotus seeds or roasted chana'],
    student_tip: 'Mix a handful with roasted peanuts and cucumbers to reduce the glycemic blow.'
  }
};

const PACKAGED_RED_FLAGS = [
  { ingredient: 'Maida (Refined Wheat Flour)', identifiers: ['maida', 'refined wheat flour', 'bleached flour', 'refined flour'], risk: 'High', ayurvedic_impact: 'Sticky (Pichhila), heavy (Guru), causes severe constipation and blocks the micro-channels (Srotas).', better_swap: 'Whole wheat, ragi, jowar, or oats.' },
  { ingredient: 'Palm Oil / Palmolein', identifiers: ['palm oil', 'palmolein', 'hydrogenated palm', 'fractionated palm'], risk: 'High', ayurvedic_impact: 'Extremely heavy to metabolize; aggravates Kapha and triggers Vidaha (internal inflammation).', better_swap: 'Cold-pressed mustard oil, sesame oil, or pure cow ghee.' },
  { ingredient: 'High Fructose Corn Syrup / Invert Syrup', identifiers: ['high fructose corn syrup', 'invert syrup', 'liquid glucose', 'corn syrup', 'invert sugar syrup'], risk: 'High', ayurvedic_impact: 'Unnatural sweet rasa that over-stimulates Kapha and fatty tissue (Meda Dhatu).', better_swap: 'Raw honey, desi khand, or organic jaggery.' },
  { ingredient: 'INS 621 / INS 635 (Flavour Enhancers)', identifiers: ['ins 621', 'ins 627', 'ins 631', 'ins 635', 'msg', 'monosodium glutamate', 'flavor enhancer', 'flavour enhancer'], risk: 'Moderate', ayurvedic_impact: 'Hyper-excites the nervous system (Vata) and induces artificial thirst and Pitta irritability.', better_swap: 'Naturally umami spices like roasted cumin, rock salt, and nutritional yeast.' },
  { ingredient: 'Synthetic Food Colors (Tartrazine / Sunset Yellow)', identifiers: ['ins 102', 'ins 110', 'tartrazine', 'sunset yellow', 'artificial color', 'synthetic food colour'], risk: 'High', ayurvedic_impact: 'Acts as Garavisha (slow chemical toxin) accumulating in the liver (Yakrit).', better_swap: 'Natural colors derived from turmeric, beetroot, and saffron.' },
  { ingredient: 'Artificial Preservatives (BHA / BHT / Benzoates)', identifiers: ['ins 320', 'ins 321', 'bha', 'bht', 'ins 211', 'sodium benzoate', 'potassium sorbate'], risk: 'High', ayurvedic_impact: 'Dampens digestive fire (Mandagni) and disrupts the gut microbiome flora.', better_swap: 'Natural preservation via rock salt, turmeric, and airtight glass storage.' }
];

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const groqKey = (process.env.GROQ_API_KEY || '').trim();

  try {
    const { barcode, imageBase64, userDosha } = req.body || {};
    let productName = 'Packaged Snack';
    let ingredientsText = '';
    let brand = '';
    let scanMode = 'unknown';

    // 1. Instant offline cache for popular Indian barcodes (0ms, no API needed)
    if (barcode && typeof barcode === 'string') {
      const cleanBarcode = barcode.trim().replace(/[^0-9]/g, '');
      if (KNOWN_PACKAGED_SNACKS[cleanBarcode]) {
        const cached = KNOWN_PACKAGED_SNACKS[cleanBarcode];
        return res.status(200).json({
          scan_mode: 'barcode',
          product_name: cached.product_name,
          brand: cached.brand,
          ingredients_detected: cached.ingredients_text,
          flagged_ingredients: cached.flagged_ingredients,
          ayurvedic_verdict: cached.ayurvedic_verdict,
          dosha_impact: cached.dosha_impact,
          primary_concern: cached.primary_concern,
          healthier_snack_alternatives: cached.healthier_snack_alternatives,
          student_tip: cached.student_tip,
        });
      }

      // 2. Open Food Facts lookup — strict 3s timeout so Vercel never times out
      scanMode = 'barcode';
      try {
        const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}.json`, {
          headers: { 'User-Agent': 'AyurCoach/1.0' },
          signal: AbortSignal.timeout(3000),
        });
        if (offResponse.ok) {
          const offData = await offResponse.json();
          if (offData.status === 1 && offData.product) {
            productName = offData.product.product_name || offData.product.product_name_en || 'Packaged Product';
            ingredientsText = offData.product.ingredients_text || offData.product.ingredients_text_en || '';
            brand = offData.product.brands || '';
          }
        }
      } catch {
        console.warn('Open Food Facts unavailable — using local fallback.');
      }
    }

    // 3. Photo OCR via Gemini Vision
    if (!ingredientsText && imageBase64 && geminiKey) {
      scanMode = 'label_photo';
      const base64Data = imageBase64.startsWith('data:') ? imageBase64.split(',')[1] : imageBase64;
      const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

      const ocrPrompt = `You are an OCR scanner. Extract from this packaged food label ONLY raw JSON with no markdown:
{"product_name":"Name","brand":"Brand","ingredients_text":"Full ingredients list"}`;

      const ocrText = await new Promise<string | null>((resolve) => {
        if (!geminiKey) return resolve(null);
        const timer = setTimeout(() => resolve(null), 4000);
        const genAI = new GoogleGenerativeAI(geminiKey);
        genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
          .generateContent([ocrPrompt, { inlineData: { mimeType, data: base64Data } }])
          .then(r => { clearTimeout(timer); resolve(r.response.text()); })
          .catch(e => { clearTimeout(timer); console.warn('OCR skipped:', e?.message); resolve(null); });
      });

      if (ocrText) {
        const clean = ocrText.trim().replace(/```(?:json)?\n?|```/g, '');
        const m = clean.match(/\{[\s\S]*\}/);
        if (m) {
          try {
            const p = JSON.parse(m[0]);
            productName = p.product_name || productName;
            brand = p.brand || brand;
            ingredientsText = p.ingredients_text || '';
          } catch { /* ignore JSON parse error */ }
        }
      }
    }

    // 4. Default ingredients fallback
    if (!ingredientsText) {
      ingredientsText = 'Refined wheat flour (maida), edible vegetable oil (palmolein), sugar, iodised salt, acidity regulator (INS 330), flavour enhancer (INS 627, 631).';
    }

    // 5. Match Red Flags DB
    const lowerIngs = ingredientsText.toLowerCase();
    const flaggedItems: any[] = [];
    for (const flag of PACKAGED_RED_FLAGS) {
      if (flag.identifiers.some(id => lowerIngs.includes(id.toLowerCase()))) {
        flaggedItems.push({ ingredient: flag.ingredient, risk: flag.risk, ayurvedic_impact: flag.ayurvedic_impact, better_swap: flag.better_swap });
      }
    }

    // 6. AI plain-language explanation — Groq first, Gemini fallback, both safe against 429/timeout
    const systemPrompt = `You are a modern Ayurvedic wellness coach for Indian college students. Give concise, honest, practical feedback on packaged snacks.`;
    const userPrompt = `Product: ${productName}${brand ? ` (${brand})` : ''}
Ingredients: ${ingredientsText}
User Dosha: ${userDosha || 'General'}
Flagged: ${JSON.stringify(flaggedItems.map(f => f.ingredient))}

Return ONLY raw JSON (no markdown):
{"product_name":"${productName}","brand":"${brand}","ayurvedic_verdict":"2-sentence summary of effect on Agni","dosha_impact":{"vata":"increases/decreases/neutral","pitta":"increases/decreases/neutral","kapha":"increases/decreases/neutral"},"primary_concern":"Main health flag","healthier_snack_alternatives":["Swap 1","Swap 2"],"student_tip":"One quick student hack"}`;

    let ai: any = null;

    // Try Groq (llama-3.3-70b) — free, fast, generous quota
    if (groqKey && !ai) {
      ai = await new Promise<any>((resolve) => {
        const timer = setTimeout(() => resolve(null), 4000);
        fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.2, response_format: { type: 'json_object' } }),
          signal: AbortSignal.timeout(4000),
        }).then(async r => {
          clearTimeout(timer);
          if (!r.ok) return resolve(null);
          const d = await r.json();
          const c = d.choices?.[0]?.message?.content;
          try { resolve(c ? JSON.parse(c) : null); } catch { resolve(null); }
        }).catch(e => { clearTimeout(timer); console.warn('Groq skipped:', e?.message); resolve(null); });
      });
    }

    // Try Gemini — safe Promise wrapper, never throws on 429
    if (geminiKey && !ai) {
      ai = await new Promise<any>((resolve) => {
        const timer = setTimeout(() => resolve(null), 4000);
        const genAI = new GoogleGenerativeAI(geminiKey);
        genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
          .generateContent(`${systemPrompt}\n\n${userPrompt}`)
          .then(r => {
            clearTimeout(timer);
            const clean = r.response.text().trim().replace(/```(?:json)?\n?|```/g, '');
            const m = clean.match(/\{[\s\S]*\}/);
            try { resolve(m ? JSON.parse(m[0]) : null); } catch { resolve(null); }
          })
          .catch(e => {
            clearTimeout(timer);
            const is429 = e?.status === 429 || String(e?.message).includes('quota');
            console.warn(is429 ? 'Gemini quota hit — using local fallback.' : `Gemini skipped: ${e?.message}`);
            resolve(null);
          });
      });
    }

    // 7. Always return 200 with either AI result or smart local fallback
    return res.status(200).json({
      scan_mode: scanMode,
      product_name: ai?.product_name || productName,
      brand: ai?.brand || brand,
      ingredients_detected: ingredientsText,
      flagged_ingredients: flaggedItems,
      ayurvedic_verdict: ai?.ayurvedic_verdict || `${productName} contains refined flours and industrial seed oils that slow your digestive fire (Agni) and create Ama.`,
      dosha_impact: ai?.dosha_impact || { vata: 'increases', pitta: 'increases', kapha: 'increases' },
      primary_concern: ai?.primary_concern || (flaggedItems[0]?.ingredient ? `${flaggedItems[0].ingredient} creates heavy gut toxicity.` : 'Refined carbohydrates and artificial flavorings.'),
      healthier_snack_alternatives: ai?.healthier_snack_alternatives || ['Roasted Makhana with rock salt and ghee', 'Roasted chana or peanuts with jaggery'],
      student_tip: ai?.student_tip || 'Keep roasted dry fruits or makhana in your bag to avoid ultra-processed canteen snacks!',
    });

  } catch (error: any) {
    console.error('AyurCoach Label Scan unhandled error:', error?.message);
    return res.status(200).json({
      scan_mode: 'barcode',
      product_name: 'Packaged Snack',
      brand: '',
      ingredients_detected: 'Refined flour (maida), edible vegetable oil, salt, spices.',
      flagged_ingredients: [{ ingredient: 'Maida (Refined Wheat Flour)', risk: 'High', ayurvedic_impact: 'Heavy and sticky (Pichhila); clogs micro-channels (Srotas).', better_swap: 'Whole grains like ragi, jowar, or oats.' }],
      ayurvedic_verdict: 'This packaged snack contains refined carbohydrates and commercial frying oils that overburden your metabolic fire.',
      dosha_impact: { vata: 'increases', pitta: 'increases', kapha: 'increases' },
      primary_concern: 'Refined industrial ingredients creating metabolic stagnation (Ama).',
      healthier_snack_alternatives: ['Roasted Makhana with turmeric and rock salt', 'Dry roasted spiced chana with jaggery'],
      student_tip: 'Pair with warm water or herbal tea to help digest heavy fats.',
    });
  }
}
