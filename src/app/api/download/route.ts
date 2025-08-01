// /app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOwnedFiles } from "@/lib/firestore/user";
import { getMidiById } from "@/lib/firestore/midifiles";
import { getPack } from "@/lib/firestore/pack";
import { getOrder } from "@/lib/firestore/order";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Order } from "@/lib/types/order";
import { OrderItem } from "@/lib/types/orderItem";

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

    // Get file data first to verify it exists
    let downloadUrl: string;
    let fileName: string;

    if (fileType === "midi") {
      const midi = await getMidiById(fileId);
      if (!midi) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      downloadUrl = midi.file_url;
      fileName = midi.name;
    } else if (fileType === "pack") {
      const pack = await getPack(fileId);
      if (!pack) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      downloadUrl = pack.download_url;
      fileName = pack.name;
    } else {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // For registered users, check if they own the file
    if (userId) {
      const ownedFiles = await getOwnedFiles(userId);
      const ownsFile = ownedFiles.some(
        (file) => file.id === fileId && file.type === fileType
      );

      if (!ownsFile) {
        return NextResponse.json({ error: "You don't own this file" }, { status: 403 });
      }
    } else {
      // For guest users, verify the order contains this file
      let order;
      
      if (orderId) {
        // Get order by document ID
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (!orderDoc.exists()) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        const data = orderDoc.data();
        order = {
          ...data,
          id: orderDoc.id,
          created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
        } as Order;
      } else if (paymentId) {
        // Get order by payment_id
        order = await getOrder(paymentId);
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