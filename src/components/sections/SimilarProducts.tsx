"use client";

import { FLP } from "@/lib/types/FLP";
import { Midi } from "@/lib/types/midi";
import { Pack } from "@/lib/types/pack";
import React, { useEffect, useState } from "react";
import MidiCard from "../ui/MidiCard";
import { OwnedFile } from "@/lib/types/ownedFile";
import { useAuth } from "@/contexts/AuthContext";
import { getOwnedFiles } from "@/lib/firestore/user";
import { getSimilarMidis } from "@/lib/firestore/midifiles";

export interface SimilarProductsProps {
  midi?: Midi;
  pack?: Pack;
  flp?: FLP;
}

export default function SimilarProducts({
  midi,
  //   pack,
  //   flp,
}: SimilarProductsProps) {
  const [productType, setProductType] = useState<"midi" | "pack" | "flp">();
  const [similarProducts, setSimilarProducts] = useState<Midi[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { user } = useAuth();
  const [ownedFiles, setOwnedFiles] = useState<OwnedFile[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOwnedFiles = async () => {
        const ownedFiles = await getOwnedFiles(user.uid);
        setOwnedFiles(ownedFiles);
      };
      fetchOwnedFiles();
    }
  }, [user]);

  useEffect(() => {
    const getSimilarProducts = async () => {
      if (midi) {
        const similarMidis = await getSimilarMidis(midi.id); // returns an array of Midis
        setProductType("midi");
        setSimilarProducts(similarMidis);
      }
    };
    getSimilarProducts();
    // else if (pack) {
    //   const similarPacks = await getSimilarPacks(pack.id);
    //   setProductType("pack");
    //   setSimilarProducts(similarPacks);
    // } else if (flp) {
    //   const similarFLPs = await getSimilarFLPs(flp.id);
    //   setProductType("flp");
    //   setSimilarProducts(similarFLPs);
    // }
  }, [midi]); // Run if midi, pack, or flp changes

  if (productType == "midi") {
    return (
      <section className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-white">Similar Products</h2>
        {similarProducts.map((file: Midi) => (
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
        ))}
      </section>
    );
  }
  return <div>SimilarProducts</div>;
}
