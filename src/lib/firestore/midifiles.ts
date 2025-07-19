import { db } from "../firebase";
import { collection, addDoc, getDocs, Timestamp, query, orderBy, limit } from "firebase/firestore";
import { Midi, MidiInput } from "../types/midi";


export async function addMidi(midiFile: MidiInput) {
    const midiFilesCollection = collection(db, "midifiles");
    await addDoc(midiFilesCollection, {
        ...midiFile,
        created_at: Timestamp.now(),
    });
}

export async function getMidi(limitCount?: number) {
    const midiFilesCollection = collection(db, "midifiles");
    let q = query(midiFilesCollection, orderBy("created_at", "desc"));
    
    if (limitCount) {
        q = query(midiFilesCollection, orderBy("created_at", "desc"), limit(limitCount));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as Midi;
    });
}

