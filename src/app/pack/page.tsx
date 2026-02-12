import { getPack } from "@/lib/firestore/pack";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PacksButtons from "@/components/ui/PacksButtons";
import BackButton from "@/components/ui/BackButton";
import Badge from "@/components/ui/Badge";
import PlayButton from "@/components/ui/PlayButton";
import SimilarProducts from "@/components/sections/SimilarProducts";
import { getYouTubeEmbedUrl } from "@/utils/youtube";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

export const revalidate = 360; // Cache for 1 minute

const previewFiles = [
  {
    name: "Midi 062",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1769026609450_Chord_Progression_290_-_preview.mp3?alt=media",
  },
  {
    name: "Midi 196",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1769026609450_Chord_Progression_290_-_preview.mp3?alt=media",
  },
  {
    name: "Midi 198",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1769026609450_Chord_Progression_290_-_preview.mp3?alt=media",
  },
  {
    name: "Midi 199",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1769026609450_Chord_Progression_290_-_preview.mp3?alt=media",
  },
  {
    name: "Midi 200",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1769026609450_Chord_Progression_290_-_preview.mp3?alt=media",
  },
  {
    name: "Midi 201",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1769026609450_Chord_Progression_290_-_preview.mp3?alt=media",
  },
];
interface PackPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function PackPage({ searchParams }: PackPageProps) {
  const id = (await searchParams).id as string;

  // If no id is provided, show 404
  if (!id) {
    notFound();
  }

  let pack;
  try {
    pack = await getPack(id);
  } catch (error) {
    console.error("Error fetching pack:", error);
    notFound();
  }

  if (!pack) {
    notFound();
  }

