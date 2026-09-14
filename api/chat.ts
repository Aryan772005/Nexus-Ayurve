import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!geminiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY missing in .env file.' });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are a knowledgeable and compassionate Ayurvedic health assistant for Nexus Ayurve.
Provide helpful advice based on Ayurvedic principles including dosha balancing (Vata, Pitta, Kapha), herbal remedies, yoga, pranayama, and diet recommendations.
Always be warm, professional, and use bullet points for lists.
Recommend consulting a qualified Ayurvedic doctor for serious conditions.

User: ${message}`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();
    return res.status(200).json({ reply: aiText });

  } catch (error: any) {
    console.error('Gemini Chat Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
