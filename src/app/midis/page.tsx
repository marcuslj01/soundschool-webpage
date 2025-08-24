import React from "react";
import LazyMidigrid from "@/components/ui/LazyMidigrid";
import { getMidi } from "@/lib/firestore/midifiles";

export const revalidate = 300; // Cache for 5 minutes

export default async function MidiPage() {
  const midiFiles = await getMidi(10); // Initial load of 10 MIDI files on server

  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-white sm:text-4xl" id="midis">
        Our midi files!
      </h2>
      <LazyMidigrid initialData={midiFiles} />
    </div>
  );
}
