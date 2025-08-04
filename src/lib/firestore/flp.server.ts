// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';

export async function getFLPsServer() {
  const db = getFirestore();
  const flpsCollection = db.collection("flps");
  const flpsSnapshot = await flpsCollection.get();
  
  return flpsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    };
  });
}

export async function deleteFLPServer(flpId: string) {
  const db = getFirestore();
  const flpRef = db.collection("flps").doc(flpId);
  await flpRef.delete();
} 