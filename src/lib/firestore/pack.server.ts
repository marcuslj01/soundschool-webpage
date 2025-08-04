// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';

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