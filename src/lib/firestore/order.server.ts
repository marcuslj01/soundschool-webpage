// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';

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