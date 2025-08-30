export const revalidate = 300; // Cache for 5 minutes

import React from "react";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import EmptyHeroPage from "@/components/sections/EmptyHeroPage";
import { getLatestPack } from "@/lib/firestore/pack";
import { getLatestPacks } from "@/lib/firestore/pack";
import { getLatestMidiFiles } from "@/lib/firestore/midifiles";
import { getLatestFLPs } from "@/lib/firestore/flp";
import HomeMidiGrid from "@/components/ui/HomeMidiGrid";
import PackGrid from "@/components/ui/PackGrid";
import FLPGrid from "@/components/ui/FLPGrid";

export default async function Home() {
  const latestPack = await getLatestPack();
  const latestPacks = await getLatestPacks(3);
  const latestMidiFiles = await getLatestMidiFiles(10);
  const latestFLPs = await getLatestFLPs(3);

  return (
    <main className="flex flex-col gap-4 w-full items-center">
      {/* Hero Section */}
      {latestPack ? (
        <Hero
          productImage={latestPack.image_url}
          backgroundImage="/images/Hero.png"
          packLink={`/pack?id=${latestPack.id}`}
        />
      ) : (
        <EmptyHeroPage />
      )}

      {/* Products Overview Section */}
      <div
        className="flex flex-col gap-12 w-full items-center text-white py-16 px-4 scroll-mt-20"
        id="products"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-4xl mb-4">
            Latest Products
          </h2>
          <p className="text-gray-300 text-center max-w-2xl">
            Discover our newest music production resources
          </p>
        </div>

        {/* Latest MIDI Files Section */}
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Latest MIDI Files</h3>
            <Link
              href="/midi"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              View all MIDI files →
            </Link>
          </div>
          <HomeMidiGrid midiFiles={latestMidiFiles} />
        </div>

        {/* Latest Packs Section */}
        {latestPacks.length > 0 && (
          <div className="w-full max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Latest Packs</h3>
              <Link
                href="/packs"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                View all packs →
              </Link>
            </div>
            <PackGrid products={latestPacks} />
          </div>
        )}

        {/* Latest FLPs Section */}
        {latestFLPs.length > 0 && (
          <div className="w-full max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Latest FLP Projects
              </h3>
              <Link
                href="/flps"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                View all FLPs →
              </Link>
            </div>
            <FLPGrid flps={latestFLPs} />
          </div>
        )}
      </div>
    </main>
  );
}
