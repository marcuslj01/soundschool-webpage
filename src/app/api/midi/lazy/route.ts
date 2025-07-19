import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc, query, orderBy, limit, startAfter } from "firebase/firestore";
import { Midi } from "@/lib/types/midi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get("limit") || "10");
    const lastId = searchParams.get("lastId");
    
    const midiFilesCollection = collection(db, "midifiles");
    
    let q = query(midiFilesCollection, orderBy("created_at", "desc"), limit(limitCount));
    
    // If we have a lastId, start after that document
    if (lastId) {
      // Get the document with the lastId to use as cursor
      const lastDocRef = doc(midiFilesCollection, lastId);
      const lastDocSnap = await getDoc(lastDocRef);
      
      if (lastDocSnap.exists()) {
        q = query(
          midiFilesCollection,
          orderBy("created_at", "desc"),
          startAfter(lastDocSnap),
          limit(limitCount)
        );
      }
    }
    
    const snapshot = await getDocs(q);
    const midiFiles = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        created_at: data.created_at?.toDate ? data.created_at.toDate() : new Date(data.created_at),
      } as Midi;
    });
    
    const hasMore = snapshot.docs.length === limitCount;
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    return NextResponse.json({
      midiFiles,
      hasMore,
      lastId: lastDoc?.id || null
    });
    
  } catch (error) {
    console.error("Error fetching lazy MIDI files:", error);
    return NextResponse.json(
      { error: "Failed to fetch MIDI files" },
      { status: 500 }
    );
  }
} 