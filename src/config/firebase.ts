import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
    console.log("Firebase Admin initialized for project:", firebaseConfig.projectId);
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

// Initialize Firestore
// Try to use the named database if provided, otherwise fallback to default
let firestoreDb;
try {
  firestoreDb = getFirestore(firebaseConfig.firestoreDatabaseId || "(default)");
  console.log("Firestore initialized with database ID:", firebaseConfig.firestoreDatabaseId || "(default)");
} catch (error) {
  console.warn("Failed to initialize Firestore with named database, falling back to default:", error);
  firestoreDb = getFirestore();
}

export const db = firestoreDb;
export const auth = admin.auth();
export default admin;
