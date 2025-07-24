// get order from firestore based on payment_intent (payment_id)

import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Order } from "../types/order";

// Legg til Admin SDK versjon
import { getFirestore } from 'firebase-admin/firestore';

export async function getOrder(payment_id: string) {
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("payment_id", "==", payment_id));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];
  if (!doc) return null;
  
  const data = doc.data();
  return {
    ...data,
    id: doc.id, // Document ID
    created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
  } as Order;
}

// Client-side version of getOrdersByUserId
export async function getOrdersByUserId(userId: string) {
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id, // Document ID
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    } as Order;
  });
}

// Server-side version of getOrdersByUserId
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

export async function getAllOrders() {
  const ordersCollection = collection(db, "orders");
  const querySnapshot = await getDocs(ordersCollection);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id, // Document ID
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    } as Order;
  });
}

export async function getOrdersCountAndRevenue(): Promise<{ count: number, revenue: number }> {
  const ordersCollection = collection(db, "orders");
  const ordersQuery = query(ordersCollection);
  const ordersSnapshot = await getDocs(ordersQuery);
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