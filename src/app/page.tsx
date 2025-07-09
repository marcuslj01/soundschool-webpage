export const fetchCache = "force-no-store";

import Hero from "@/components/sections/Hero";
import { getMidi } from "@/lib/firestore/midifiles";
import Midigrid from "@/components/ui/Midigrid";

export default async function Home() {
  const midiFiles = await getMidi();

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

      <Midigrid midiFiles={midiFiles} />
    </main>
  );
}
