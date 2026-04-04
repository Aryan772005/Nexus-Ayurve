export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawKey = process.env.NVIDIA_API_KEY || '';
  const apiKey = rawKey.trim();

  // If no NVIDIA key, we fallback
  if (!apiKey) {
    return res.status(401).json({ error: "API Key not configured." });
  }

  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Prompt structured to extract the required info
    const promptText = `Analyze this food image. Provide ONLY a JSON response without markdown formatting. You must detect the food and estimate its details. Follow this exact JSON structure:
    {
      "food_name": "Name of dish",
      "calories": "Number kcal",
      "health_category": "Healthy / Moderate / Unhealthy",
      "ayurvedic_nature": "Vata / Pitta / Kapha effect",
      "suggestion": "Brief Ayurvedic suggestion"
    }`;

    // Formatting payload for NVIDIA specific vision model or openai-compatible vision model
    const payload = {
      model: "meta/llama-3.2-11b-vision-instruct", // Typical NVIDIA vision model endpoint
      messages: [
        { 
          role: "user", 
          content: [
            { type: "text", text: promptText },
            { type: "image_url", image_url: { url: imageBase64 } }
          ] 
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
    };

    console.log("Sending image to NVIDIA AI for analysis...");

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA API error:", response.status, errText);
      throw new Error(`NVIDIA API error: ${response.status}`);
    }

    const data = await response.json();
    let aiText = data.choices?.[0]?.message?.content || "";
    
    console.log("Raw AI response:", aiText);

    // Clean potential markdown quotes
    aiText = aiText.replace(/```json\n?|```/g, '').trim();
    
    try {
      const parsed = JSON.parse(aiText);
      console.log("Successfully parsed AI response");
      return res.status(200).json(parsed);
    } catch {
      console.error("Failed to parse JSON from AI response:", aiText);
      throw new Error("Invalid format from AI");
    }
  } catch (error: any) {
    console.error("Food analyze error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze image." });
  }
}

