import PackGrid from "@/components/ui/PackGrid";
import { getPacks } from "@/lib/firestore/pack";

export const revalidate = 360; // Cache for 1 minute

export default async function PacksPage() {
  const packs = await getPacks();

  const midiPacks = packs.filter(
    (pack) => pack.type === "midi" && !pack.is_featured,
  );
  const samplePacks = packs.filter((pack) => pack.type === "sample");
  const presetPacks = packs.filter((pack) => pack.type === "preset");
  const featuredPacks = packs.filter((pack) => pack.is_featured);

  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-30 mb-20">
      <div className="max-w-5xl">
        <h2
          className="text-4xl font-bold text-white sm:text-5xl px-8 py-4 text-center md:text-left"
          id="packs"
        >
          Packs
        </h2>
        {featuredPacks.length > 0 && (
          <>
            <h2 className="text-3xl text-gray-200 font-bold px-8 py-4 text-center md:text-left">
              Most popular
            </h2>
            <PackGrid products={featuredPacks} />
          </>
        )}
        {midiPacks.length > 0 && (
          <>
            <h2 className="text-3xl font-bold px-8 py-4 text-gray-200 text-center md:text-left">
              Other midi packs
            </h2>
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
        {presetPacks.length > 0 && (
          <>
            <h2 className="text-2xl font-bold">Preset Packs</h2>
            <PackGrid products={presetPacks} />
          </>
        )}
      </div>
    </div>
  );
}
