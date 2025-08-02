export const revalidate = 300; // Cache for 5 minutes

import Hero from "@/components/sections/Hero";
import { getLatestPack } from "@/lib/firestore/pack";

export default async function Home() {
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
    </main>
  );
}
