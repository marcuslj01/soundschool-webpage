// /app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getOrderServer } from "@/lib/firestore/order.server";
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { auth } from 'firebase-admin';
import { Order } from "@/lib/types/order";
import { OrderItem } from "@/lib/types/orderItem";

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

export async function POST(req: NextRequest) {
  try {
    const { userId, fileId, fileType, orderId, paymentId } = await req.json();

    if (!fileId || !fileType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // For guest users, we need orderId or paymentId to verify purchase
    if (!userId && !orderId && !paymentId) {
      return NextResponse.json({ error: "Guest users must provide order information" }, { status: 400 });
    }

    // Get file data first to verify it exists using server-side SDK
    const db = getFirestore();
    let downloadUrl: string;
    let fileName: string;

    if (fileType === "midi") {
      const midiDoc = await db.collection("midifiles").doc(fileId).get();
      if (!midiDoc.exists) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      const midiData = midiDoc.data()!;
      downloadUrl = midiData.file_url;
      fileName = midiData.name;
    } else if (fileType === "pack") {
      const packDoc = await db.collection("packs").doc(fileId).get();
      if (!packDoc.exists) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      const packData = packDoc.data()!;
      downloadUrl = packData.download_url;
      fileName = packData.name;
    } else if (fileType === "flp") {
      const flpDoc = await db.collection("flps").doc(fileId).get();
      if (!flpDoc.exists) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      const flpData = flpDoc.data()!;
      downloadUrl = flpData.file_url;
      fileName = flpData.name;
    } else {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Check if user is admin (if userId is provided and auth token is present)
    let isAdmin = false;
    if (userId) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split('Bearer ')[1];
          const decodedToken = await auth().verifyIdToken(token);
          const userRecord = await auth().getUser(decodedToken.uid);
          isAdmin = !!userRecord.customClaims?.admin;
        } catch (error) {
          // If token verification fails, continue with normal ownership check
          console.error("Token verification failed:", error);
        }
      }
    }

    // If user is admin, skip ownership/order verification
    if (isAdmin) {
      return NextResponse.json({ 
        downloadUrl,
        fileName 
      });
    }

    // For registered users, check if they own the file
    if (userId) {
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      
      const userData = userDoc.data()!;
      const ownedFiles = userData.ownedFiles || [];
      const ownsFile = ownedFiles.some(
        (file: { id: string; type: string }) => file.id === fileId && file.type === fileType
      );

      if (!ownsFile) {
        return NextResponse.json({ error: "You don't own this file" }, { status: 403 });
      }
    } else {
      // For guest users, verify the order contains this file
      let order;
      
      if (orderId) {
        // Get order by document ID using server-side SDK
        const orderDoc = await db.collection("orders").doc(orderId).get();
        if (!orderDoc.exists) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        const data = orderDoc.data()!;
        order = {
          ...data,
          id: orderDoc.id,
          created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
        } as Order;
      } else if (paymentId) {
        // Get order by payment_id using server-side function
        order = await getOrderServer(paymentId);
      }
      
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if order is paid
      if (order.status !== "paid") {
        return NextResponse.json({ error: "Order not paid" }, { status: 403 });
      }

      // Check if the file is in the order
      const orderContainsFile = order.orderItems.some(
        (item: OrderItem) => item.id === fileId && item.type === fileType
      );

      if (!orderContainsFile) {
        return NextResponse.json({ error: "File not found in order" }, { status: 403 });
      }
    }

    return NextResponse.json({ 
      downloadUrl,
      fileName 
    });

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}