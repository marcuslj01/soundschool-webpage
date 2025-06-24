import { addMidi, getMidi } from "./midifiles";
import { MidiInput } from "../types/midi";
import { db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

describe("Firestore midi-funksjoner", () => {
  it("should be able to add and get a midi file", async () => {
    const testMidi: MidiInput = {
      name: "Test MIDI",
      price: 100,
      key: "C",
      bpm: 120,
      genre: "Pop",
      vst: "Serum",
      preset: "Basic",
      file_url: "https://example.com/file.mid",
      preview_url: "https://example.com/preview.mp3",
      hidden: false,
    };

    await addMidi(testMidi);
    const midis = await getMidi();
    // Check that at least one midi has the name we added
    expect(midis.some(midi => midi.name === "Test MIDI")).toBe(true);

    // Delete testdata
    const midiFilesCollection = collection(db, "midifiles");
    const q = query(midiFilesCollection, where("name", "==", "Test MIDI"));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "midifiles", docSnap.id));
    });
  });
});