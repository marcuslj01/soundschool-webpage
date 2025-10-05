import PackGrid from "@/components/ui/PackGrid";
import { getPacks } from "@/lib/firestore/pack";

export const revalidate = 360; // Cache for 1 minute

export default async function PacksPage() {
  const packs = await getPacks();

  const midiPacks = packs.filter(
    (pack) => pack.type === "midi" && !pack.is_featured
  );
  const samplePacks = packs.filter((pack) => pack.type === "sample");
  const featuredPacks = packs.filter((pack) => pack.is_featured);

  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-20 mb-20">
      <h2 className="text-2xl font-bold text-white sm:text-4xl mb-4" id="packs">
        Our packs
      </h2>
      {featuredPacks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Bestsellers</h2>
          <PackGrid products={featuredPacks} />
        </>
      )}
      {midiPacks.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Other midi packs</h2>
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
    </div>
  );
}
