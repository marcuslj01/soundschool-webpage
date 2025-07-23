import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Midi } from "@/lib/types/midi";

export const revalidate = 900; // Cache search results for 15 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("term");
    
    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json({ midiFiles: [] });
    }

    const midiFilesCollection = collection(db, "midifiles");
    
    // Get latest 50 files and filter in JavaScript
    const q = query(
      midiFilesCollection,
      orderBy("created_at", "desc"),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const allMidiFiles = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        created_at: data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at),
      } as Midi;
    });
    
    // Simple case-insensitive search
    const searchTermLower = searchTerm.toLowerCase();
    const midiFiles = allMidiFiles.filter(midi => 
      midi.name.toLowerCase().includes(searchTermLower)
    );
    
    return NextResponse.json({ midiFiles });
    
  } catch (error) {
    console.error("Error searching MIDI files:", error);
    return NextResponse.json(
      { error: "Failed to search MIDI files" },
      { status: 500 }
    );
  }
}