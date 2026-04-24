import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const groqKey = (process.env.GROQ_API_KEY || '').trim();

  if (!groqKey) {
    console.error('GROQ_API_KEY is not set in environment variables');
    return res.status(500).json({
      error: 'Server config error: GROQ_API_KEY missing. Get a free key at https://console.groq.com',
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const systemPrompt = `You are a knowledgeable and compassionate Ayurvedic health assistant for Nexus Ayurve.
Provide helpful advice based on Ayurvedic principles including dosha balancing (Vata, Pitta, Kapha), herbal remedies, yoga, pranayama, and diet recommendations.
Always be warm, professional, and use bullet points for lists.
Recommend consulting a qualified Ayurvedic doctor for serious conditions.`;

    // 15-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.5,
        max_tokens: 512,
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
    const aiText = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return res.status(200).json({ reply: aiText });

  } catch (error: any) {
    if (error?.name === 'AbortError') {
      console.error('Groq API timeout after 15s');
      return res.status(504).json({ error: 'The AI took too long to respond. Please try again.' });
    }
    console.error('Groq API Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
