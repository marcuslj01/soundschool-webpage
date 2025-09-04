import { notFound } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { getMidiById } from "@/lib/firestore/midifiles";
import MidiButton from "@/components/ui/MidiButton";
import PlayButton from "@/components/ui/PlayButton";
import Badge from "@/components/ui/Badge";
import SimilarProducts from "@/components/sections/SimilarProducts";

interface MidiPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function MidiPage({ searchParams }: MidiPageProps) {
  const id = (await searchParams).id as string;

  // If no id is provided, show 404
  if (!id) {
    notFound();
  }

  let midi;
  try {
    midi = await getMidiById(id);
  } catch (error) {
    console.error("Error fetching midi:", error);
    notFound();
  }

  if (!midi) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 pt-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-8 pb-6">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* midi */}
        <div>
          {/* midi details */}
          <div className="mx-auto mt-14 max-w-xs lg:w-md sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
                  {midi.name}
                </h1>
                <div className="mb-4">
                  <div className="flex flex-row gap-2 flex-wrap">
                    {midi.tags?.map((tag) => (
                      <div className="mt-2" key={tag}>
                        <Badge text={tag} style="blue" key={tag} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <PlayButton previewUrl={midi.preview_url} />
                </div>

                <h2 id="information-heading" className="sr-only">
                  midi information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-300 font-bold">BPM</p>
                    <p className="text-gray-300">{midi.bpm}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-300 font-bold">Created</p>
                    <p className="text-gray-300">
                      {midi.created_at.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-300 font-bold">Key</p>
                    <p className="text-gray-300">
                      {midi.root} {midi.scale}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-300 font-bold">Genre</p>
                    <p className="text-gray-300">{midi.genre}</p>
                  </div>

                  {/* <div className="flex flex-col gap-2">
                    <p className="text-gray-300 font-bold">VST</p>
                    <p className="text-gray-300">{midi.vst}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                    <p className="text-gray-300 font-bold">Preset</p>
                    <p className="text-gray-300">{midi.preset}</p>
                    </div> */}
                </div>
                <div className="w-full mt-4">
                  <p className="text-gray-300 font-bold">
                    Preset information will be available after purchasing.
                  </p>
                </div>
              </div>
            </div>

            {!midi.is_discounted ? (
              <p className="text-white text-lg font-bold mt-4">
                Price: ${midi.price}
              </p>
            ) : (
              <p className="text-white text-lg font-bold mt-4 flex flex-row gap-2">
                Price:
                <span className="text-gray-400 line-through">
                  ${midi.price}
                </span>
                <span className="text-green-400">${midi.discount_price}</span>
              </p>
            )}

            <div className="mt-4 gap-x-6 gap-y-4 sm:grid-cols-2">
              <MidiButton
                midi={{
                  id: midi.id,
                  name: midi.name,
                  price: midi.price,
                  type: "midi",
                  discount_price: midi.discount_price,
                  is_discounted: midi.is_discounted,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <SimilarProducts midi={midi} />
    </div>
  );
}