  const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  // If the pack is Megapack, show a special page
  if (pack.id === "Woj0XGPxSMyXueiBDyoZ") {
    return (
      <>
        <div className="bg-gradient-to-t from-black to-blue-400">
          <div className="mx-auto px-4 pt-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-8 pb-6">
            <div className="mb-8">
              <BackButton />
              {/* hero section */}
              <div className="mt-4 grid grid-cols-2 gap-4 ">
                {/* left side image */}
                <div>
                  <Image
                    alt={`Image of ${pack.name}`}
                    src={pack.image_url}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                </div>
                {/* right side text */}
                <div className="flex flex-col pt-16 max-w-sm">
                  <h2 className="text-gray-300 text-xl">Soundschool</h2>
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-7xl">
                    Megapack
                  </h1>
                  <h3 className="text-gray-300 text-3xl mt-4">
                    Inspired by artists like <b>Avicii</b>, <b>Martin Garrix</b>
                    , <b>Alan Walker</b>, <b>Kygo</b> and more.
                  </h3>

                  <div className="flex flex-col items-center gap-2 w-fit rounded-lg mt-8">
                    <p className="text-gray-300 text-2xl">250</p>
                    <p className="text-gray-500 text-md">Chord progreesions</p>
                  </div>

                  {/* price and buy now button */}
                  <div className="flex align-bottom mt-8 flex-row gap-10">
                    <div className="flex flex-row gap-2">
                      <p className="text-gray-400 text-2xl line-through">
                        ${pack.price}
                      </p>
                      <p className="text-green-400 text-2xl">
                        ${pack.discount_price}
                      </p>
                    </div>
                    <div className="w-full">
                      <PacksButtons // hide the add to cart button for the megapack to avoid confusion
                        pack={{
                          id: pack.id,
                          name: pack.name,
                          price: pack.price,
                          type: pack.type || "midi",
                          discount_price: pack.discount_price,
                          is_discounted: pack.is_discounted,
                          hideAddToCart: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-center">
                <a
                  href="#video-section"
                  className="text-white flex flex-row items-center gap-2"
                >
                  Read more below
                  <ArrowDown className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Video section */}
        <section id="video-section" className="bg-gray-900 flex justify-center">
          <div className="p-16 max-w-7xl grid sm:grid-cols-5 gap-16">
            <div className="col-span-2">
              <h1 className="text-4xl text-white text-left font-bold">
                The Megapack
              </h1>
              <h2 className="text-gray-200 text-2xl mt-4 italic font-bold">
                Our biggest pack yet
              </h2>
              <div className="text-gray-300 text-xl mt-8">
                <p>
                  The Megapack is a collection of 250 high-quality MIDI chord
                  progressions made for a variety of genres. The pack is
                  designed to help producers work faster and stay creative, with
                  clean, ready-to-use MIDI progressions that fit any project.
                </p>
                <ul className="list-disc list-inside mt-4">
                  <li>
                    250 MIDI files with BPM Created by the Soundschool team
                  </li>
                  <li>Works with all major DAWs</li>
                  <li>Easy to edit and customize</li>
                  <li>Designed to boost your creativity</li>
                  <li>Perfect for producers of all levels</li>
                </ul>
              </div>
            </div>
            <div className="col-span-3 sm:mt-16">
              {/* video */}
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={embedUrl}
                  title={pack.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preview section */}
        <section className="bg-gradient-to-b from-blue-800 to-blue-900 flex justify-center">
          <div className="p-16 max-w-7xl">
            <h1 className="text-4xl text-white text-center font-bold">
              What&apos;s included?
            </h1>
            <h2 className="text-gray-300 text-xl mt-4 italic font-bold">
              Check out some of the MIDI files included in the pack!
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-8 text-white text-2xl font-bold">
              {previewFiles.map((file) => (
                <PlayButton
                  key={file.name}
                  previewUrl={file.url}
                  name={file.name}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-900 flex justify-center">
          <div className="p-16 max-w-7xl">
            <h1 className="text-4xl text-white text-left font-bold">FAQ</h1>
            <h2 className="text-gray-300 text-xl mt-4 italic font-bold">
              Frequently asked questions about the Megapack
            </h2>
            <div className="grid grid-cols-3 gap-x-16 gap-y-8 mt-8 text-white text-2xl">
              <div>
                <h3 className="text-white text-xl font-bold">
                  How do I use the MIDI files?
                </h3>
                <p className="text-gray-300 text-xl mt-4">
                  You can use the MIDI files in your DAW by importing them into
                  your project, either by dragging and dropping the files into
                  your project or by using the import function in your DAW. If
                  you need any help, please feel free to{" "}
                  <Link
                    href="/contact"
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    contact us.
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">
                  Can I use the MIDI files in my songs?
                </h3>
                <p className="text-gray-300 text-xl mt-4">
                  Yes, you can use the MIDI files in your songs! We recommend
                  using them as a starting point for your own MIDI files, but
                  you are free to use them as you wish.
                </p>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">
                  Why should I use MIDI files instead of samples?
                </h3>
                <p className="text-gray-300 text-xl mt-4">
                  MIDI files give you much more flexibility than samples.
                  Instead of being locked into a specific sound, you can easily
                  change the instrument, tempo, key, and arrangement to match
                  your track. This makes it easier to make the idea your own,
                  experiment with different sounds, and adapt the progression to
                  any genre or style.{" "}
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-2xl mt-16 text-center font-bold">
              Other questions? Contact us{" "}
              <Link
                href="/contact"
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                here
              </Link>
              .
            </p>
          </div>
        </section>

        {/* similar products section*/}
        <section className="m-8">
          <SimilarProducts pack={pack} />
        </section>
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 pt-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-8 pb-6">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* pack */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* pack image */}
          <div className="lg:col-span-4 lg:row-end-1">
            <Image
              alt={`Image of ${pack.name}`}
              src={pack.image_url}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
              className="sm:max-h-[50vh] max-h-[40vh] md:max-w-full object-contain bg-gray-900 rounded-lg"
            />
          </div>

          {/* pack details */}
          <div className="mx-auto mt-14 max-w-xs lg:w-md sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {pack.name}
                </h1>
                <div className="mb-4">
                  <div className="flex flex-row gap-2 flex-wrap">
                    {pack.tags?.map((tag) => (
                      <div className="mt-2" key={tag}>
                        <Badge text={tag} style="blue" key={tag} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* {pack.preview_url && (
                  <div className="mb-4">
                    <PlayButton previewUrl={pack.preview_url} />
                  </div>
                )} */}

                <h2 id="information-heading" className="sr-only">
                  pack information
                </h2>
                <div className="text-gray-300 mt-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({ children }) => (
                        <ul className="space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-1">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:content-['•'] before:text-gray-300">
                          {children}
                        </li>
                      ),
                    }}
                  >
                    {pack.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {!pack.is_discounted ? (
              <p className="text-white text-lg font-bold mt-4">
                Price: ${pack.price}
              </p>
            ) : (
              <p className="text-white text-lg font-bold mt-4 flex flex-row gap-2">
                Price:
                <span className="text-gray-400 line-through">
                  ${pack.price}
                </span>
                <span className="text-green-400">${pack.discount_price}</span>
              </p>
            )}

            <div className="mt-4 gap-x-6 gap-y-4 sm:grid-cols-2">
              <PacksButtons
                pack={{
                  id: pack.id,
                  name: pack.name,
                  price: pack.price,
                  type: pack.type || "midi",
                  discount_price: pack.discount_price,
                  is_discounted: pack.is_discounted,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <SimilarProducts pack={pack} />
    </div>
  );
}
