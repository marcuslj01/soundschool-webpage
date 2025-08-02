"use client";

import React, { useState, useEffect } from "react";
import MidiCard from "./MidiCard";
import { Midi } from "@/lib/types/midi";
import { useAuth } from "@/contexts/AuthContext";
import { OwnedFile } from "@/lib/types/ownedFile";
import { getOwnedFiles } from "@/lib/firestore/user";
import Link from "next/link";

interface HomeMidiGridProps {
  midiFiles: Midi[];
}

function HomeMidiGrid({ midiFiles }: HomeMidiGridProps) {
  const { user } = useAuth();
  const [ownedFiles, setOwnedFiles] = useState<OwnedFile[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchOwnedFiles = async () => {
        const ownedFiles = await getOwnedFiles(user.uid);
        setOwnedFiles(ownedFiles);
      };
      fetchOwnedFiles();
    }
  }, [user]);

  return (
    <div className="w-full flex flex-col items-center max-h-96 overflow-y-scroll">
      <div className="flex flex-col gap-2 w-full">
        {midiFiles.map(
          (file) =>
            !file.hidden && (
              <MidiCard
                key={file.id}
                id={file.id}
                title={file.name}
                date={
                  file.created_at instanceof Date
                    ? file.created_at.toISOString()
                    : new Date(file.created_at).toISOString()
                }
                root={file.root}
                scale={file.scale}
                bpm={file.bpm}
                previewUrl={file.preview_url}
                isDiscounted={file.is_discounted || false}
                discountPrice={file.discount_price || file.price}
                price={file.price}
                isPlaying={currentlyPlaying === file.id}
                onPlay={() => setCurrentlyPlaying(file.id)}
                onPause={() => setCurrentlyPlaying(null)}
                isOwned={ownedFiles.some(
                  (ownedFile) =>
                    ownedFile.id === file.id && ownedFile.type === "midi"
                )}
              />
            )
        )}
        <div className="flex flex-row items-center justify-center mt-4 pb-4">
          <Link
            href="/midis"
            className="text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
          >
            See all MIDI files →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeMidiGrid;
