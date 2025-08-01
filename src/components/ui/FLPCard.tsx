import { FLP } from "@/lib/types/FLP";
import React from "react";
import Badge from "./Badge";
import Image from "next/image";
import Link from "next/link";

interface FLPCardProps {
  flp: FLP;
  isOwned: boolean;
}

function FLPCard({ flp, isOwned }: FLPCardProps) {
  return (
    <div className="w-full bg-gray-900 rounded-lg hover:scale-105 transition-all duration-300">
      <div className="mb-2">
        <Link className="w-full h-fit" href={`/flp/${flp.id}`}>
          <Image
            src={flp.image_url}
            alt={flp.name}
            width={500}
            height={500}
            className="w-full h-fit object-contain"
          />
        </Link>
        <div className="flex flex-row justify-between px-4 pt-4">
          <h3 className="text-gray-200 text-lg font-bold">{flp.name}</h3>
          <div>{isOwned && <Badge text="OWNED" style="indigo" />}</div>
        </div>
        <p className="text-sm font-bold px-4 text-gray-400">
          {flp.description}
        </p>

        <div className="flex flex-row justify-between p-4">
          <div className="flex flex-row gap-2 max-w-3/4">
            {flp.tags?.map((tag) => (
              <Badge key={tag} text={tag} style="blue" />
            ))}
          </div>
          <Link
            className="text-gray-200 text-sm font-bold px-4 bg-primary hover:bg-primary/80 transition-all duration-300 rounded-md py-2"
            href={`/flp/${flp.id}`}
          >
            Get FLP
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FLPCard;
