// Server-side only Firebase Admin SDK operations
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { Order } from '../types/order';

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

export async function getOrdersByUserIdServer(userId: string) {
  const db = getFirestore();
  const ordersCollection = db.collection("orders");
  const querySnapshot = await ordersCollection.where("userId", "==", userId).get();
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    };
  });
}

export async function getAllOrdersServer() {
  const db = getFirestore();
  const ordersCollection = db.collection("orders");
  // Sort by created_at descending (newest first)
  const ordersSnapshot = await ordersCollection
    .orderBy("created_at", "desc")
    .get();
  
  return ordersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    };
  });
}

export async function getOrdersCountAndRevenueServer(): Promise<{ count: number, revenue: number }> {
  const db = getFirestore();
  const ordersCollection = db.collection("orders");
  const ordersSnapshot = await ordersCollection.get();
  
  const orders = ordersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    } as Order;
  });
  
  const count = orders.length;
  const revenue = orders.reduce((acc, order) => acc + order.total_price, 0);
  return { count, revenue };
}

export async function getOrderServer(payment_id: string) {
  const db = getFirestore();
  const ordersCollection = db.collection("orders");
  const querySnapshot = await ordersCollection.where("payment_id", "==", payment_id).get();
  const doc = querySnapshot.docs[0];
  
  if (!doc) return null;
  
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
  } as Order;
}

export async function getMonthlyOrdersStatsServer(month: Date): Promise<{ count: number, revenue: number }> {
  const db = getFirestore();
  const ordersCollection = db.collection("orders");
  
  // Get start and end of the month
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Convert to Firestore Timestamps
  const startTimestamp = Timestamp.fromDate(startOfMonth);
  const endTimestamp = Timestamp.fromDate(endOfMonth);
  
  // Query orders within the month range
  const querySnapshot = await ordersCollection
    .where("created_at", ">=", startTimestamp)
    .where("created_at", "<=", endTimestamp)
    .get();
  
  const orders = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    } as Order;
  });
  
  // Filter to only include paid orders
  const paidOrders = orders.filter(order => order.status === "paid" && !order.refunded);
  
  const count = paidOrders.length;
  const revenue = paidOrders.reduce((acc, order) => acc + order.total_price, 0);
  
  return { count, revenue };
} 