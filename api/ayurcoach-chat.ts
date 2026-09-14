import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60;

// Knowledge base backup for common student/hostel complaints if API is in high demand
const FALLBACK_REMEDIES: Record<string, string> = {
  bloat: `Namaste! Bloating is a classic sign of aggravated **Vata Dosha** combined with sluggish Agni (digestive fire).\n\nHere are 3 quick hostel-friendly kitchen remedies you can do right now:\n\n* **Ajwain & Warm Water:** Chew 1/2 tsp carom seeds (Ajwain) with a pinch of rock salt (Kala Namak), then sip a cup of warm water. Works within 15 minutes.\n* **CCF Tea:** Boil 1/2 tsp cumin, coriander, and fennel seeds in water for 5 minutes. Sip warm after meals.\n* **100 Steps Walk (Shatapawali):** Walk gently for 100 paces right after dinner. Never lie down flat immediately.\n\n*Ayurvedic Tip:* Avoid drinking cold refrigerated water with meals — always prefer lukewarm water!`,
  acid: `Namaste! Acidity and heartburn indicate an aggravated **Pitta Dosha** (excess heat and sourness in the stomach).\n\nQuick student/office kitchen remedies:\n\n* **Fennel Seed Water (Saunf):** Chew 1 tsp sweet fennel seeds or soak them in a glass of room-temperature water for 10 minutes and drink.\n* **Cold Milk / Coconut Water:** Sip 1/2 glass of chilled fresh milk or fresh coconut water to instantly soothe the esophageal lining.\n* **Munakka / Raisins:** Chew 5-6 soaked black raisins on an empty stomach.\n\n*Ayurvedic Tip:* Cut down on reheated chai, fried snacks, and sour pickles for the next 24 hours.`,
  sleep: `Namaste! Difficulty sleeping or racing thoughts at night is an agitated **Prana Vata**.\n\nHostel wind-down ritual:\n\n* **Warm Golden Milk:** Drink 1 cup warm milk with a pinch of turmeric and grated nutmeg (Jaiphal) 30 minutes before bed.\n* **Pada Abhyanga:** Massage the soles of your feet with 2 drops of warm sesame oil or pure ghee for 2 minutes to ground scattered mental energy.\n* **Nadi Shodhana:** Practice 5 minutes of gentle alternate nostril breathing in bed.\n\n*Ayurvedic Tip:* Avoid scrolling through reels or studying in bed — keep your bed strictly for rest.`,
};

function getLocalRemedyFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('bloat') || q.includes('gas') || q.includes('heavy') || q.includes('stomach')) {
    return FALLBACK_REMEDIES.bloat;
  }
  if (q.includes('acid') || q.includes('heartburn') || q.includes('pitta') || q.includes('burn')) {
    return FALLBACK_REMEDIES.acid;
  }
  if (q.includes('sleep') || q.includes('insomnia') || q.includes('stress') || q.includes('tired')) {
    return FALLBACK_REMEDIES.sleep;
  }
  return `Namaste! For balanced digestion and vitality, always kindle your digestive fire (Agni):\n\n* **Ginger Digestif:** Chew a thin slice of fresh ginger with a drop of lemon juice and a pinch of rock salt 10 minutes before meals.\n* **Hydration:** Sip lukewarm water throughout the day rather than chugging iced water.\n* **Deep Rest:** Give your stomach a 12-hour overnight fasting window between dinner and breakfast.\n\n*Ayurvedic Tip:* Consistency in meal times is the single greatest stabilizer for your dosha!`;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, userDosha, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const groqKey = (process.env.GROQ_API_KEY || '').trim();

  const systemPrompt = `You are "AyurCoach", a friendly and deeply knowledgeable Ayurvedic wellness coach designed for college students and young professionals in India.
The user's dominant dosha is: ${userDosha || 'Vata-Pitta'}.

Guidelines:
1. Provide budget-friendly, realistic kitchen and herbal remedies that a student in a hostel, flat, or busy professional can easily prepare (e.g., CCF tea, warm water, fennel seeds after meals, jaggery, turmeric milk, breathing techniques).
2. Explain the root cause through Ayurvedic principles (Agni/digestive fire, Ama/toxins, Dosha imbalance).
3. Use warm, encouraging language with clear formatting (bullet points, bold key spices).
4. Always end with a warm one-line lifestyle tip.
5. If serious symptoms are mentioned (severe pain, bleeding, chest pain), urge them to consult a qualified physician immediately.`;

  // Try Groq if key present
  if (groqKey) {
    try {
      const messages: any[] = [{ role: 'system', content: systemPrompt }];
      if (Array.isArray(history)) {
        history.slice(-4).forEach((h: any) => {
          messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
        });
      }
      messages.push({ role: 'user', content: message });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return res.status(200).json({ reply });
      }
    } catch (gErr) {
      console.warn('Groq chat failed, trying Gemini:', gErr);
    }
  }

  // Try Gemini with retry
  if (geminiKey) {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let fullPrompt = `${systemPrompt}\n\n`;
    if (Array.isArray(history)) {
      history.slice(-3).forEach((h: any) => {
        fullPrompt += `${h.role === 'user' ? 'User' : 'AyurCoach'}: ${h.content}\n`;
      });
    }
    fullPrompt += `User: ${message}\nAyurCoach:`;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent(fullPrompt);
        const reply = result.response.text();
        if (reply) return res.status(200).json({ reply });
      } catch (gemErr: any) {
        const is429 = gemErr?.status === 429 || gemErr?.message?.includes('429') || gemErr?.message?.includes('quota');
        if (is429) {
          console.warn('Gemini quota hit on chat, using local fallback.');
          break; // Skip retries — quota won't recover in seconds
        }
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 700 * (attempt + 1)));
        }
      }
    }
  }

  // Return genuine high-quality Ayurvedic remedy if cloud model had transient demand spike
  const backupReply = getLocalRemedyFallback(message);
  return res.status(200).json({ reply: backupReply });
}
