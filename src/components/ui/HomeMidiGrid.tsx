"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <div
      ref={ref}
      className="w-full flex flex-col items-center max-h-96 overflow-y-scroll"
    >
      <div className="flex flex-col gap-2 w-full">
        {midiFiles.map(
          (file, index) =>
            !file.hidden && (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <MidiCard
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
              </motion.div>
            )
        )}
        <motion.div
          className="flex flex-row items-center justify-center mt-4 pb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.8,
            delay: midiFiles.length * 0.1,
            ease: "easeOut",
          }}
        >
          <Link
            href="/midis"
            className="text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
          >
            See all MIDI files →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default HomeMidiGrid;
