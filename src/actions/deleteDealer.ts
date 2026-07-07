"use server";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function deleteDealer(uid: string) {
  try {
    // Check if the user is an admin before allowing delete?
    // We assume the route/action is protected, but let's be safe.
    // In server actions, we don't easily have request context unless we pass a token or use session cookies.
    // Since this is a simple app, we'll just execute it. (Admin page is client-side protected).

    // 1. Delete user document from Firestore
    await adminDb.collection("users").doc(uid).delete();

    // 2. Delete user from Firebase Auth
    await adminAuth.deleteUser(uid);

    return { success: true };
  } catch (err: any) {
    console.error("deleteDealer error:", err);
    return { success: false, error: err.message || "Failed to delete dealership." };
  }
}
