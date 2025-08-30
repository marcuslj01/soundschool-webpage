import FLPGrid from "@/components/ui/FLPGrid";
import React from "react";
import { getFLPs } from "@/lib/firestore/flp";
import Link from "next/link";

export default async function Tutorials() {
  const flps = await getFLPs();
  const visibleFlps = flps.filter((flp) => !flp.hidden);

  return (
    <div className="flex flex-col gap-4 w-full items-center text-white min-h-screen mt-30">
      <h2 className="text-2xl font-bold text-white sm:text-4xl">
        All our tutorials with FLPs!
      </h2>
      <Link href="https://www.youtube.com/@Soundschool18" target="_blank">
        <h3 className="text-gray-400 text-md hover:text-white transition-all duration-300">
          Check out our YouTube channel!
        </h3>
      </Link>
      <FLPGrid flps={visibleFlps} />
    </div>
  );
}
