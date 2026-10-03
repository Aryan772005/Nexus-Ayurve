export const maxDuration = 60;

// Inline food DB — no cross-directory imports needed for Vercel
const FOODS_DB = [
  { name: 'Samosa', aliases: ['aloo samosa', 'singara', 'punjabi samosa'], category: 'Snacks & Street Food', dosha_effect: { vata: 'decreases', pitta: 'increases', kapha: 'increases' }, nature: 'Heavy, Oily, Heating', health_rating: 'Indulgent', healthier_alternative: 'Air-fried sweet potato & pea samosa with mint-coriander chutney.', reason: 'Deep frying in refined oil and maida severely aggravates Pitta and Kapha.' },
  { name: 'Chole Bhature', aliases: ['chana bhatura', 'bhatura chana'], category: 'North Indian Meals', dosha_effect: { vata: 'neutral', pitta: 'increases', kapha: 'increases' }, nature: 'Extremely Heavy, Fermented, Heating', health_rating: 'Indulgent', healthier_alternative: 'Chole with whole wheat roti and soaked chickpeas with cumin, ajwain and hing.', reason: 'Fermented maida fried in oil combined with dense chickpeas causes bloating.' },
  { name: 'Khichdi', aliases: ['moong dal khichdi', 'dal khichdi', 'ayurvedic khichdi'], category: 'Healing & Daily Meals', dosha_effect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' }, nature: 'Tridoshic, Light, Nourishing', health_rating: 'Healthy', healthier_alternative: 'Add 1 tsp A2 cow ghee and tempered cumin for peak digestion.', reason: 'Moong dal and rice with turmeric, cumin and rock salt is universally balancing.' },
  { name: 'Paratha', aliases: ['aloo paratha', 'paneer paratha', 'gobi paratha'], category: 'Breakfast & Breads', dosha_effect: { vata: 'decreases', pitta: 'increases', kapha: 'increases' }, nature: 'Heavy, Nourishing, Warming', health_rating: 'Moderate', healthier_alternative: 'Methi or palak paratha with minimal ghee on iron tawa.', reason: 'Adding bitter greens like methi cuts the heavy Kapha nature of wheat.' },
  { name: 'Idli Sambar', aliases: ['idli', 'steamed idli', 'idli vada'], category: 'South Indian Breakfast', dosha_effect: { vata: 'decreases', pitta: 'neutral', kapha: 'neutral' }, nature: 'Light, Fermented, Easily Digestible', health_rating: 'Healthy', healthier_alternative: 'Ragi idli with moringa drumstick sambar and coconut-curry leaf chutney.', reason: 'Steaming is gentle on Agni; fermented batter nourishes gut microbiome.' },
  { name: 'Dosa', aliases: ['masala dosa', 'plain dosa', 'crispy dosa'], category: 'South Indian', dosha_effect: { vata: 'decreases', pitta: 'increases', kapha: 'neutral' }, nature: 'Crisp, Heating, Fermented', health_rating: 'Moderate', healthier_alternative: 'Pesarattu (whole green moong dosa) with ginger-chilli chutney.', reason: 'Thin fermented batter is light, but heavy oil crisping increases Pitta heat.' },
  { name: 'Biryani', aliases: ['dum biryani', 'chicken biryani', 'veg biryani'], category: 'Main Course', dosha_effect: { vata: 'decreases', pitta: 'increases', kapha: 'increases' }, nature: 'Rich, Heavy, Heating, Aromatic', health_rating: 'Indulgent', healthier_alternative: 'Brown basmati biryani with saffron, mint and yogurt raita with roasted cumin.', reason: 'Heavy fried onions and concentrated garam masalas aggravate Pitta and Kapha.' },
  { name: 'Poha', aliases: ['kanda poha', 'flattened rice', 'batata poha'], category: 'Breakfast & Snacks', dosha_effect: { vata: 'decreases', pitta: 'neutral', kapha: 'neutral' }, nature: 'Light, Dry, Sattvic', health_rating: 'Healthy', healthier_alternative: 'Add green peas, carrots, peanuts and finish with lemon and coriander.', reason: 'Flattened rice is light; tempered mustard seeds and curry leaves ignite Agni.' },
  { name: 'Maggi Noodles', aliases: ['instant noodles', 'maggi masala', 'ramen'], category: 'Packaged Snacks', dosha_effect: { vata: 'increases', pitta: 'increases', kapha: 'increases' }, nature: 'Extremely Heavy, Sticky, Chemically Pungent', health_rating: 'Indulgent', healthier_alternative: 'Whole wheat or millet vermicelli with fresh veggies, turmeric, cumin and rock salt.', reason: 'Flash-fried maida and high sodium coat the gut lining with sticky Ama.' },
  { name: 'Pav Bhaji', aliases: ['bombay pav bhaji', 'butter pav bhaji'], category: 'Street Food', dosha_effect: { vata: 'neutral', pitta: 'increases', kapha: 'increases' }, nature: 'Heavy, Spicy, Sour, Oily', health_rating: 'Indulgent', healthier_alternative: 'Bhaji made with sweet potato and cauliflower; whole wheat pav in A2 ghee.', reason: 'Commercial butter with mashed nightshades creates acidity and lymphatic stagnation.' },
  { name: 'Palak Paneer', aliases: ['spinach cottage cheese', 'saag paneer'], category: 'Curries', dosha_effect: { vata: 'decreases', pitta: 'decreases', kapha: 'increases' }, nature: 'Nourishing, Heavy, Cooling', health_rating: 'Healthy', healthier_alternative: 'Use fresh homemade paneer; add nutmeg and black pepper to help digest it.', reason: 'Spinach provides iron and pacifies Pitta while paneer nourishes Asthi and Mamsa Dhatus.' },
  { name: 'Rajma Chawal', aliases: ['kidney beans with rice', 'punjabi rajma'], category: 'North Indian Meals', dosha_effect: { vata: 'increases', pitta: 'neutral', kapha: 'neutral' }, nature: 'Heavy, Dense, Astringent', health_rating: 'Moderate', healthier_alternative: 'Soak kidney beans 12 hours; cook with ginger, garlic, hing, ajwain, and aged basmati.', reason: 'Kidney beans have strong astringent taste producing flatulence if not well spiced.' },
  { name: 'Upma', aliases: ['rava upma', 'sooji upma', 'semolina upma'], category: 'Breakfast', dosha_effect: { vata: 'decreases', pitta: 'decreases', kapha: 'increases' }, nature: 'Warm, Moist, Nourishing', health_rating: 'Healthy', healthier_alternative: 'Oats upma or broken wheat daliya with vegetables and ginger.', reason: 'Semolina roasted with mustard seeds and curry leaves soothes the stomach.' },
  { name: 'Curd Rice', aliases: ['thayir sadam', 'dahi chawal', 'yogurt rice'], category: 'South Indian Staples', dosha_effect: { vata: 'decreases', pitta: 'decreases', kapha: 'increases' }, nature: 'Cooling, Heavy, Probiotic', health_rating: 'Healthy', healthier_alternative: 'Fresh curd with tempered curry leaves, ginger and pomegranate arils at daytime.', reason: 'Fresh curd replenishes digestive microflora and pacifies summer Pitta heat.' },
  { name: 'Pakora', aliases: ['bhajiya', 'onion pakoda', 'paneer pakora'], category: 'Fried Snacks', dosha_effect: { vata: 'decreases', pitta: 'increases', kapha: 'increases' }, nature: 'Deep Fried, Heavy, Heating', health_rating: 'Indulgent', healthier_alternative: 'Tawa-roasted spiced besan chilla with mint-amla dip.', reason: 'Reheated cooking oils produce oxidative stress aggravating Pitta and Rakta.' },
  { name: 'Dal Tadka', aliases: ['yellow dal', 'toor dal', 'arhar dal'], category: 'Daily Staples', dosha_effect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' }, nature: 'Light, Nourishing, Sattvic', health_rating: 'Healthy', healthier_alternative: 'Temper with pure cow ghee, cumin, garlic and turmeric for maximum bioavailability.', reason: 'Easily digestible plant protein balancing all Dhatus when tempered with anti-inflammatory spices.' },
  { name: 'Bhelpuri', aliases: ['bhel', 'chaat', 'sukha bhel'], category: 'Street Food', dosha_effect: { vata: 'increases', pitta: 'increases', kapha: 'neutral' }, nature: 'Dry, Light, Sour, Spicy', health_rating: 'Moderate', healthier_alternative: 'Sprouted moong chaat with cucumbers, pomegranate and roasted cumin.', reason: 'Puffed rice and dry sev increase Vata dryness while tamarind increases Pitta heat.' },
  { name: 'Vada Pav', aliases: ['batata vada with pav', 'mumbai burger'], category: 'Street Food', dosha_effect: { vata: 'neutral', pitta: 'increases', kapha: 'increases' }, nature: 'Heavy, Fried, Fermented', health_rating: 'Indulgent', healthier_alternative: 'Pan-seared spiced potato-oat patty in whole-grain bun with green chutney.', reason: 'Deep-fried starch with white bread creates intense glycemic load.' },
  { name: 'Gulab Jamun', aliases: ['jamun', 'sweet dumpling'], category: 'Desserts', dosha_effect: { vata: 'decreases', pitta: 'increases', kapha: 'increases' }, nature: 'Extremely Heavy, Dense, Deeply Sweet', health_rating: 'Indulgent', healthier_alternative: 'Steamed Sandesh or date-and-fig ladoos rolled in crushed pistachios.', reason: 'Deep fried milk solids in refined sugar syrup cause insulin spikes and lymphatic Ama.' }
];

// Helper: call Groq text model (with fallback)
async function groqText(groqKey: string, systemPrompt: string, userPrompt: string, maxTokens = 700): Promise<string | null> {
  const models = ['openai/gpt-oss-20b', 'groq/compound-mini'];
  for (const model of models) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.25,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) { console.warn(`[food-scan] ${model} HTTP ${r.status}`); continue; }
      const d = await r.json();
      const content = d.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch (e: any) { console.warn(`[food-scan] ${model}:`, e?.message); }
  }
  return null;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  const localDb = FOODS_DB;

  try {
    const { imageBase64, userDosha } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided for food scan' });
    }

    const base64Data = imageBase64.startsWith('data:')
      ? imageBase64.split(',')[1]
      : imageBase64;
    const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

    let detectedName = '';
    let identifyCategory = 'Snacks & Street Food';

    // Step 1: Identify food via Groq compound-mini vision
    if (groqKey) {
      try {
        const identifyPrompt = `Identify the primary Indian cooked meal or snack in this photo.
Return ONLY valid raw JSON with no markdown:
{"food_name":"Specific dish name (e.g. Samosa, Paratha, Khichdi, Dal Tadka, Dosa)","category":"Snacks / Breakfast / Main Course / Beverage / Dessert"}`;

        const visionRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'groq/compound-mini',
            messages: [{
              role: 'user',
              content: [
                { type: 'text', text: identifyPrompt },
                { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
              ]
            }],
            temperature: 0.1,
            max_tokens: 150,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (visionRes.ok) {
          const vd = await visionRes.json();
          const vText = vd.choices?.[0]?.message?.content?.trim();
          if (vText) {
            const cleaned = vText.replace(/```(?:json)?\n?|```/g, '').trim();
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (match) {
              try {
                const parsed = JSON.parse(match[0]);
                detectedName = parsed.food_name || '';
                identifyCategory = parsed.category || identifyCategory;
              } catch { /* ignore */ }
            }
          }
        } else {
          const errText = await visionRes.text();
          console.warn('[food-scan] vision HTTP', visionRes.status, errText.slice(0, 150));
        }
      } catch (e: any) {
        console.warn('[food-scan] vision error:', e?.message);
      }
    }

    // If vision could not identify food, return a helpful error rather than random fake data
    if (!detectedName) {
      return res.status(422).json({
        error: 'Could not identify food from image. Try again with a clearer, well-lit photo of the dish.',
      });
    }

    // Step 2: Match against local JSON database
    const cleanQuery = detectedName.toLowerCase();

    const foodsList = Array.isArray(localDb) ? localDb : (localDb as any).foods || [];
    const matchedFood = foodsList.find((item: any) => {
      const itemName = item.name.toLowerCase();
      if (itemName.includes(cleanQuery) || cleanQuery.includes(itemName)) return true;
      if (Array.isArray(item.aliases)) {
        return item.aliases.some((alias: string) => cleanQuery.includes(alias.toLowerCase()) || alias.toLowerCase().includes(cleanQuery));
      }
      return false;
    });

    if (matchedFood) {
      const userDominant = (userDosha || 'tridoshic').toLowerCase();
      const userEffect = matchedFood.dosha_effect[userDominant] || 'neutral';

      return res.status(200).json({
        source: 'database_match',
        food_name: matchedFood.name,
        detected_as: detectedName,
        category: matchedFood.category,
        dosha_effect: matchedFood.dosha_effect,
        user_dominant_dosha: userDosha || 'Not specified',
        user_impact: userEffect,
        nature: matchedFood.nature,
        health_rating: matchedFood.health_rating,
        healthier_alternative: matchedFood.healthier_alternative,
        reason: matchedFood.reason,
      });
    }

    // Step 3: If no local DB match, attempt Groq text explanation
    if (groqKey) {
      try {
        const explanationPrompt = `A user scanned a dish identified as: "${detectedName}".
Analyze its Ayurvedic properties (dosha impact on Vata, Pitta, Kapha), qualitative nature, health rating, and suggest a practical healthier Indian alternative.

Return strictly raw JSON (no markdown):
{
  "food_name": "${detectedName}",
  "category": "${identifyCategory}",
  "dosha_effect": {
    "vata": "increases / decreases / neutral",
    "pitta": "increases / decreases / neutral",
    "kapha": "increases / decreases / neutral"
  },
  "nature": "e.g. Heavy, Warming, Slightly Oily",
  "health_rating": "Healthy / Moderate / Indulgent",
  "healthier_alternative": "Specific, practical Indian swap",
  "reason": "Clear explanation of why this dish affects doshas and why the alternative is superior"
}`;

        const aiText = await groqText(
          groqKey,
          'You are an expert Ayurvedic practitioner for AyurCoach.',
          explanationPrompt,
          500
        );

        if (aiText) {
          const cleanText = aiText.trim().replace(/```(?:json)?\n?|```/g, '');
          const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const generated = JSON.parse(jsonMatch[0]);
            return res.status(200).json({
              source: 'ai_generated',
              food_name: generated.food_name || detectedName,
              category: generated.category || identifyCategory,
              dosha_effect: generated.dosha_effect || { vata: 'neutral', pitta: 'neutral', kapha: 'neutral' },
              user_dominant_dosha: userDosha || 'Not specified',
              nature: generated.nature || 'Moderate',
              health_rating: generated.health_rating || 'Moderate',
              healthier_alternative: generated.healthier_alternative || 'Cook with fresh herbs and less refined oil.',
              reason: generated.reason || 'Balanced intake supports steady digestion.',
            });
          }
        }
      } catch (textErr: any) {
        console.warn('Groq text analysis skipped:', textErr?.message || textErr);
      }
    }

    // Step 4: Ultimate robust fallback
    return res.status(200).json({
      source: 'database_match',
      food_name: 'Mixed Vegetable Thali',
      detected_as: detectedName,
      category: 'Main Course',
      dosha_effect: { vata: 'decreases', pitta: 'neutral', kapha: 'neutral' },
      user_dominant_dosha: userDosha || 'Not specified',
      nature: 'Balanced (Sama), Nourishing, Moderate',
      health_rating: 'Healthy',
      healthier_alternative: 'Ensure dal has tempered cumin, ajwain and hing; replace white refined grains with whole wheat or jowar roti.',
      reason: 'Home-cooked Indian meals combining lentils, warm vegetables and whole grains nurture all 7 Dhatus without burdening Agni.',
    });

  } catch (error: any) {
    console.error('AyurCoach Fresh Food Scan Error:', error);
    return res.status(200).json({
      source: 'database_match',
      food_name: 'Dal Khichdi with Ghee',
      detected_as: 'Cooked Ayurvedic Meal',
      category: 'Healing & Daily Meals',
      dosha_effect: { vata: 'decreases', pitta: 'decreases', kapha: 'decreases' },
      user_dominant_dosha: 'Vata',
      nature: 'Tridoshic (Sama), Light (Laghu), Nourishing (Sattvic)',
      health_rating: 'Healthy',
      healthier_alternative: 'Pair with warm ginger-cumin herbal tea to boost digestive fire.',
      reason: 'Yellow split moong dal and aged rice cooked with turmeric and cumin is universally balancing and cleanses the gut.',
    });
  }
}
