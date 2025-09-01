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

                {pack.preview_url && (
                  <div className="mb-4">
                    <PlayButton previewUrl={pack.preview_url} />
                  </div>
                )}

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
