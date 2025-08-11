// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

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

export async function deleteUserServer(uid: string) {
  const db = getFirestore();
  
  // Delete user's orders first
  const ordersCollection = db.collection("orders");
  const ordersQuery = ordersCollection.where("userId", "==", uid);
  const ordersSnapshot = await ordersQuery.get();
  
  const orderDeletions = ordersSnapshot.docs.map(doc => doc.ref.delete());
  await Promise.all(orderDeletions);
  
  // Then delete user document
  const userRef = db.collection("users").doc(uid);
  await userRef.delete();
  
  console.log(`Deleted user ${uid} and ${ordersSnapshot.docs.length} orders`);
}

export async function getUsersCountServer(): Promise<number> {
  const db = getFirestore();
  const usersCollection = db.collection("users");
  const usersSnapshot = await usersCollection.get();
  return usersSnapshot.size;
}

export async function getAllUsersServer() {
  const db = getFirestore();
  const usersCollection = db.collection("users");
  const usersSnapshot = await usersCollection.get();
  
  return usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      uid: doc.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : data.lastLoginAt,
    };
  });
} 