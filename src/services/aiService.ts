import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeSymptoms = async (symptoms: string) => {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables.");
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
  const prompt = `As an Ayurvedic assistant for Nexus Ayurve, analyze the following symptoms and provide a structured response in JSON format.
Symptoms: ${symptoms}

Expected JSON structure (strictly return ONLY valid JSON with no markdown wrapping):
{
  "possibleDisease": "string",
  "ayurvedicSuggestion": "string",
  "precautions": ["string"]
}`;

  try {
    const result = await model.generateContent(prompt);
    let content = result.response.text().trim();
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
