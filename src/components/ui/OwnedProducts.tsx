import { Midi } from "@/lib/types/midi";
import { Pack } from "@/lib/types/pack";
import Image from "next/image";
import React from "react";

interface OwnedMidiCardProps {
  midi: Midi;
}

export function OwnedMidiCard({ midi }: OwnedMidiCardProps) {
  return (
    <div className="flex flex-col gap-2 bg-gray-800/50 p-4 rounded-md w-fit text-white">
      <h2 className="text-2xl font-bold">{midi.name}</h2>

      <p>{midi.root}</p>
      <p>{midi.scale}</p>
      <p>{midi.bpm}</p>
      <p>{midi.genre}</p>
      <p>{midi.vst}</p>
      <p>{midi.preset}</p>
    </div>
  );
}

interface OwnedPackCardProps {
  pack: Pack;
}

export function OwnedPackCard({ pack }: OwnedPackCardProps) {
  return (
    <div className="flex flex-col gap-2 bg-gray-800/50 p-4 rounded-md w-fit text-white">
      <h2 className="text-2xl font-bold">{pack.name}</h2>
      <Image
        src={pack.image_url}
        alt={pack.name}
        width={100}
        height={100}
        className="rounded-md"
      />

      <p>{pack.description}</p>
      <p>{pack.price}</p>
    </div>
  );
}
