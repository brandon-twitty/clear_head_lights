import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || "sk_test_dummy_key", {
  apiVersion: "2026-05-27.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set.");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Retrieve the appointment ID we passed in metadata
        const appointmentId = session.metadata?.appointmentId;

        if (appointmentId) {
          // Update the appointment in Firestore to 'paid'
          await adminDb.collection("appointments").doc(appointmentId).update({
            status: "paid",
            paidAt: new Date().toISOString(),
            stripeSessionId: session.id,
          });
          console.log(`Appointment ${appointmentId} marked as paid.`);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
