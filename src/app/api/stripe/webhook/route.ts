import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, doc, getDoc, runTransaction } from "firebase/firestore";
import { OrderItem } from "@/lib/types/orderItem";
import { CartItem } from "@/lib/types/cartItem";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log("Stripe webhook endpoint called");
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
      customer_name: session.customer_details?.name || "",
      total_price: session.amount_total ? session.amount_total / 100 : 0,
      status: "paid",
      created_at: Timestamp.now(),
      payment_id: session.payment_intent,
      orderItems: orderItems,
    };

    await addDoc(collection(db, "orders"), orderData);

    // Increment sales for each purchased midi file
    for (const item of orderItems) {
      if (item.type === "midi") {
        const midiRef = doc(db, "midifiles", item.id);
        try {
          await runTransaction(db, async (transaction) => {
            const midiDoc = await transaction.get(midiRef);
            const currentSales = midiDoc.exists() && midiDoc.data().sales ? midiDoc.data().sales : 0;
            transaction.update(midiRef, { sales: currentSales + 1 });
          });
        } catch (err) {
          console.error(`Error updating sales for midi file ${item.id}:`, err);
        }
      }
    }

    // Send email with Resend
    if (email) {
      const downloadLinks = orderItems.map(
        (item) => `
          <li style="margin-bottom: 16px;">
            <span style="font-weight: bold; color: #222;">${item.title}</span><br/>
            <a href="${item.downloadUrl}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 8px 16px; background: #6366f1; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600;">Download</a>
          </li>
        `
      ).join("");
      console.log("Sender e-post til:", email);
      console.log("E-postinnhold:", downloadLinks);

      // Mail to customer
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Thanks for your order! Here are your download links",
          html: `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #6366f1;">Thanks for your order, ${orderData.customer_name}!</h2>
              <p style="color: #222;">Here are the details of your order:</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
              <li><strong>Email:</strong> ${orderData.customer_email}</li>
              <li><strong>Total:</strong> $${orderData.total_price}</li>
              <li><strong>Status:</strong> ${orderData.status}</li>
              <li><strong>Order ID:</strong> ${orderData.payment_id}</li>
              </ul>
              <h3 style="color: #222; margin-bottom: 12px;">Your products</h3>
              <ul style="list-style: none; padding: 0;">
                ${downloadLinks}
              </ul>
              <p style="margin-top: 32px; color: #222;">Good luck with your music!<br/>- The Soundschool Team</p>
            </div>
          `,
        });
        console.log("E-post sendt!");
      } catch (err) {
        console.error("Error sending email with Resend:", err);
      }

      // Mail to admin
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "schoolsound18@gmail.com",
          subject: "Soundschool: You have a new sale!",
          html: `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #6366f1;">You have a new sale!</h2>
              <p style="color: #222;">Here are the details of the order:</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                <li><strong>Customer name:</strong> ${orderData.customer_name}</li>
                <li><strong>Customer email:</strong> ${orderData.customer_email}</li>
                <li><strong>Order ID:</strong> ${orderData.payment_id}</li>
                <li><strong>Status:</strong> ${orderData.status}</li>
                <li><strong>Total:</strong> $${orderData.total_price}</li>
                <li><strong>Products:</strong> ${orderItems.map((item) => item.title).join(", ")}</li>
              </ul>
            </div>
          `,
        });
        console.log("E-post sent!");
      } catch (err) {
        console.error("Error sending email with Resend:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}