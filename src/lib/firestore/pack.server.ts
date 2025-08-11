// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { PackInput } from '../types/pack';

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

export async function addPackServer(packFile: PackInput) {
  const db = getFirestore();
  const packsCollection = db.collection("packs");
  await packsCollection.add({
    ...packFile,
    created_at: new Date(),
  });
}

export async function getPacksServer() {
  const db = getFirestore();
  const packsCollection = db.collection("packs");
  const packsSnapshot = await packsCollection.get();
  
  return packsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    };
  });
}

export async function deletePackServer(packId: string) {
  const db = getFirestore();
  const packRef = db.collection("packs").doc(packId);
  await packRef.delete();
} 