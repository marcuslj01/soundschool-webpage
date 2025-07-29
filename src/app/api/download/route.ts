// /app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOwnedFiles } from "@/lib/firestore/user";
import { getMidiById } from "@/lib/firestore/midifiles";
import { getPack } from "@/lib/firestore/pack";

export async function POST(req: NextRequest) {
  try {
    const { userId, fileId, fileType } = await req.json();

    if (!userId || !fileId || !fileType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Check if user owns the file
    const ownedFiles = await getOwnedFiles(userId);
    const ownsFile = ownedFiles.some(
      (file) => file.id === fileId && file.type === fileType
    );

    if (!ownsFile) {
      return NextResponse.json({ error: "You don't own this file" }, { status: 403 });
    }

    // Get file data based on type
    let downloadUrl: string;
    let fileName: string;

    if (fileType === "midi") {
      const midi = await getMidiById(fileId);
      if (!midi) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      downloadUrl = midi.file_url;
      fileName = midi.name;
    } else if (fileType === "pack") {
      const pack = await getPack(fileId);
      if (!pack) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      downloadUrl = pack.download_url;
      fileName = pack.name;
    } else {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    return NextResponse.json({ 
      downloadUrl,
      fileName 
    });

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}