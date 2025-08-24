import { db } from "../firebase";
import { collection, addDoc, getDocs, getDoc, doc, Timestamp, query, orderBy, limit, deleteDoc, where } from "firebase/firestore";
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
    let q = query(midiFilesCollection, orderBy("name", "desc"));
    
    if (limitCount) {
        q = query(midiFilesCollection, orderBy("name", "desc"), limit(limitCount)); 
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

export async function getAllMidis() {
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

// Delete MIDI file
export async function deleteMidi(id: string): Promise<boolean> {
    if (!db) {
        throw new Error("Firebase Firestore is not initialized");
    }
    
    try {
        const midiDoc = doc(db, "midifiles", id);
        await deleteDoc(midiDoc);
        return true;
    } catch (error) {
        console.error("Error deleting MIDI file:", error);
        return false;
    }
}

// Get latest MIDI files for homepage (cached)
export async function getLatestMidiFiles(count: number = 10) {
    const midiFilesCollection = collection(db, "midifiles");
    const q = query(midiFilesCollection, orderBy("name", "desc"), limit(count));
    
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
// Returns similar midi files based on genre and BPM
export async function getSimilarMidis(id: string): Promise<Midi[]> {
    try {
        // Get the current MIDI file
        const midiDoc = await getDoc(doc(db, "midifiles", id));
        if (!midiDoc.exists()) {
            return [];
        }
        
        const midiData = midiDoc.data();
        const midiBPM = midiData?.bpm;
        const midiGenre = midiData?.genre;
        
        if (!midiBPM || !midiGenre) {
            return [];
        }

        const similarMidis: Midi[] = [];
        const midiCollection = collection(db, "midifiles");

        // Helper function to shuffle array and take first 3
        const shuffleAndTake = (array: Midi[], count: number): Midi[] => {
            const shuffled = [...array].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, count);
        };

        // First, try to find MIDIs with same BPM and genre
        try {
            const sameBpmAndGenreQuery = query(
                midiCollection, 
                where("bpm", "==", midiBPM), 
                where("genre", "==", midiGenre),
                where("hidden", "==", false),
                limit(20) // Get more for randomization
            );
            const sameBpmAndGenreSnapshot = await getDocs(sameBpmAndGenreQuery);
            
            const sameBpmAndGenreMidis: Midi[] = [];
            sameBpmAndGenreSnapshot.forEach((doc) => {
                if (doc.id !== id) { // Exclude current MIDI
                    const data = doc.data();
                    sameBpmAndGenreMidis.push({
                        ...data,
                        id: doc.id,
                        created_at: data.created_at.toDate(),
                    } as Midi);
                }
            });
            
            // If we have more than 3, randomize and take 3
            if (sameBpmAndGenreMidis.length >= 3) {
                return shuffleAndTake(sameBpmAndGenreMidis, 3);
            }
            
            // Otherwise, add all of them
            similarMidis.push(...sameBpmAndGenreMidis);
        } catch (error) {
            console.log(error);
        }

        // If we don't have enough, add MIDIs with same genre only
        if (similarMidis.length < 3) {
            try {
                const sameGenreQuery = query(
                    midiCollection, 
                    where("genre", "==", midiGenre),
                    where("hidden", "==", false),
                    limit(20) // Get more for randomization
                );
                const sameGenreSnapshot = await getDocs(sameGenreQuery);
                
                const sameGenreMidis: Midi[] = [];
                sameGenreSnapshot.forEach((doc) => {
                    if (doc.id !== id && !similarMidis.some(midi => midi.id === doc.id)) {
                        const data = doc.data();
                        sameGenreMidis.push({
                            ...data,
                            id: doc.id,
                            created_at: data.created_at.toDate(),
                        } as Midi);
                    }
                });
                
                // If we have enough to fill up to 3, randomize and take what we need
                const needed = 3 - similarMidis.length;
                if (sameGenreMidis.length >= needed) {
                    const randomGenreMidis = shuffleAndTake(sameGenreMidis, needed);
                    similarMidis.push(...randomGenreMidis);
                } else {
                    similarMidis.push(...sameGenreMidis);
                }
            } catch (error) {
                console.log("Genre query failed", error);
            }
        }

        // If still not enough, add some random MIDIs
        if (similarMidis.length < 3) {
            try {
                const randomQuery = query(
                    midiCollection,
                    where("hidden", "==", false),
                    limit(50) // Get more for randomization
                );
                const randomSnapshot = await getDocs(randomQuery);
                
                const randomMidis: Midi[] = [];
                randomSnapshot.forEach((doc) => {
                    if (doc.id !== id && !similarMidis.some(midi => midi.id === doc.id)) {
                        const data = doc.data();
                        randomMidis.push({
                            ...data,
                            id: doc.id,
                            created_at: data.created_at.toDate(),
                        } as Midi);
                    }
                });
                
                // Randomize and take what we need
                const needed = 3 - similarMidis.length;
                if (randomMidis.length >= needed) {
                    const randomSelectedMidis = shuffleAndTake(randomMidis, needed);
                    similarMidis.push(...randomSelectedMidis);
                } else {
                    similarMidis.push(...randomMidis);
                }
            } catch (error) {
                console.log("Random query failed", error);
            }
        }

        return similarMidis.slice(0, 3);
    } catch (error) {
        console.error("Error getting similar MIDIs:", error);
        return [];
    }
}