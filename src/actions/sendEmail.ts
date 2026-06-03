"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(
  email: string,
  dealershipName: string,
  inviteToken: string,
  appUrl: string
) {
  try {
    const inviteLink = `${appUrl}/register?token=${inviteToken}`;
    
    const { data, error } = await resend.emails.send({
      from: "Kelley's Clear Lights <noreply@stlclearheadlights.com>",
      to: [email],
      subject: `Activate your Dealership Portal - Kelley's Clear Lights`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center; background-color: #020617; color: #ffffff;">
          <h1 style="color: #f59e0b; margin-bottom: 10px; font-weight: 900; font-style: italic;">⚡ CLEAR HEADLIGHTS</h1>
          <div style="background-color: #0f172a; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b; text-align: left;">
            <h2 style="color: #ffffff; margin-top: 0;">Welcome, ${dealershipName}!</h2>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
              We are thrilled to partner with you. Your custom Dealership CRM portal is now ready.
            </p>
            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
              Through your portal, you can schedule rapid mobile reconditioning for your aged inventory, track all invoices, and manage your "Curb Appeal" ROI.
            </p>
            <div style="text-align: center; margin: 40px 0;">
              <a href="${inviteLink}" style="display: inline-block; background-color: #f59e0b; color: #020617; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
                Activate Your Dealer Account
              </a>
            </div>
            <hr style="border-color: #1e293b; margin-top: 40px;" />
            <p style="color: #64748b; font-size: 12px; margin-top: 20px; text-align: center;">
              If you did not request this partnership, please ignore this email.<br/>
              © ${new Date().getFullYear()} Kelley's Clear Headlights. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
