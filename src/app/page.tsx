export const dynamic = "force-dynamic";

import Hero from "@/components/sections/Hero";
import { getMidi } from "@/lib/firestore/midifiles";
import Midigrid from "@/components/ui/Midigrid";
import PackGrid from "@/components/ui/PackGrid";
import { getPacks } from "@/lib/firestore/pack";

export default async function Home() {
  const midiFiles = await getMidi();
  const packs = await getPacks();
  const midiPacks = packs.filter((pack) => pack.type === "midi");
  const samplePacks = packs.filter((pack) => pack.type === "sample");
  console.log(midiPacks);

  return (
    <main className="flex flex-col gap-4 w-full items-center">
      <Hero
        title="Welcome to"
        subtitle="Soundschool"
        description="Check out our biggest pack yet!"
        productImage="/images/Midipack.png"
        backgroundImage="/images/Hero.png"
        primaryButtonText="Read more"
        secondaryButtonText="Other products"
      />
      <section className="flex flex-col gap-4 w-full items-center text-white">
        {midiPacks.length > 0 && (
          <>
            <h2 className="text-2xl font-bold">Midi Packs</h2>
            <PackGrid products={midiPacks} />
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
      <Midigrid midiFiles={midiFiles} />
    </main>
  );
}
