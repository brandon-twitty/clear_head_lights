"use server";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function activateDealer(token: string, password: string) {
  try {
    // 1. Verify token
    const inviteRef = adminDb.collection("invites").doc(token);
    const inviteDoc = await inviteRef.get();
    if (!inviteDoc.exists) {
      return { success: false, error: "This invite link is invalid or has already been used." };
    }
    const invite = inviteDoc.data()!;

    // 2. Check if user exists in Auth
    let uid;
    try {
      const userRecord = await adminAuth.getUserByEmail(invite.email);
      uid = userRecord.uid;
      // User exists. The token proves they own it. Update their password to what they typed.
      await adminAuth.updateUser(uid, { password });
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        // Create user
        const newUser = await adminAuth.createUser({
          email: invite.email,
          password: password,
        });
        uid = newUser.uid;
      } else {
        throw e; // throw other errors
      }
    }

    // 3. Create the user document in Firestore with the dealer role
    await adminDb.collection("users").doc(uid).set({
      email: invite.email,
      name: invite.name,
      dealership: invite.dealership,
      address: invite.address || "",
      role: "dealer",
      createdAt: new Date().toISOString()
    });

    // 4. Mark lead as active
    if (invite.leadId) {
      await adminDb.collection("leads").doc(invite.leadId).update({ status: "active" });
    }

    // 5. Delete the one-time invite token
    await inviteRef.delete();

    return { success: true, email: invite.email };

  } catch (err: any) {
    console.error("activateDealer error:", err);
    return { success: false, error: err.message || "Failed to activate account." };
  }
}
