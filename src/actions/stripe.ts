"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || "sk_test_dummy_key", {
  apiVersion: "2026-05-27.dahlia", // matching installed types
});

export async function createCheckoutSession(appointmentId: string, carsCount: number, dealerEmail: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";
    const priceId = process.env.NEXT_PUBLIC_STRIPE_DEALERSHIP_SET_PRICE_ID;
    
    if (!priceId) {
      throw new Error("Stripe Price ID not configured");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: dealerEmail,
      line_items: [
        {
          price: priceId,
          quantity: carsCount,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dealer?payment=success&appointmentId=${appointmentId}`,
      cancel_url: `${origin}/dealer?payment=canceled&appointmentId=${appointmentId}`,
      metadata: {
        appointmentId: appointmentId,
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { error: error.message };
  }
}
