export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Resolve API key
  let rawKey = (
    process.env.NVIDIA_API_KEY ||
    process.env.NIVIDIA_API_KEY ||
    process.env.NVIDIA_KEY ||
    process.env.NVIDIA_PI_KEY ||
    ''
  ).trim().replace(/^[\"'Bearer ]+|[\"']+$/g, '').trim();

  if (!rawKey) {
    return res.status(401).json({ error: 'NVIDIA API key not configured in Vercel environment variables.' });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    // Ensure the image is a proper data URL (NVIDIA requires full data URI)
    const imageUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const promptText = `You are a nutrition expert. Analyze this food image and return ONLY valid JSON (no markdown, no explanation).
Use this exact structure:
{
  "food_name": "Name of the dish",
  "calories": "Estimated kilocalories as a number e.g. 350 kcal",
  "health_category": "Healthy / Moderate / Unhealthy",
  "ayurvedic_nature": "Vata-balancing / Pitta-balancing / Kapha-balancing / Tridoshic",
  "suggestion": "One brief Ayurvedic tip for this meal (max 2 sentences)"
}`;

    const payload = {
      model: 'meta/llama-3.2-11b-vision-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: promptText },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
      stream: false,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout (Vercel limit is 10s)

    let response: Response;
    try {
      response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${rawKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('NVIDIA API error:', response.status, errText.slice(0, 300));
      // Friendly error messages for common NVIDIA status codes
      if (response.status === 401) return res.status(401).json({ error: 'Invalid NVIDIA API key. Please check Vercel environment variables.' });
      if (response.status === 429) return res.status(429).json({ error: 'NVIDIA API rate limit reached. Please wait a moment and try again.' });
      if (response.status === 402) return res.status(402).json({ error: 'NVIDIA API credits exhausted. Please top up your NVIDIA account.' });
      return res.status(response.status).json({ error: `AI service error (${response.status}). Please try again.` });
    }

    const data = await response.json();
    let aiText: string = data.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if present
    aiText = aiText.replace(/```(?:json)?\n?|```/g, '').trim();

    // Extract the first JSON object
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in AI response:', aiText.slice(0, 300));
      return res.status(500).json({ error: 'AI returned an unexpected response. Please try again.' });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json(parsed);

  } catch (error: any) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Analysis timed out. Please try a smaller image or try again.' });
    }
    console.error('Food analyze error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyse image.' });
  }
}
