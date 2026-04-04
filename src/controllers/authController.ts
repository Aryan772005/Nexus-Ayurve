import { Request, Response } from "express";
import { auth, db } from "../config/firebase";
import firebaseConfig from "../../firebase-applet-config.json";
import axios from "axios";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Store user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "User registered successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    // Use Firebase Auth REST API for login
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    res.status(200).json({
      message: "Login successful",
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      localId: response.data.localId,
    });
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const syncUser = async (req: Request, res: Response) => {
  const { uid, email, name, picture } = (req as any).user;
  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    const userData = {
      uid,
      email,
      name: name || email.split('@')[0],
      photoURL: picture || "",
      lastLogin: new Date().toISOString(),
    };

    if (!userDoc.exists) {
      await userRef.set({
        ...userData,
        createdAt: new Date().toISOString(),
      });
    } else {
      await userRef.update(userData);
    }

    res.status(200).json({ message: "User synced successfully", user: userData });
  } catch (error) {
    console.error("Sync User Error:", error);
    res.status(500).json({ error: "Failed to sync user data" });
  }
};
