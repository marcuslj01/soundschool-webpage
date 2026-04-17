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
import { ArrowDown, CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import Testimonials from "@/components/sections/Testimonials";

export const revalidate = 360; // Cache for 1 minute

const previewFiles = [
  {
    name: "Midi 062",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1756726183434_ReelAudio-77002.mp3?alt=media",
  },
  {
    name: "Midi 196",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1756726291803_ReelAudio-19660.mp3?alt=media",
  },
  {
    name: "Midi 248",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1758481483459_Chord_Progression_248_-_Preview.wav?alt=media",
  },
  {
    name: "Midi 231",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1756035512888_ReelAudio-12353.mp3?alt=media",
  },
  {
    name: "Midi 242",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1757714497212_Chord_Progression_242_preview.mp3?alt=media",
  },
  {
    name: "Midi 228",
    url: "https://firebasestorage.googleapis.com/v0/b/soundschool-db.firebasestorage.app/o/previews%2F1756041687835_ReelAudio-68904.mp3?alt=media",
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

  const youtubeUrl = "https://www.youtube.com/watch?v=VTJpTBKh5HU";
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

  // If the pack is EDM Essentials (Megapack), show a special page
  if (pack.id === "Woj0XGPxSMyXueiBDyoZ") {
    return (
      <>
        <div className="relative overflow-hidden bg-black">
          {/* Grain overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.15]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
          {/* Subtle blob background */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute left-1/4 top-[-100px] h-[400px] w-[400px] rounded-full bg-green-600/25 blur-3xl" />
            <div className="absolute right-[-150px] top-[100px] h-[350px] w-[350px] rounded-full bg-green-500/20 blur-3xl" />
            <div className="absolute left-[-100px] bottom-[-50px] h-[300px] w-[300px] rounded-full bg-emerald-600/20 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto px-4 pt-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-8 pb-6">
            {/* content */}
            <div className="mb-8">
              <BackButton />
              {/* hero section */}
              <div className="mt-4 sm:grid sm:grid-cols-2 flex flex-col items-center justify-center gap-4">
                {/* left side image */}
                <div className="w-full shrink-0 flex items-start justify-center">
                  <Image
                    alt={`Image of ${pack.name}`}
                    src={pack.image_url}
                    width={600}
                    height={400}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="w-full h-auto max-h-[35vh] lg:max-h-[45vh] xl:max-h-[55vh] object-contain"
                    priority
                  />
                </div>
                {/* right side text */}
                <div className="flex flex-col p-6 sm:p-8 sm:pt-8 lg:pt-12 max-w-sm lg:max-w-md">
                  <h2 className="text-gray-400 lg:text-sm text-xs tracking-widest uppercase">
                    Soundschool
                  </h2>
                  <h1 className="text-5xl font-black tracking-tight text-white lg:text-7xl">
                    EDM Essentials
                  </h1>
                  <p className="text-green-500 text-xs mt-1 tracking-widest uppercase">
                    250+ Chord Progressions
                  </p>
                  <h3 className="text-gray-300 lg:text-2xl text-lg mt-4">
                    Inspired by artists like <b>Avicii</b>, <b>Martin Garrix</b>
                    , <b>Alan Walker</b>, <b>Kygo</b> and more.
                  </h3>
                  {pack.is_discounted && (
                    <div className="inline-block mt-4">
                      <Badge text="Limited Time Offer!" style="green" />
                    </div>
                  )}
                  {/* price and buy now button */}
                  <div className="flex mt-4 flex-row gap-10">
                    <div className="flex flex-row flex-nowrap items-center gap-2">
                      {pack.is_discounted ? (
                        <>
                          <p className="text-gray-400 text-xl line-through">
                            ${pack.price}
                          </p>
                          <p className="text-white text-2xl font-bold">
                            ${pack.discount_price}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-white text-2xl">${pack.price}</p>
                        </>
                      )}
                    </div>
                    <div className="w-full">
                      <PacksButtons
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
                  className="text-green-400 hover:text-green-300 flex flex-row items-center gap-2 mt-8 sm:text-xl text-lg transition-all transform hover:scale-105 duration-300"
                >
                  Read more
                  <ArrowDown className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Video section */}
        <section
          id="video-section"
          className="bg-zinc-950 flex justify-center pb-8 items-center border-t border-white/5"
        >
          <div className="p-8 lg:p-16 max-w-7xl lg:grid lg:grid-cols-5 flex flex-col justify-center items-center lg:items-start lg:gap-16">
            <div className="lg:col-span-2 col-span-1">
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl dark:text-white text-center lg:text-left">
                250+ MIDI Files
              </h1>
              <h2 className="text-gray-400 text-xl mt-4 mb-4 italic lg:text-left text-center">
                Ready to use in your next project
              </h2>

              {/* desktop list */}
              <ul className="list-none flex-1 flex-col space-y-3 hidden lg:block text-gray-300 text-xl mt-8">
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Including BPM
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Works with all major DAWs
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Easy to edit and customize
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Designed to boost your creativity
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Copyright free
                </li>
              </ul>
            </div>
            <div className="lg:col-span-3 col-span-1 flex flex-col justify-center items-center">
              {/* video */}
              <video
                src="/videos/EDM_video3.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="w-full max-h-[400px] rounded-xl shadow-lg shadow-gray-950/20 object-contain"
              />

              {/* mobile list */}
              <ul className="list-none check-circle flex flex-col space-y-3 lg:hidden text-gray-300 text-xl mt-8">
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Including BPM
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Works with all major DAWs
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Easy to edit and customize
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Designed to boost your creativity
                </li>
                <li>
                  <CheckCircleIcon className="w-4 h-4 inline-block text-green-400" />{" "}
                  Copyright free
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Preview section */}
        <section className="flex justify-center bg-zinc-950 flex-col items-center">
          <div className="px-8 py-16 lg:py-32 flex lg:flex-row flex-col lg:gap-8 sm:gap-8 items-center justify-center w-full max-w-7xl">
            <div className="w-full md:w-1/2">
              <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden mb-8 sm:mb-0">
                <iframe
                  src={embedUrl}
                  title={pack.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center md:w-1/2">
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl dark:text-white text-center lg:text-left">
                Listen for yourself
              </h1>
              <h2 className="text-gray-400 text-xl mt-4 mb-4 italic lg:text-left text-center">
                Get a taste of the quality
              </h2>
              <div className="grid sm:grid-cols-3 grid-cols-2 gap-4 mt-8 text-white text-2xl font-bold">
                {previewFiles.map((file) => (
                  <PlayButton
                    key={file.name}
                    previewUrl={file.url}
                    name={file.name}
                    type="pack"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <Testimonials />

        {/* CTA section */}
        <div className="bg-zinc-950">
          <div className="px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                Boost your creativity with EDM Essentials today
                <p className="inline-block text-green-400">.</p>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-300">
                EDM Essentials is a collection of 250+ high-quality MIDI chord
                progressions crafted for EDM and electronic music producers.
                Designed to help you work faster and stay creative, with clean,
                ready-to-use MIDI progressions that fit any project.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <PacksButtons
                  pack={{
                    id: pack.id,
                    name: pack.name,
                    price: pack.price,
                    type: pack.type || "midi",
                    discount_price: pack.discount_price,
                    is_discounted: pack.is_discounted,
                    hideAddToCart: true,
                    color: "white",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="bg-zinc-950 flex justify-center">
          <div className="p-16 max-w-7xl">
            <h1 className="text-4xl text-white text-left font-black">FAQ</h1>
            <h2 className="text-gray-400 sm:text-xl text-base mt-4 italic">
              Frequently asked questions about EDM Essentials
            </h2>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-16 gap-y-8 mt-8 text-white text-2xl">
              <div>
                <h3 className="text-white sm:text-xl text-base font-bold">
                  How do I use the MIDI files?
                </h3>
                <p className="text-gray-300 sm:text-xl text-base mt-4">
                  You can use the MIDI files in your DAW by importing them into
                  your project, either by dragging and dropping the files into
                  your project or by using the import function in your DAW. If
                  you need any help, please feel free to{" "}
                  <Link
                    href="/contact"
                    className="text-green-400 hover:text-green-300 transition-colors duration-200"
                  >
                    contact us
                  </Link>
                  .
                </p>
              </div>
              <div>
                <h3 className="text-white sm:text-xl text-base font-bold">
                  Can I use the MIDI files in my songs?
                </h3>
                <p className="text-gray-300 sm:text-xl text-base mt-4">
                  Yes, you can use the MIDI files in your songs! We recommend
                  using them as a starting point for your own MIDI files, but
                  you are free to use them as you wish.
                </p>
              </div>
              <div>
                <h3 className="text-white sm:text-xl text-base font-bold">
                  Why should I use MIDI files instead of samples?
                </h3>
                <p className="text-gray-300 sm:text-xl text-base mt-4">
                  MIDI files give you much more flexibility than samples.
                  Instead of being locked into a specific sound, you can easily
                  change the instrument, tempo, key, and arrangement to match
                  your track. This makes it easier to make the idea your own,
                  experiment with different sounds, and adapt the progression to
                  any genre or style.
                </p>
              </div>
            </div>
            <p className="text-gray-300 sm:text-2xl text-base mt-16 text-center font-bold">
              Other questions? Contact us{" "}
              <Link
                href="/contact"
                className="text-green-400 hover:text-green-300 transition-colors duration-200"
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
              width={800}
              height={600}
              sizes="(max-width: 1024px) 100vw, 57vw"
              className="w-full sm:max-h-[50vh] max-h-[40vh] object-contain bg-gray-900 rounded-lg"
              priority
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
