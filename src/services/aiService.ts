export const analyzeSymptoms = async (symptoms: string) => {
  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  if (!groqKey) {
    throw new Error("GROQ_API_KEY is not configured in the environment variables.");
  }

  const prompt = `As an Ayurvedic assistant for Nexus Ayurve, analyze the following symptoms and provide a structured response in JSON format.
Symptoms: ${symptoms}

Expected JSON structure (strictly return ONLY valid JSON with no markdown wrapping):
{
  "possibleDisease": "string",
  "ayurvedicSuggestion": "string",
  "precautions": ["string"]
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
    const data = await response.json();
    let content = (data.choices?.[0]?.message?.content || '').trim();
    content = content.replace(/```(?:json)?\n?|```/g, '').trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid response format from AI");
  } catch (error: any) {
    console.error("AI Analysis Error:", error?.message || error);
    throw new Error(error?.message || "Failed to analyze symptoms using AI");
  }
};
