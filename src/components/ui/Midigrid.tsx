import React from "react";
import Card from "./Card";
import { Midi } from "@/lib/types/midi";

interface MidigridProps {
  midiFiles: Midi[];
}

function Midigrid({ midiFiles }: MidigridProps) {
  return (
    <div className="flex flex-col gap-2 w-fit md:w-md lg:w-lg mb-8">
      {midiFiles.map((midifile) => (
        <Card
          key={midifile.id}
          title={midifile.name}
          date={midifile.created_at.toLocaleDateString()}
          root={midifile.root}
          scale={midifile.scale}
          bpm={midifile.bpm}
        />
      ))}
    </div>
  );
}

export default Midigrid;
