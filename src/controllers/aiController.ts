import { Request, Response } from "express";
import { analyzeSymptoms } from "../services/aiService";

export const getAIAnalysis = async (req: Request, res: Response) => {
  const { symptoms } = req.body;
  if (!symptoms) {
    return res.status(400).json({ error: "Missing symptoms" });
  }

  try {
    const analysis = await analyzeSymptoms(symptoms);
    res.status(200).json(analysis);
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: "Failed to analyze symptoms" });
  }
};
