import FLPGrid from "@/components/ui/FLPGrid";
import React from "react";
import { getFLPs } from "@/lib/firestore/flp";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default async function Tutorials() {
  const flps = await getFLPs();
  const visibleFlps = flps.filter((flp) => !flp.hidden);

  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-30">
      <div className="max-w-5xl">
        <h2 className="text-3xl font-bold text-white sm:text-5xl w-full px-8 py-4 text-center md:text-left">
          Tutorials with FLPs
        </h2>
        <Link href="https://www.youtube.com/@Soundschool18" target="_blank">
          <h3 className="text-gray-300 text-lg hover:text-white transition-all duration-300 px-8 py-4 text-center md:text-left">
            Check out our YouTube channel{" "}
            <ArrowRightIcon className="w-4 h-4 inline-block" />
          </h3>
        </Link>
        <FLPGrid flps={visibleFlps} />
      </div>
    </div>
  );
}
