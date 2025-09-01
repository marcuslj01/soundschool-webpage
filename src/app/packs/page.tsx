import PackGrid from "@/components/ui/PackGrid";
import { getPacks } from "@/lib/firestore/pack";

export const revalidate = 360; // Cache for 1 minute

export default async function PacksPage() {
  const packs = await getPacks();

  const midiPacks = packs.filter((pack) => pack.type === "midi");
  const samplePacks = packs.filter((pack) => pack.type === "sample");
  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-20">
      <h2 className="text-2xl font-bold text-white sm:text-4xl mb-4" id="packs">
        Our packs!
      </h2>
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
    </div>
  );
}
