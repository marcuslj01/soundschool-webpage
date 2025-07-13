// get order from firestore based on payment_intent (payment_id)

import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Order } from "../types/order";

export async function getOrder(payment_id: string) {
  const ordersCollection = collection(db, "orders");
  const q = query(ordersCollection, where("payment_id", "==", payment_id));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs[0]?.data() as Order | null;
}