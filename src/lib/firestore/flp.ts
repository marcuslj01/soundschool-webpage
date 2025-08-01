import { addDoc, collection, doc, getDoc, getDocs, Timestamp, query, orderBy, limit, deleteDoc } from "firebase/firestore";
import { FLP, FLPInput } from "../types/FLP";
import { db } from "../firebase";

export async function addFLP(flp: FLPInput) {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpsCollection = collection(db, "flps");
    await addDoc(flpsCollection, {
        ...flp,
        created_at: Timestamp.now(),
    });
}

export async function getFLPs() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpsCollection = collection(db, "flps");
    const snapshot = await getDocs(flpsCollection);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as FLP;
    });
}

export async function getFLP(id: string): Promise<FLP | null> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpDoc = doc(db, "flps", id);
    const flpSnapshot = await getDoc(flpDoc);
    
    if (!flpSnapshot.exists()) {
        return null;
    }
    
    const data = flpSnapshot.data();
    return {
        ...data,
        id: flpSnapshot.id,
        created_at: data.created_at.toDate(),
    } as FLP;
}

// Get latest 3 FLPs
export async function getLatestFLPs() {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    const flpsCollection = collection(db, "flps");
    const q = query(flpsCollection, orderBy("created_at", "desc"), limit(3));
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
    } as FLP;
}

// Delete FLP
export async function deleteFLP(id: string): Promise<boolean> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    
    try {
        const flpDoc = doc(db, "flps", id);
        await deleteDoc(flpDoc);
        return true;
    } catch (error) {
        console.error("Error deleting FLP:", error);
        return false;
    }
} 