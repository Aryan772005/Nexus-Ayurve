import axios from "axios";

export const analyzeSymptoms = async (symptoms: string) => {
  let apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured in the environment variables.");
  }

  // Strip 'Bearer ' if the user included it in the environment variable
  if (apiKey.startsWith('Bearer ')) {
    apiKey = apiKey.substring(7);
  }

  const prompt = `As an Ayurvedic assistant for Ayurcare+, analyze the following symptoms and provide a structured response in JSON format.
  Symptoms: ${symptoms}
  
  Expected JSON structure:
  {
    "possibleDisease": "string",
    "ayurvedicSuggestion": "string",
    "precautions": ["string"]
  }`;

  try {
    const response = await axios.post("https://integrate.api.nvidia.com/v1/chat/completions", {
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: "You are a helpful Ayurvedic health assistant. Always respond in valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      }
    });

    let content = response.data.choices[0].message.content;
    
    // Handle potential markdown blocks
    if (typeof content === 'string') {
      content = content.replace(/```json\n?|```/g, '').trim();
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", content);
        throw new Error("Invalid AI response format");
      }
    }
    return content;
  } catch (error: any) {
    console.error("AI Analysis Error:", error.response?.data || error.message);
    throw new Error("Failed to analyze symptoms using NVIDIA LLM");
  }
};
