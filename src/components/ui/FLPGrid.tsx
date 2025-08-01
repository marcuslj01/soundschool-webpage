import { FLP } from "@/lib/types/FLP";
import React from "react";
import FLPCard from "./FLPCard";

export interface FLPGridProps {
  flps: FLP[];
}

function FLPGrid({ flps }: FLPGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl xl:max-w-7xl mx-auto p-4">
      {flps.map((flp) => (
        <FLPCard key={flp.id} flp={flp} isOwned={true} />
      ))}
    </div>
  );
}

export default FLPGrid;
