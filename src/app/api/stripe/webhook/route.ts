import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { OrderItem } from "@/lib/types/orderItem";
import { CartItem } from "@/lib/types/cartItem";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    console.error(err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_email ||
      (session.customer_details && session.customer_details.email) ||
      null;
    const cartItems = session.metadata?.cart ? JSON.parse(session.metadata.cart) as CartItem[] : [];

    // Get full product data for each item
    const orderItems: OrderItem[] = [];
    for (const cartItem of cartItems) {
      if (cartItem.type === "midi") {
        // Get product data from midifiles collection
        const productDoc = await getDoc(doc(db, "midifiles", cartItem.id));
        const productData = productDoc.data();
        
        if (productData) {
          orderItems.push({
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: cartItem.price,
            previewUrl: productData.preview_url,
            downloadUrl: productData.file_url,
          });
        }
      }
      // TODO: Add support for "pack" type
    }

    const orderData = {
      customer_email: email,
      total_price: session.amount_total ? session.amount_total / 100 : 0,
      status: "paid",
      created_at: Timestamp.now(),
      payment_id: session.payment_intent,
      orderItems: orderItems,
    };

    await addDoc(collection(db, "orders"), orderData);
  }

  return NextResponse.json({ received: true });
}