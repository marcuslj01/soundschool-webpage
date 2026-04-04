import React from "react";
import LazyMidigrid from "@/components/ui/LazyMidigrid";
import { getMidi } from "@/lib/firestore/midifiles";

export const revalidate = 300; // Cache for 5 minutes

export default async function MidiPage() {
  const midiFiles = await getMidi(10); // Initial load of 10 MIDI files on server

  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-30">
      <div className="w-full max-w-7xl flex flex-col gap-4 items-center p-4 justify-center">
        <h2
          className="text-4xl font-bold w-full text-left text-white sm:text-5xl"
          id="midis"
        >
          MIDI Files
        </h2>
        <p className="text-gray-300 text-left text-lg sm:text-xl w-full">
          Professional Chord Progressions For Your Next Track.
        </p>
      </div>

      <LazyMidigrid initialData={midiFiles} />
    </div>
  );
}
