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

  // Read API key inside handler. Check for common typos the user might have made in Vercel.
  const rawKey = process.env.NVIDIA_API_KEY || process.env.NIVIDIA_API_KEY || process.env.NVIDIA_KEY || process.env.NVIDIA_PI_KEY || '';
  const apiKey = rawKey.trim();

  if (!apiKey) {
    console.error("NVIDIA_API_KEY is not set in environment variables");
    // Try to find the user's typo. Filter out common system variables to just show custom ones.
    const ignorePrefixes = ['npm_', 'VERCEL_', 'AWS_', 'NODE_', 'XDG_', 'LANG', 'HOME', 'PATH', 'PWD', 'USER', 'SHLVL', '_', 'LOGNAME', 'TZ', 'TERM'];
    const customKeys = Object.keys(process.env).filter(k => !ignorePrefixes.some(p => k.startsWith(p)));
    const foundStr = customKeys.length > 0 ? customKeys.join(', ') : "No custom keys found";
    const isVercel = process.env.VERCEL === '1' ? 'Yes' : 'No';
    
    return res.status(500).json({ 
      error: `Server config error: Key missing. (Vercel=${isVercel}, Custom_Keys=[${foundStr}])`,
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const prompt = `As an Ayurvedic health assistant for Ayurcare+, analyze the following query and provide a helpful, detailed response. If the user describes symptoms, suggest possible Ayurvedic conditions, remedies, herbs, diet changes, and precautions. If the user asks about diet, yoga, or lifestyle, give Ayurvedic recommendations. Always be compassionate and professional.

User query: ${message}

Respond in a friendly, informative way. Use bullet points for lists.`;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: "You are a knowledgeable and compassionate Ayurvedic health assistant. Provide helpful advice based on Ayurvedic principles including dosha balancing, herbal remedies, yoga, pranayama, and diet recommendations. Always recommend consulting a qualified Ayurvedic doctor for serious conditions." },
          { role: "user", content: prompt }
        ],
        temperature: 0.4,
        top_p: 0.8,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA API Error:", response.status, errText);
      return res.status(500).json({ error: `NVIDIA API error: ${response.status}`, details: errText });
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return res.status(200).json({ reply: aiText });
  } catch (error: any) {
    console.error("Chat handler error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

