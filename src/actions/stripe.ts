"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20", // using standard modern version
});

export async function createCheckoutSession(invoiceId: string, amount: number, dealerEmail: string, description: string) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: dealerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description,
              description: `Invoice ID: ${invoiceId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dealer?payment=success`,
      cancel_url: `${origin}/dealer?payment=canceled`,
      metadata: {
        invoiceId: invoiceId,
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return { error: error.message };
  }
}
