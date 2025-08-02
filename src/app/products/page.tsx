import React from "react";
import LazyMidigrid from "@/components/ui/LazyMidigrid";
import { getMidi } from "@/lib/firestore/midifiles";
import { getPacks } from "@/lib/firestore/pack";
import PackGrid from "@/components/ui/PackGrid";

export default async function MidiPage() {
  const midiFiles = await getMidi(10); // Initial load of 10 MIDI files on server
  const packs = await getPacks();

  const midiPacks = packs.filter((pack) => pack.type === "midi");
  const samplePacks = packs.filter((pack) => pack.type === "sample");
  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-white sm:text-4xl" id="midis">
        Our midi files!
      </h2>
      <LazyMidigrid initialData={midiFiles} />

      <h2 className="text-2xl font-bold text-white sm:text-4xl mb-4" id="packs">
        Our packs!
      </h2>
      {midiPacks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Midi Packs</h2>
          <div className="max-w-5xl xl:max-w-7xl">
            <PackGrid products={midiPacks} />
          </div>
        </>
      )}
      {samplePacks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Sample Packs</h2>
          <PackGrid products={samplePacks} />
        </>
      )}
    </div>
  );
}
