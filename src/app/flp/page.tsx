import BackButton from "@/components/ui/BackButton";
import { getFLP } from "@/lib/firestore/flp";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Badge from "@/components/ui/Badge";
import FLPButton from "@/components/ui/FLPButton";
import SimilarProducts from "@/components/sections/SimilarProducts";
import { getYouTubeEmbedUrl } from "@/utils/youtube";
interface FLPPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function FLPPage({ searchParams }: FLPPageProps) {
  const id = (await searchParams).id as string;
  const flp = await getFLP(id);

  if (!flp) {
    return notFound();
  }

  const embedUrl = getYouTubeEmbedUrl(flp.video_url);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-20 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* flp */}
        <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* flp image */}
          <div className="lg:col-span-4 lg:row-end-1">
            <div className="relative w-full h-0 pb-[56.25%]">
              <iframe
                src={embedUrl}
                title={flp.name}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* flp details */}
          <div className="mx-auto mt-14 max-w-xs lg:w-md sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
            <div className="flex flex-col-reverse">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {flp.name}
                </h1>
                <div className="mb-4">
                  <div className="flex flex-row gap-2 flex-wrap">
                    {flp.tags?.map((tag) => (
                      <div className="mt-2" key={tag}>
                        <Badge text={tag} style="blue" key={tag} />
                      </div>
                    ))}
                  </div>
                </div>

                <h2 id="information-heading" className="sr-only">
                  flp information
                </h2>
                <div className="text-gray-300 mt-4">
                  <p className="text-gray-300 font-bold mb-2">Description</p>
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
                    {flp.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {!flp.is_discounted ? (
              <p className="text-white text-lg font-bold mt-4">
                Price: ${flp.price}
              </p>
            ) : (
              <p className="text-white text-lg font-bold mt-4 flex flex-row gap-2">
                Price:
                <span className="text-gray-400 line-through">${flp.price}</span>
                <span className="text-green-400">${flp.discount_price}</span>
              </p>
            )}
            <div className="flex flex-row gap-2 mt-4 border-t border-gray-200 pt-4">
              <FLPButton
                flp={{
                  id: flp.id,
                  name: flp.name,
                  price: flp.price,
                  type: "flp",
                  discount_price: flp.discount_price,
                  is_discounted: flp.is_discounted,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <SimilarProducts flp={flp} />
    </div>
  );
}
