import { Request, Response } from "express";
import { db } from "../config/firebase";

export const createAppointment = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  const { name, age, problem, preferredDate } = req.body;

  if (!name || !age || !problem || !preferredDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const appointmentRef = db.collection("appointments").doc();
    const appointmentData = {
      id: appointmentRef.id,
      userId: uid,
      name,
      age,
      problem,
      preferredDate,
      createdAt: new Date().toISOString(),
    };

    console.log("Attempting to book appointment for user:", uid, appointmentData);
    await appointmentRef.set(appointmentData);
    console.log("Appointment booked successfully, doc ID:", appointmentRef.id);
    res.status(201).json({
      message: "Call 9475002048 to confirm appointment",
      appointment: appointmentData,
    });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({ error: "Failed to create appointment", details: error instanceof Error ? error.message : String(error) });
  }
};

export const getUserAppointments = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  try {
    const snapshot = await db.collection("appointments").where("userId", "==", uid).get();
    const appointments = snapshot.docs.map((doc) => doc.data());
    // Sort by preferredDate ascending
    appointments.sort((a: any, b: any) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime());
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  const { id } = req.params;

  try {
    const appointmentDoc = await db.collection("appointments").doc(id).get();
    if (!appointmentDoc.exists) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointmentDoc.data()?.userId !== uid) {
      return res.status(403).json({ error: "Unauthorized to delete this appointment" });
    }

    await db.collection("appointments").doc(id).delete();
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
