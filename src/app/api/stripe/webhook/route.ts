import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { OrderItem } from "@/lib/types/orderItem";
import { CartItem } from "@/lib/types/cartItem";
import { Resend } from "resend";
import { OwnedFile } from "@/lib/types/ownedFile";
import crypto from "crypto";

// Meta Conversions API
async function sendMetaConversionEvent(data: {
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  value: number;
  currency: string;
  contentIds: string[];
  contentNames: string[];
  orderId: string;
  fbc?: string | null;
  fbp?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) {
    console.log("Meta CAPI: Missing pixelId or accessToken, skipping");
    return;
  }

  const sha256 = (value: string) =>
    crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");

  const hashedEmail = data.email ? sha256(data.email) : null;
  const hashedExternalId = data.externalId ? sha256(data.externalId) : null;
  const hashedFirstName = data.firstName ? sha256(data.firstName) : null;
  const hashedLastName = data.lastName ? sha256(data.lastName) : null;

  const eventData = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: data.orderId,
        action_source: "website",
        user_data: {
          ...(hashedEmail && { em: [hashedEmail] }),
          ...(hashedExternalId && { external_id: [hashedExternalId] }),
          ...(hashedFirstName && { fn: [hashedFirstName] }),
          ...(hashedLastName && { ln: [hashedLastName] }),
          ...(data.fbc && { fbc: data.fbc }),
          ...(data.fbp && { fbp: data.fbp }),
          ...(data.clientIpAddress && { client_ip_address: data.clientIpAddress }),
          ...(data.clientUserAgent && { client_user_agent: data.clientUserAgent }),
        },
        custom_data: {
          currency: data.currency,
          value: data.value,
          content_ids: data.contentIds,
          content_names: data.contentNames,
          content_type: "product",
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      }
    );
    const result = await response.json();
    console.log("Meta CAPI response:", result);
    
    if (!response.ok) {
      console.error("Meta CAPI error response:", result);
    }
  } catch (error) {
    console.error("Meta CAPI error:", error);
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    console.error(err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const db = getFirestore();

    // Fetch cart items via "intentId" (stored in metadata)
    const intentId = session.metadata?.intentId || null;
    let cartItems: CartItem[] = [];
    let fbc: string | null = null;
    let fbp: string | null = null;
    let clientIpAddress: string | null = null;
    let clientUserAgent: string | null = null;

    try {
      if (intentId) {
        const intentSnap = await db.collection("checkout_intents").doc(intentId).get();
        if (intentSnap.exists) {
          const intentData = intentSnap.data();
          cartItems = (intentData?.cartItems ?? []) as CartItem[];
          fbc = intentData?.fbc ?? null;
          fbp = intentData?.fbp ?? null;
          clientIpAddress = intentData?.clientIpAddress ?? null;
          clientUserAgent = intentData?.clientUserAgent ?? null;
        }
      } else if (session.metadata?.cart) {
        // Fallback for old sessions that still had cart JSON in metadata
        try {
          cartItems = JSON.parse(session.metadata.cart) as CartItem[];
        } catch {
          cartItems = [];
        }
      }
    } catch (e) {
      console.error("Failed to load cart items via intentId:", e);
    }

    // Find email
    const email =
      session.customer_email ||
      (session.customer_details && session.customer_details.email) ||
      null;



    const orderItems: OrderItem[] = [];
    for (const cartItem of cartItems) {
      if (cartItem.type === "midi") {
        const productDoc = await db.collection("midifiles").doc(cartItem.id).get();
        const productData = productDoc.data();
        if (productData) {
          const actualPrice =
            cartItem.is_discounted && cartItem.discount_price
              ? cartItem.discount_price
              : cartItem.price;

          orderItems.push({
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: actualPrice,
            originalPrice: cartItem.is_discounted ? cartItem.price : null,
            isDiscounted: cartItem.is_discounted || false,
            previewUrl: productData.preview_url,
            downloadUrl: productData.file_url,
          });
        }
      } else if (cartItem.type === "pack") {
        const productDoc = await db.collection("packs").doc(cartItem.id).get();
        const productData = productDoc.data();
        if (productData) {
          const actualPrice =
            cartItem.is_discounted && cartItem.discount_price
              ? cartItem.discount_price
              : cartItem.price;

          orderItems.push({
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: actualPrice,
            originalPrice: cartItem.is_discounted ? cartItem.price : null,
            isDiscounted: cartItem.is_discounted || false,
            previewUrl: productData.preview_url,
            downloadUrl: productData.download_url,
          });
        }
      } else if (cartItem.type === "flp") {
        const productDoc = await db.collection("flps").doc(cartItem.id).get();
        const productData = productDoc.data();
        if (productData) {
          const actualPrice =
            cartItem.is_discounted && cartItem.discount_price
              ? cartItem.discount_price
              : cartItem.price;

          orderItems.push({
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: actualPrice,
            originalPrice: cartItem.is_discounted ? cartItem.price : null,
            isDiscounted: cartItem.is_discounted || false,
            previewUrl: productData.preview_url || "",
            downloadUrl: productData.file_url || "",
          });
        }
      }
    }

    const orderData = {
      customer_email: email || "",
      customer_name: session.customer_details?.name || "",
      total_price: session.amount_total ? session.amount_total / 100 : 0,
      status: "paid",
      created_at: new Date(),
      payment_id: session.payment_intent || "",
      orderItems,
      userId: session.metadata?.userId || null,
      orderId: session.id || "",
      country: session.customer_details?.address?.country || null,
    };

    const orderRef = await db.collection("orders").add(orderData);
    const firestoreOrderId = orderRef.id;
    await orderRef.update({ orderId: firestoreOrderId });

    // Increment sales for each purchased item
    for (const item of orderItems) {
      if (item.type === "midi") {
        const midiRef = db.collection("midifiles").doc(item.id);
        await db.runTransaction(async (transaction) => {
          const midiDoc = await transaction.get(midiRef);
          const currentSales =
            midiDoc.exists && midiDoc.data()?.sales ? midiDoc.data()!.sales : 0;
          transaction.update(midiRef, { sales: currentSales + 1 });
        });
      } else if (item.type === "pack") {
        const packRef = db.collection("packs").doc(item.id);
        await db.runTransaction(async (transaction) => {
          const packDoc = await transaction.get(packRef);
          const currentSales =
            packDoc.exists && packDoc.data()?.sales ? packDoc.data()!.sales : 0;
          transaction.update(packRef, { sales: currentSales + 1 });
        });
      } else if (item.type === "flp") {
        const flpRef = db.collection("flps").doc(item.id);
        await db.runTransaction(async (transaction) => {
          const flpDoc = await transaction.get(flpRef);
          const currentSales =
            flpDoc.exists && flpDoc.data()?.sales ? flpDoc.data()!.sales : 0;
          transaction.update(flpRef, { sales: currentSales + 1 });
        });
      }
    }

    // Add new files to user's owned files
    if (orderData.userId) {
      const userRef = db.collection("users").doc(orderData.userId);
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const currentOwnedFiles: OwnedFile[] =
          userDoc.exists && userDoc.data()?.ownedFiles
            ? userDoc.data()!.ownedFiles
            : [];

        const existing = new Map(
          currentOwnedFiles.map((f: OwnedFile) => [f.id, f])
        );

        for (const it of orderItems) {
          if (!existing.has(it.id)) {
            existing.set(it.id, { id: it.id, type: it.type, name: it.title });
          }
        }
        transaction.update(userRef, { ownedFiles: Array.from(existing.values()) });
      });
    }

    // Send email with Resend
    if (email) {
      const downloadLinks = orderItems
        .map(
          (item) => `
          <li style="margin-bottom: 16px;">
            <span style="font-weight: bold; color: #222;">${item.title}</span><br/>
            <a href="${item.downloadUrl}" target="_blank" style="display: inline-block; margin-top: 6px; padding: 8px 16px; background: #6366f1; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600;">Download</a>
          </li>`
        )
        .join("");

      try {
        await resend.emails.send({
          from: "Soundschool <noreply@soundschoolmidis.com>",
          to: email,
          subject: "Thanks for your order! Here are your download links",
          html: `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #6366f1;">Thanks for your order, ${orderData.customer_name}!</h2>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                <li><strong>Email:</strong> ${orderData.customer_email}</li>
                <li><strong>Total:</strong> $${orderData.total_price}</li>
                <li><strong>Status:</strong> ${orderData.status}</li>
                <li><strong>Order ID:</strong> ${firestoreOrderId}</li>
              </ul>
              <h3 style="color: #222; margin-bottom: 12px;">Your products</h3>
              <ul style="list-style: none; padding: 0;">
                ${downloadLinks}
              </ul>
              <p style="margin-top: 32px; color: #222;">Good luck with your music!<br/>- The Soundschool Team</p>
            </div>`,
        });
      } catch (err) {
        console.error("Error sending email with Resend:", err);
      }

      try {
        await resend.emails.send({
          from: "Soundschool <noreply@soundschoolmidis.com>",
          to: "schoolsound18@gmail.com",
          subject: `New sale of $${orderData.total_price}!`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #6366f1;">You have a new sale!</h2>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                <li><strong>Customer name:</strong> ${orderData.customer_name}</li>
                <li><strong>Customer email:</strong> ${orderData.customer_email}</li>
                <li><strong>Country:</strong> ${session.customer_details?.address?.country || "Unknown"}</li>
                <li><strong>Order ID:</strong> ${firestoreOrderId}</li>
                <li><strong>Status:</strong> ${orderData.status}</li>
                <li><strong>Total:</strong> $${orderData.total_price}</li>
                <li><strong>Products:</strong> ${orderItems.map((i) => i.title).join(", ")}</li>
              </ul>
            </div>`,
        });
      } catch (err) {
        console.error("Error sending email with Resend:", err);
      }
    }

    // Send to Meta Conversions API when order complete
    const fullName = session.customer_details?.name ?? "";
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? null;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;

    await sendMetaConversionEvent({
      email: email,
      firstName,
      lastName,
      value: orderData.total_price,
      currency: "USD",
      contentIds: orderItems.map((item) => item.id),
      contentNames: orderItems.map((item) => item.title),
      orderId: firestoreOrderId,
      fbc,
      fbp,
      externalId: orderData.userId,
      clientIpAddress,
      clientUserAgent,
    });

    // Delete intent when order is complete
    if (intentId) {
      try {
        await db.collection("checkout_intents").doc(intentId).delete();
      } catch (e) {
        console.error("Error deleting checkout intent:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
