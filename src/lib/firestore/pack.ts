import { addDoc, collection, doc, getDoc, getDocs, Timestamp, query, orderBy, limit } from "firebase/firestore";
import { Pack, PackInput } from "../types/pack";
import { db } from "../firebase";

export async function addPack(pack: PackInput) {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packsCollection = collection(db, "packs");
    await addDoc(packsCollection, {
        ...pack,
        created_at: Timestamp.now(),
    });
}

export async function getPacks() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
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
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
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

export async function getLatestPack() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const packsCollection = collection(db, "packs");
    const q = query(packsCollection, orderBy("created_at", "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        return null;
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        created_at: data.created_at.toDate(),
    } as Pack;
}