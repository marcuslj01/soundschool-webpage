import { db } from "../firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { Midi, MidiInput } from "../types/midi";


export async function addMidi(midiFile: MidiInput) {
    const midiFilesCollection = collection(db, "midifiles");
    await addDoc(midiFilesCollection, {
        ...midiFile,
        created_at: Timestamp.now(),
    });
}

export async function getMidi() {
    const midiFilesCollection = collection(db, "midifiles");
    const snapshot = await getDocs(midiFilesCollection);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            created_at: data.created_at.toDate(),
        } as Midi;
    });
}

