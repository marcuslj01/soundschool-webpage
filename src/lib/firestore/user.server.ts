// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';

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