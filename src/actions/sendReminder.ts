"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceReminder(email: string, amount: number, invoiceId: string, appUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Kelley's Clear Headlights <noreply@stlclearheadlights.com>",
      to: email, // Note: For testing on free tier, this MUST match the verified email
      subject: "Reminder: Outstanding Invoice",
      html: `
        <h2>Invoice Reminder</h2>
        <p>Hello,</p>
        <p>This is a friendly reminder that you have an outstanding invoice for <strong>$${amount.toFixed(2)}</strong>.</p>
        <p>You can pay this securely from your Dealer Portal:</p>
        <p><a href="${appUrl}/dealer" style="display:inline-block;padding:10px 20px;background-color:#f59e0b;color:white;text-decoration:none;border-radius:5px;">Pay Now in Portal</a></p>
        <br />
        <p>Invoice ID: ${invoiceId}</p>
        <p>Thank you,<br/>Kelley's Clear Headlights</p>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
