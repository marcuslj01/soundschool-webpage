export const revalidate = 300; // Cache for 5 minutes

import React from "react";
import Link from "next/link";
// import Hero from "@/components/sections/Hero";
import EmptyHeroPage from "@/components/sections/EmptyHeroPage";
// import { getLatestPack } from "@/lib/firestore/pack";
import { getLatestPacks } from "@/lib/firestore/pack";
import { getLatestMidiFiles } from "@/lib/firestore/midifiles";
import { getLatestFLPs } from "@/lib/firestore/flp";
import HomeMidiGrid from "@/components/ui/HomeMidiGrid";
import PackGrid from "@/components/ui/PackGrid";
import FLPGrid from "@/components/ui/FLPGrid";

export default async function Home() {
  // const latestPack = await getLatestPack();
  const latestPacks = await getLatestPacks(3);
  const latestMidiFiles = await getLatestMidiFiles(10);
  const latestFLPs = await getLatestFLPs(3);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Soundschool",
    description:
      "Premium music production resources including MIDI files, FLP projects, and sample packs",
    url: "https://soundschoolmidis.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://soundschoolmidis.com/midi?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://instagram.com/soundschool", // Add your actual social media links
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex flex-col gap-4 w-full items-center">
        {/* Hero Section */}
        <EmptyHeroPage />

        {/* Products Overview Section */}
        <div
          className="flex flex-col gap-12 w-full items-center text-white py-16 px-4 scroll-mt-20"
          id="products"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white sm:text-4xl mb-4">
              Latest Resources
            </h1>
            <p className="text-gray-300 text-center max-w-2xl">
              Discover our newest music production resources
            </p>
          </div>

          {/* Latest MIDI Files Section */}
          <section className="w-full max-w-7xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Latest MIDI Files
              </h2>
              <Link
                href="/midis"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                View all MIDI files →
              </Link>
            </div>
            <HomeMidiGrid midiFiles={latestMidiFiles} />
          </section>

          {/* Latest Packs Section */}
          {latestPacks.length > 0 && (
            <section className="w-full max-w-7xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Latest MIDI Packs
                </h2>
                <Link
                  href="/packs"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View all MIDI packs →
                </Link>
              </div>
              <PackGrid products={latestPacks} />
            </section>
          )}

          {/* Latest FLPs Section */}
          {latestFLPs.length > 0 && (
            <section className="w-full max-w-7xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  Latest FLP Projects
                </h2>
                <Link
                  href="/flps"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  View all FLPs →
                </Link>
              </div>
              <FLPGrid flps={latestFLPs} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
