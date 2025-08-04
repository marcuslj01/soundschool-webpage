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