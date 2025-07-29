"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getOwnedFiles } from "@/lib/firestore/user";
import { getMidiById } from "@/lib/firestore/midifiles";
import { getPack } from "@/lib/firestore/pack";
import { Midi } from "@/lib/types/midi";
import { Pack } from "@/lib/types/pack";
import React, { useEffect, useState } from "react";
import { OwnedMidiCard, OwnedPackCard } from "@/components/ui/OwnedProducts";

export default function MyFilesPage() {
  const { user } = useAuth();
  const [ownedMidis, setOwnedMidis] = useState<Midi[]>([]);
  const [ownedPacks, setOwnedPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnedFiles = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);

        // Get all ownedFiles
        const ownedFiles = await getOwnedFiles(user.uid);

        // Separate midi and packs and get the ids
        const midiIds = ownedFiles
          .filter((file) => file.type === "midi")
          .map((file) => file.id);

        const packIds = ownedFiles
          .filter((file) => file.type === "pack")
          .map((file) => file.id);

        // Get the details for each file and filter out null
        const [midiResults, packResults] = await Promise.all([
          Promise.all(midiIds.map((id) => getMidiById(id))),
          Promise.all(packIds.map((id) => getPack(id))),
        ]);

        // Filter out null/undefined and type cast
        setOwnedMidis(
          midiResults.filter((midi): midi is Midi => midi !== null)
        );
        setOwnedPacks(
          packResults.filter((pack): pack is Pack => pack !== null)
        );
      } catch (error) {
        console.error("Error fetching owned files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedFiles();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col mt-32 gap-4 justify-center items-center">
        <h1 className="text-4xl font-bold text-white">My Files</h1>
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col mt-32 gap-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-8">My Files</h1>

        <div className="space-y-12">
          {/* MIDI Files Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Midis ({ownedMidis.length})
            </h2>

            {ownedMidis.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-scroll h-full max-h-[50vh]">
                {ownedMidis.map((midi) => (
                  <OwnedMidiCard key={midi.id} midi={midi} />
                ))}
              </div>
            ) : (
              <p className="text-white">You don&apos;t have any midis yet!</p>
            )}
          </div>

          {/* Pack Files Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Packs ({ownedPacks.length})
            </h2>
            {ownedPacks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-scroll h-full max-h-[50vh] sm:max-h-[90vh]">
                {ownedPacks.map((pack) => (
                  <OwnedPackCard key={pack.id} pack={pack} />
                ))}
              </div>
            ) : (
              <p className="text-white">You don&apos;t have any packs yet!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
