"use server";

import { adminDb } from "@/lib/firebaseAdmin";
import { sendInviteEmail } from "@/actions/sendEmail";
import { FieldValue } from "firebase-admin/firestore";

interface DealerFormData {
  name: string;
  dealership: string;
  email: string;
  phone: string;
  address: string;
  inventorySize: string;
  notes: string;
}

export async function submitDealerLead(formData: DealerFormData, appUrl: string) {
  try {
    // 1. Create Lead Document
    const leadRef = await adminDb.collection("leads").add({
      ...formData,
      createdAt: FieldValue.serverTimestamp(),
      invitedAt: FieldValue.serverTimestamp(),
      status: "contacted"
    });

    // 2. Generate Invite Token & Document
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await adminDb.collection("invites").doc(token).set({
      email: formData.email,
      dealership: formData.dealership,
      name: formData.name,
      address: formData.address || "",
      leadId: leadRef.id,
      createdAt: FieldValue.serverTimestamp()
    });
    
    // 3. Send Invite Email
    const emailResult = await sendInviteEmail(formData.email, formData.dealership, token, appUrl);

    if (!emailResult.success) {
      console.error("Email failed to send:", emailResult.error);
      // We still return success as the invite is created and lead is saved
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error submitting dealer lead:", err);
    return { success: false, error: err.message || "Failed to submit lead." };
  }
}
