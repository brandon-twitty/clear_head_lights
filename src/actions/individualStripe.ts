"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || "sk_test_dummy_key", {
  apiVersion: "2026-05-27.dahlia", // matching installed types
});

export async function createIndividualPaymentIntent(
  appointmentId: string, 
  amountInCents: number, 
  userEmail: string,
  productId: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      receipt_email: userEmail,
      metadata: {
        appointmentId: appointmentId,
        productId: productId,
        type: "individual",
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error("Stripe PaymentIntent Error:", error);
    return { error: error.message };
  }
}
