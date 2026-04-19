// /app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/lib/types/cartItem";

// Server-side Firestore (Admin SDK) – create a "checkout_intents" with the cart
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  const { cartItems, email, userId, fbc, fbp } = await req.json();

  const clientIpAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    null;
  const clientUserAgent = req.headers.get("user-agent") || null;

  // Create a short-lived "checkout intent" in Firestore
  const intentRef = await db.collection("checkout_intents").add({
    cartItems,
    email: email ?? null,
    userId: userId ?? null,
    fbc: fbc ?? null,
    fbp: fbp ?? null,
    clientIpAddress,
    clientUserAgent,
    createdAt: new Date(),
  });
  const intentId = intentRef.id; // short ID we can have in Stripe metadata

  // Create Stripe Checkout Session with a short ID in metadata
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: (cartItems as CartItem[]).map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.title },
        unit_amount: Math.round(
          Number(item.is_discounted ? item.discount_price : item.price) * 100
        ),
      },
      quantity: 1,
    })),
    mode: "payment",
    billing_address_collection: "auto",
    customer_email: email || undefined,
    success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/cart`,
    metadata: {
      intentId,             
      userId: userId ?? "",   
    },
  });

  return NextResponse.json({ url: session.url });
}
