export const maxDuration = 60;

// Knowledge-based intelligent Ayurvedic fallback if API is rate-limited
function generateIntelligentAyurvedicFallback(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('bloat') || lower.includes('gas') || lower.includes('flatulence') || lower.includes('distension')) {
    return `Namaste! Bloating and gas are classic signs of aggravated **Vata Dosha** combined with weak digestive fire (**Manda Agni**).

### Recommended Ayurvedic Solutions:
* **Ajwain & Rock Salt:** Chew 1/2 tsp carom seeds (Ajwain) with a pinch of rock salt (Kala Namak), followed by warm water. It dispels trapped gas within 10-15 minutes.
* **Hing (Asafoetida) Water:** Dissolve a small pinch of pure Hing in 1/2 cup warm water and drink after heavy meals.
* **CCF Tea:** Brew 1/2 tsp each of Cumin, Coriander, and Fennel seeds in 2 cups of water for 5 minutes. Sip warm throughout the afternoon.
* **Shatapawali:** Take 100 gentle steps after eating dinner. Avoid lying down immediately.

*Dietary Tip:* Avoid cold drinks, raw salads, and lentils after sunset. Always prefer freshly cooked, warm foods with a drop of ghee.`;
  }

  if (lower.includes('acid') || lower.includes('heartburn') || lower.includes('gerd') || lower.includes('sour') || lower.includes('burning')) {
    return `Namaste! Acidity and heartburn stem from aggravated **Pitta Dosha**, where the liquid and sour qualities (Amla & Drava Guna) of digestive juices increase.

### Recommended Ayurvedic Solutions:
* **Saunf (Fennel) Infusion:** Soak 1 tbsp crushed fennel seeds in a cup of water for 15 minutes. Strain and sip to immediately soothe the gastric lining.
* **Cold Fresh Milk or Coconut Water:** 1/2 glass of room-temperature fresh milk or tender coconut water neutralizes excess hydrochloric acid instantly.
* **Amla (Indian Gooseberry):** Take 1 tsp organic Amla powder with warm water before meals. Amla is the premier Pitta-pacifying rasayana.
* **Mishri & Coriander:** A tea brewed with coriander seeds and unrefined rock sugar (Dhaga Mishri) cools internal heat.

*Dietary Tip:* Minimize tomatoes, vinegar, green chilies, deep-fried snacks, and black coffee for the next 48 hours.`;
  }

  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('anxiety') || lower.includes('stress') || lower.includes('restless')) {
    return `Namaste! Insomnia and racing thoughts are typically caused by elevated **Prana Vata** destabilizing the nervous system (**Majja Dhatu**).

### Recommended Ayurvedic Solutions:
* **Ashwagandha & Nutmeg Milk:** Warm 1 cup milk with 1/2 tsp Ashwagandha powder and a small pinch of freshly grated Nutmeg (Jaiphal) 30 minutes before sleep.
* **Pada Abhyanga:** Massage the soles of your feet with warm pure sesame oil or cow ghee for 3 minutes before sleeping. This pulls erratic mental energy downward.
* **Nadi Shodhana Pranayama:** 7 minutes of slow Alternate Nostril Breathing in a dimly lit room restores parasympathetic tone.
* **Brahmi Tea:** Calms mental agitation without daytime drowsiness.

*Lifestyle Tip:* Discontinue all phone/laptop screens at least 45 minutes before sleep to align with your pineal circadian rhythm.`;
  }

  if (lower.includes('skin') || lower.includes('acne') || lower.includes('pimple') || lower.includes('hair') || lower.includes('dandruff')) {
    return `Namaste! In Ayurveda, radiant skin and strong hair reflect pure blood tissue (**Rakta Dhatu**) and healthy bone tissue (**Asthi Dhatu**).

### Recommended Ayurvedic Solutions:
* **Neem & Turmeric Cleansing:** Take a mild infusion of neem leaves or 1/4 tsp organic turmeric with warm water in the morning to purify the bloodstream.
* **Hydration with Vetiver (Khus):** Drink water infused with vetiver roots or cucumber slices to eliminate Pitta heat from the capillaries.
* **Bhringraj & Coconut Scalp Oil:** Warm Bhringraj oil gently and massage into hair roots twice a week to calm scalp heat and prevent premature thinning.
* **Triphala Churna:** 1/2 tsp Triphala powder with warm water at bedtime gently detoxifies the colon, which directly clears stubborn facial blemishes.

*Dietary Tip:* Avoid mixing milk with sour fruits or salty foods, as this creates Viruddha Ahara (incompatible foods) leading to skin inflammation.`;
  }

  return `Namaste! Welcome to **Nexus Ayurve**. 

Ayurveda guides us to achieve harmony between mind, body, and spirit by balancing the three vital energies (**Vata**, **Pitta**, and **Kapha**) and keeping the digestive fire (**Agni**) strong.

### General Pillars for Daily Vitality:
* **Awaken Digestive Agni:** Chew a thin slice of fresh ginger with a drop of lemon and a pinch of rock salt 10 minutes before meals.
* **Mindful Eating:** Eat your largest meal at midday (12:30 PM - 1:30 PM) when the sun and your internal metabolic fire are at their zenith.
* **Hydration:** Always drink lukewarm or room-temperature water. Avoid ice water, which dampens digestion.
* **Evening Reset:** Ensure a 12-hour overnight fasting window between dinner and breakfast to allow natural gut repair.

*How can I help you specifically today? Feel free to mention any symptoms, your meal plans, or your dosha type!*`;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const groqKey = (process.env.GROQ_API_KEY || '').trim();

  const systemPrompt = `You are a knowledgeable, compassionate Ayurvedic health assistant for Nexus Ayurve.
Provide helpful advice based on Ayurvedic principles including dosha balancing (Vata, Pitta, Kapha), herbal remedies, yoga, pranayama, and diet recommendations.
Always be warm, professional, and use bullet points for lists.
Recommend consulting a qualified Ayurvedic doctor for serious conditions.`;

  if (groqKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content;
        if (aiText) {
          return res.status(200).json({ reply: aiText });
        }
      }
    } catch (err: any) {
      console.warn('Groq chat error:', err?.message || err);
    }
  }

  // If rate limit or key unavailable, deliver intelligent Ayurvedic consultation reply
  const fallbackReply = generateIntelligentAyurvedicFallback(message);
  return res.status(200).json({ reply: fallbackReply });
}
