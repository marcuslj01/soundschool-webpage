import { db } from "../firebase";
import { collection, addDoc, getDocs, getDoc, doc, Timestamp, query, orderBy, limit } from "firebase/firestore";
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
        // May also use orderBy("name", "desc") 
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

export async function getMidiById(id: string): Promise<Midi | null> {
    try {
        const midiDoc = doc(db, "midifiles", id);
        const midiSnapshot = await getDoc(midiDoc);
        
        if (!midiSnapshot.exists()) {
            return null;
        }
        
        const data = midiSnapshot.data();
        return {
            ...data,
            id: midiSnapshot.id,
            created_at: data.created_at.toDate(),
        } as Midi;
    } catch (error) {
        console.error("Error fetching MIDI file:", error);
        return null;
    }
}


