// get order from firestore based on payment_intent (payment_id)

import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Order } from "../types/order";

export async function getOrder(payment_id: string) {
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("payment_id", "==", payment_id));
  const querySnapshot = await getDocs(q);
  const doc = querySnapshot.docs[0];
  if (!doc) return null;
  
  return {
    ...doc.data(),
    id: doc.id, // Document ID
  } as Order;
}

export async function getOrdersByUserId(userId: string) {
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id, // Document ID
  } as Order));
}