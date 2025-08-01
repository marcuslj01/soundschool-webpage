export const revalidate = 300; // Cache for 5 minutes

import Hero from "@/components/sections/Hero";
import LazyMidigrid from "@/components/ui/LazyMidigrid";
import PackGrid from "@/components/ui/PackGrid";
import { getPacks, getLatestPack } from "@/lib/firestore/pack";
import { getMidi } from "@/lib/firestore/midifiles";
import FLPGrid from "@/components/ui/FLPGrid";
import { FLP } from "@/lib/types/FLP";

const FLPs: FLP[] = [
  {
    id: "1",
    name: "FLP Tutorial 1",
    image_url: "https://i.ytimg.com/vi/B8NHz8Q57G4/maxresdefault.jpg",
    preview_url: "/images/FLP1.png",
    video_url: "https://www.youtube.com/watch?v=vvGNtjOmvRs&t=83s",
    description: "FLP 1 description",
    price: 100,
    root: "C",
    scale: "Major",
    bpm: 120,
    genre: "Pop",
    file_url: "",
    tags: ["tag1", "tag2", "tag3"],
    hidden: false,
    created_at: new Date(),
  },
  {
    id: "2",
    name: "How to use FL Studio",
    image_url: "https://i.ytimg.com/vi/B8NHz8Q57G4/maxresdefault.jpg",
    preview_url: "/images/FLP1.png",
    video_url: "https://www.youtube.com/watch?v=vvGNtjOmvRs&t=83s",
    description: "FLP 2 description",
    price: 100,
    root: "C",
    scale: "Major",
    bpm: 120,
    genre: "Pop",
    file_url: "",
    tags: ["tag1", "tag2", "tag3"],
    hidden: false,
    created_at: new Date(),
  },
  {
    id: "3",
    name: "How to use FL Studio",
    image_url: "https://i.ytimg.com/vi/B8NHz8Q57G4/maxresdefault.jpg",
    preview_url: "/images/FLP1.png",
    video_url: "https://www.youtube.com/watch?v=vvGNtjOmvRs&t=83s",
    description: "FLP 3 description",
    price: 100,
    root: "C",
    scale: "Major",
    bpm: 120,
    genre: "Pop",
    file_url: "",
    tags: ["tag1", "tag2", "tag3"],
    hidden: false,
    created_at: new Date(),
  },
  {
    id: "4",
    name: "How to use FL Studio",
    image_url: "https://i.ytimg.com/vi/B8NHz8Q57G4/maxresdefault.jpg",
    preview_url: "/images/FLP1.png",
    video_url: "https://www.youtube.com/watch?v=vvGNtjOmvRs&t=83s",
    description: "FLP 4 description",
    price: 100,
    root: "C",
    scale: "Major",
    bpm: 120,
    genre: "Pop",
    file_url: "",
    tags: ["tag1", "tag2", "tag3"],
    hidden: false,
    created_at: new Date(),
  },
  {
    id: "5",
    name: "How to use FL Studio",
    image_url: "https://i.ytimg.com/vi/B8NHz8Q57G4/maxresdefault.jpg",
    preview_url: "/images/FLP1.png",
    video_url: "https://www.youtube.com/watch?v=vvGNtjOmvRs&t=83s",
    description: "FLP 5 description",
    price: 100,
    root: "C",
    scale: "Major",
    bpm: 120,
    genre: "Pop",
    file_url: "",
    tags: ["tag1", "tag2", "tag3"],
    hidden: false,
    created_at: new Date(),
  },
];

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
      <h2 className="text-2xl font-bold text-white">YouTube Tutorials</h2>
      <FLPGrid flps={FLPs} />
    </main>
  );
}
