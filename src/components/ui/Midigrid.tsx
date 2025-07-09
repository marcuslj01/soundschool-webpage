"use client";

import React, { useState } from "react";
import Card from "./Card";
import { Midi } from "@/lib/types/midi";

interface MidigridProps {
  midiFiles: Midi[];
}

function Midigrid({ midiFiles }: MidigridProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2 w-fit md:w-md lg:w-lg mb-8">
      {midiFiles.map((file) => (
        <Card
          key={file.id}
          title={file.name}
          date={file.created_at.toLocaleDateString()}
          root={file.root}
          scale={file.scale}
          bpm={file.bpm}
          previewUrl={file.preview_url}
          isPlaying={currentlyPlaying === file.id}
          onPlay={() => setCurrentlyPlaying(file.id)}
          onPause={() => setCurrentlyPlaying(null)}
        />
      ))}
    </div>
  );
}

export default Midigrid;
