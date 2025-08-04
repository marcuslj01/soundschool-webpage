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
import { getSimilarPacks } from "@/lib/firestore/pack";
import { getSimilarFLPs } from "@/lib/firestore/flp";
import PackGrid from "../ui/PackGrid";
import FLPGrid from "../ui/FLPGrid";

export interface SimilarProductsProps {
  midi?: Midi;
  pack?: Pack;
  flp?: FLP;
}

export default function SimilarProducts({
  midi,
  pack,
  flp,
}: SimilarProductsProps) {
  const [productType, setProductType] = useState<"midi" | "pack" | "flp">();
  const [similarMidis, setSimilarMidis] = useState<Midi[]>([]);
  const [similarPacks, setSimilarPacks] = useState<Pack[]>([]);
  const [similarFLPs, setSimilarFLPs] = useState<FLP[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      try {
        if (midi) {
          console.log("Fetching similar MIDIs for:", midi.id);
          const similarMidis = await getSimilarMidis(midi.id);
          console.log("Found similar MIDIs:", similarMidis.length);
          setProductType("midi");
          setSimilarMidis(similarMidis);
        } else if (pack) {
          console.log("Fetching similar packs for:", pack.id);
          const similarPacks = await getSimilarPacks(pack.id);
          console.log("Found similar packs:", similarPacks.length);
          setProductType("pack");
          setSimilarPacks(similarPacks);
        } else if (flp) {
          console.log("Fetching similar FLPs for:", flp.id);
          const similarFLPs = await getSimilarFLPs(flp.id);
          console.log("Found similar FLPs:", similarFLPs.length);
          setProductType("flp");
          setSimilarFLPs(similarFLPs);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getSimilarProducts();
  }, [midi, pack, flp]);

  // Loading state
  if (isLoading) {
    return (
      <section className="flex flex-col gap-4 mx-auto p-4 justify-center items-center">
        <h2 className="text-2xl font-bold text-white">Similar Products</h2>
        <p className="text-gray-400">Loading similar products...</p>
      </section>
    );
  }

  // MIDI products
  if (productType === "midi" && similarMidis.length > 0) {
    return (
      <section className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-white">Similar MIDI Files</h2>
        {similarMidis.map((file: Midi) => (
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

  // Pack products
  if (productType === "pack" && similarPacks.length > 0) {
    return (
      <section className="flex flex-col">
        <h2 className="text-3xl font-bold text-white max-w-2xl mx-auto p-4">
          Similar Packs
        </h2>
        <PackGrid products={similarPacks} />
      </section>
    );
  }

  // FLP products
  if (productType === "flp" && similarFLPs.length > 0) {
    return (
      <section className="flex flex-col">
        <h2 className="text-3xl font-bold text-white max-w-2xl mx-auto p-4">
          Similar FLPs
        </h2>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 flex flex-col gap-4 lg:flex-row">
          <FLPGrid flps={similarFLPs} />
        </div>
      </section>
    );
  }

  // No similar products found
  if (
    productType &&
    similarMidis.length === 0 &&
    similarPacks.length === 0 &&
    similarFLPs.length === 0
  ) {
    return (
      <section className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-white">Similar Products</h2>
        <p className="text-gray-400">No similar products found.</p>
      </section>
    );
  }

  // Default case - nothing to show
  return null;
}
