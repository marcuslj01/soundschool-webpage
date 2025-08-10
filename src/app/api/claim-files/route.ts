// src/app/api/claim-files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
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

export async function POST(req: NextRequest) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing uid or email" },
        { status: 400 }
      );
    }

    const db = getFirestore();

    // Check if user exists
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get all orders with this email using server-side SDK
    const ordersQuery = await db
      .collection("orders")
      .where("customer_email", "==", email)
      .get();

    if (ordersQuery.empty) {
      return NextResponse.json({
        success: false,
        claimedCount: 0,
        message: "No orders found with this email address.",
      });
    }

    const orders = ordersQuery.docs.map((doc) => doc.data());

    // Get current owned files
    const currentOwnedFiles: OwnedFile[] = userDoc.data()?.ownedFiles || [];
    const existingFilesMap = new Map(
      currentOwnedFiles.map((file: OwnedFile) => [file.id, file])
    );

    // Extract all files from orders
    const newOwnedFiles: OwnedFile[] = [];
    let claimedCount = 0;

    for (const order of orders) {
      for (const orderItem of order.orderItems) {
        // Only add if not already owned
        if (!existingFilesMap.has(orderItem.id)) {
          const ownedFile: OwnedFile = {
            id: orderItem.id,
            type: orderItem.type,
            name: orderItem.title,
          };
          existingFilesMap.set(orderItem.id, ownedFile);
          newOwnedFiles.push(ownedFile);
          claimedCount++;
        }
      }
    }

    if (claimedCount === 0) {
      return NextResponse.json({
        success: true,
        claimedCount: 0,
        message: "All files from your previous orders are already claimed.",
      });
    }

    // Update user with new owned files
    const updatedOwnedFiles = Array.from(existingFilesMap.values());
    await userRef.update({ ownedFiles: updatedOwnedFiles });

    return NextResponse.json({
      success: true,
      claimedCount,
      message: `Successfully claimed ${claimedCount} files from your previous orders!`,
    });
  } catch (error) {
    console.error("Error claiming files:", error);
    return NextResponse.json(
      { error: "Failed to claim files" },
      { status: 500 }
    );
  }
}