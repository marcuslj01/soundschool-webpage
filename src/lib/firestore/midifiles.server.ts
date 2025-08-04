// Server-side only Firebase Admin SDK operations
import { getFirestore } from 'firebase-admin/firestore';

export async function getAllMidisServer() {
  const db = getFirestore();
  const midifilesCollection = db.collection("midifiles");
  const midifilesSnapshot = await midifilesCollection.get();
  
  return midifilesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate ? data.created_at.toDate() : data.created_at,
    };
  });
}

export async function deleteMidiServer(midiId: string) {
  const db = getFirestore();
  const midiRef = db.collection("midifiles").doc(midiId);
  await midiRef.delete();
} 