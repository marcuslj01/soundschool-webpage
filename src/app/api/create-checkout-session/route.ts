// /app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/lib/types/cartItem";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const { cartItems, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cartItems.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round(Number(item.price) * 100), // Stripe expects cents
      },
      quantity: 1,
    })),
    mode: "payment",
    customer_email: email,
    success_url: `${process.env.BASE_URL}/success`,
    cancel_url: `${process.env.BASE_URL}/cart`,
    metadata: {
      cart: JSON.stringify(cartItems),
    },
  });

  return NextResponse.json({ url: session.url });
}