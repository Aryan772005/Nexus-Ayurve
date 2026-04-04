import { Request, Response } from "express";
import { db } from "../config/firebase";

export const logHeartRate = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  const { heartRate } = req.body;

  if (typeof heartRate !== "number") {
    return res.status(400).json({ error: "Heart rate must be a number" });
  }

  let status: "low" | "normal" | "high";
  if (heartRate < 60) {
    status = "low";
  } else if (heartRate <= 100) {
    status = "normal";
  } else {
    status = "high";
  }

  try {
    const logData = {
      userId: uid,
      heartRate,
      status,
      timestamp: new Date().toISOString(),
    };

    console.log("Attempting to log heart rate for user:", uid, logData);
    const result = await db.collection("heart_logs").add(logData);
    console.log("Heart rate logged successfully, doc ID:", result.id);
    res.status(201).json({ message: "Heart rate logged successfully", data: logData });
  } catch (error) {
    console.error("Log Heart Rate Error:", error);
    res.status(500).json({ error: "Failed to log heart rate", details: error instanceof Error ? error.message : String(error) });
  }
};

export const getHeartHistory = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  try {
    // Fetch all logs for the user and sort in memory to avoid index requirements
    const snapshot = await db.collection("heart_logs")
      .where("userId", "==", uid)
      .get();
    
    const logs = snapshot.docs.map((doc) => doc.data());
    // Sort by timestamp descending
    logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.status(200).json(logs);
  } catch (error) {
    console.error("Get Heart History Error:", error);
    res.status(500).json({ error: "Failed to get heart history" });
  }
};
