import { addDoc, collection, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { Pack, PackInput } from "../types/pack";
import { db } from "../firebase";

export async function addPack(pack: PackInput) {
    const packsCollection = collection(db, "packs");
    await addDoc(packsCollection, {
        ...pack,
        created_at: Timestamp.now(),
    });
}

export async function getPacks() {
    const packsCollection = collection(db, "packs");
    const snapshot = await getDocs(packsCollection);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as Pack;
    });
}

export async function getPack(id: string): Promise<Pack | null> {
    const packDoc = doc(db, "packs", id);
    const packSnapshot = await getDoc(packDoc);
    
    if (!packSnapshot.exists()) {
        return null;
    }
    
    const data = packSnapshot.data();
    return {
        ...data,
        id: packSnapshot.id,
        created_at: data.created_at.toDate(),
    } as Pack;
}