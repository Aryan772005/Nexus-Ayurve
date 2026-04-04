import { Request, Response } from "express";
import { db, auth } from "../config/firebase";

export const getUserProfile = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Missing name" });
  }

  try {
    await db.collection("users").doc(uid).update({ name });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { uid } = (req as any).user;
  try {
    await auth.deleteUser(uid);
    await db.collection("users").doc(uid).delete();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
