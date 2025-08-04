// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';
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
  const ordersSnapshot = await ordersCollection.get();
  
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