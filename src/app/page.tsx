export const revalidate = 300; // Cache for 5 minutes

import Hero from "@/components/sections/Hero";
import LazyMidigrid from "@/components/ui/LazyMidigrid";
import PackGrid from "@/components/ui/PackGrid";
import { getPacks, getLatestPack } from "@/lib/firestore/pack";
import { getMidi } from "@/lib/firestore/midifiles";

export default async function Home() {
  const midiFiles = await getMidi(10); // Initial load of 10 MIDI files on server
  const packs = await getPacks();

  const midiPacks = packs.filter((pack) => pack.type === "midi");
  const samplePacks = packs.filter((pack) => pack.type === "sample");

  const latestPack = await getLatestPack();

  return (
    <main className="flex flex-col gap-4 w-full items-center">
      <Hero
        title="Welcome to"
        subtitle="Soundschool"
        description="Check out our biggest pack yet!"
        productImage={latestPack?.image_url || ""}
        backgroundImage="/images/Hero.png"
        primaryButtonText="Read more"
        secondaryButtonText="Other products"
        packLink={`/pack?id=${latestPack?.id}`}
      />
      <section
        className="flex flex-col gap-4 w-full items-center text-white"
        id="products"
      >
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
      </section>
      <h2 className="text-2xl font-bold text-white">Midi Files</h2>
      <LazyMidigrid initialData={midiFiles} />
    </main>
  );
}
