import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { OrderItem } from "@/lib/types/orderItem";
import { CartItem } from "@/lib/types/cartItem";
import { Resend } from "resend";
import { OwnedFile } from "@/lib/types/ownedFile";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const resend = new Resend(process.env.RESEND_API_KEY);

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
    console.log("Processing checkout.session.completed event");
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log("Full session object:", JSON.stringify(session, null, 2)); // Debug
    console.log("Session metadata:", session.metadata); // Debug
    
    const email =
      session.customer_email ||
      (session.customer_details && session.customer_details.email) ||
      null;
    const cartItems = session.metadata?.cart ? JSON.parse(session.metadata.cart) as CartItem[] : [];

    console.log("Parsed cart items:", cartItems); // Debug

    // Get full product data for each item using server-side SDK
    const db = getFirestore();
    const orderItems: OrderItem[] = [];
    
    for (const cartItem of cartItems) {
      console.log("Processing cart item:", cartItem); // Debug
      
      if (cartItem.type === "midi") {
        // Get product data from midifiles collection
        const productDoc = await db.collection("midifiles").doc(cartItem.id).get();
        const productData = productDoc.data();
        
        console.log("MIDI product data:", productData); // Debug
        
        if (productData) {
          const actualPrice = cartItem.is_discounted && cartItem.discount_price ? cartItem.discount_price : cartItem.price;
          
          const orderItem: OrderItem = {
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: actualPrice,
            originalPrice: cartItem.is_discounted ? cartItem.price : null,
            isDiscounted: cartItem.is_discounted || false,
            previewUrl: productData.preview_url,
            downloadUrl: productData.file_url,
          };
          
          orderItems.push(orderItem);
          console.log("Added MIDI order item:", orderItem); // Debug
        } else {
          console.log("No product data found for MIDI ID:", cartItem.id); // Debug
        }
      } else if (cartItem.type === "pack") {
        // Get product data from packs collection
        const productDoc = await db.collection("packs").doc(cartItem.id).get();
        const productData = productDoc.data();
        
        console.log("Pack product data:", productData); // Debug
        
        if (productData) {
          const actualPrice = cartItem.is_discounted && cartItem.discount_price ? cartItem.discount_price : cartItem.price;
          
          const orderItem: OrderItem = {
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: actualPrice,
            originalPrice: cartItem.is_discounted ? cartItem.price : null,
            isDiscounted: cartItem.is_discounted || false,
            previewUrl: productData.preview_url,
            downloadUrl: productData.download_url,
          };
          
          orderItems.push(orderItem);
          console.log("Added Pack order item:", orderItem); // Debug
        } else {
          console.log("No product data found for Pack ID:", cartItem.id); // Debug
        }
      } else if (cartItem.type === "flp") {
        // Get product data from flps collection
        const productDoc = await db.collection("flps").doc(cartItem.id).get();
        const productData = productDoc.data();
        
        console.log("FLP product data:", productData); // Debug
        
        if (productData) {
          const actualPrice = cartItem.is_discounted && cartItem.discount_price ? cartItem.discount_price : cartItem.price;
          
          const orderItem: OrderItem = {
            id: cartItem.id,
            type: cartItem.type,
            title: cartItem.title,
            price: actualPrice,
            originalPrice: cartItem.is_discounted ? cartItem.price : null,
            isDiscounted: cartItem.is_discounted || false,
            previewUrl: productData.preview_url,
            downloadUrl: productData.download_url,
          };
          
          orderItems.push(orderItem);
          console.log("Added FLP order item:", orderItem); // Debug
        } else {
          console.log("No product data found for FLP ID:", cartItem.id); // Debug
        }
      }
    }

    console.log("Final orderItems array:", orderItems); // Debug
    
    const orderData = {
      customer_email: email,
      customer_name: session.customer_details?.name || "",
      total_price: session.amount_total ? session.amount_total / 100 : 0,
      status: "paid",
      created_at: new Date(),
      payment_id: session.payment_intent,
      orderItems: orderItems,
      userId: session.metadata?.userId || null,
      orderId: session.id,
    };

    // Save order and get document ID using server-side SDK
    const orderRef = await db.collection("orders").add(orderData);
    const firestoreOrderId = orderRef.id;

    // Update orderData with correct orderId
    await orderRef.update({ orderId: firestoreOrderId });

    // Increment sales for each purchased item
    for (const item of orderItems) {
      if (item.type === "midi") {
        const midiRef = db.collection("midifiles").doc(item.id);
        try {
          await db.runTransaction(async (transaction) => {
            const midiDoc = await transaction.get(midiRef);
            const currentSales = midiDoc.exists && midiDoc.data()?.sales ? midiDoc.data()!.sales : 0;
            transaction.update(midiRef, { sales: currentSales + 1 });
          });
        } catch (err) {
          console.error(`Error updating sales for midi file ${item.id}:`, err);
        }
      } else if (item.type === "pack") {
        const packRef = db.collection("packs").doc(item.id);
        try {
          await db.runTransaction(async (transaction) => {
            const packDoc = await transaction.get(packRef);
            const currentSales = packDoc.exists && packDoc.data()?.sales ? packDoc.data()!.sales : 0;
            transaction.update(packRef, { sales: currentSales + 1 });
          });
        } catch (err) {
          console.error(`Error updating sales for pack ${item.id}:`, err);
        }
      } else if (item.type === "flp") {
        const flpRef = db.collection("flps").doc(item.id);
        try {
          await db.runTransaction(async (transaction) => {
            const flpDoc = await transaction.get(flpRef);
            const currentSales = flpDoc.exists && flpDoc.data()?.sales ? flpDoc.data()!.sales : 0;
            transaction.update(flpRef, { sales: currentSales + 1 });
          });
        } catch (err) {
          console.error(`Error updating sales for flp ${item.id}:`, err);
        }
      }
    }

    // Add new files to user's owned files
    if (orderData.userId) {
      const userRef = db.collection("users").doc(orderData.userId);
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const currentOwnedFiles: OwnedFile[] = userDoc.exists && userDoc.data()?.ownedFiles ? userDoc.data()!.ownedFiles : [];
        
        // Create a map of existing files to avoid duplicates
        const existingFilesMap = new Map(currentOwnedFiles.map((file: OwnedFile) => [file.id, file]));
        
        // Convert OrderItems to OwnedFiles
        const newOwnedFiles: OwnedFile[] = orderItems.map((item: OrderItem) => ({
          id: item.id,
          type: item.type,
          name: item.title,
        }));
        
        // Only add files that don't already exist
        for (const newFile of newOwnedFiles) {
          if (!existingFilesMap.has(newFile.id)) {
            existingFilesMap.set(newFile.id, newFile);
          }
        }
        
        const updatedOwnedFiles = Array.from(existingFilesMap.values());
        transaction.update(userRef, { ownedFiles: updatedOwnedFiles });
      });
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
          from: "noreply@soundschoolmidis.com",
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
              <li><strong>Order ID:</strong> ${firestoreOrderId}</li>
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
          from: "noreply@soundschoolmidis.com",
          to: "schoolsound18@gmail.com",
          bcc: ["marcus.l.jakobsen@gmail.com", "philipljung04@gmail.com"], 
          subject: "You have a new sale!",
          html: `
            <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
              <h2 style="color: #6366f1;">You have a new sale!</h2>
              <p style="color: #222;">Here are the details of the order:</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
                <li><strong>Customer name:</strong> ${orderData.customer_name}</li>
                <li><strong>Customer email:</strong> ${orderData.customer_email}</li>
                <li><strong>Order ID:</strong> ${firestoreOrderId}</li> 
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