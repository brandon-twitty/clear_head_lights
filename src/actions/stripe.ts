"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || "sk_test_dummy_key", {
  apiVersion: "2026-05-27.dahlia", // matching installed types
});

export async function createPaymentIntent(appointmentId: string, carsCount: number, dealerEmail: string) {
  try {
    // 4500 cents = $45.00
    const amount = carsCount * 4500;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      receipt_email: dealerEmail,
      metadata: {
        appointmentId: appointmentId,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error("Stripe PaymentIntent Error:", error);
    return { error: error.message };
  }
}
