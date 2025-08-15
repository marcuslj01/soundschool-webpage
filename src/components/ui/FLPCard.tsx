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
  function checkIsNew(date: string) {
    const today = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(today.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3; // If pack is less than 3 days old, it's new
  }

  const isNew = checkIsNew(flp.created_at.toISOString());

  return (
    <div className="w-full bg-gray-900 rounded-lg hover:scale-105 transition-all duration-300">
      <div className="mb-2">
        <Link className="w-full h-fit" href={`/flp?id=${flp.id}`}>
          <Image
            src={flp.image_url}
            alt={flp.name}
            width={500}
            height={500}
            className="w-full h-fit object-contain"
          />
        </Link>
        <div className="flex flex-row justify-between px-3 pt-4 h-[80px]">
          <h3 className="text-gray-200 font-bold line-clamp-2 text-md sm:text-lg">
            {flp.name}
          </h3>
          <div className="px-2">
            {isOwned ? (
              <Badge text="OWNED" style="indigo" />
            ) : flp.is_discounted ? (
              <Badge text="SALE" style="green" />
            ) : isNew ? (
              <Badge text="NEW" style="yellow" />
            ) : (
              <Badge text="FLP" style="gray" />
            )}
          </div>
        </div>
        <p className="text-sm font-bold px-3 text-gray-400 ">FLP</p>

        <div className="flex flex-row justify-between p-3 ">
          <div className="flex-row gap-2 max-w-3/4 hidden lg:flex">
            {flp.tags?.map((tag) => (
              <Badge key={tag} text={tag} style="blue" />
            ))}
          </div>
          <Link
            className="text-gray-200 text-sm font-bold px-4 bg-primary hover:bg-primary/80 transition-all duration-300 rounded-md py-2"
            href={`/flp?id=${flp.id}`}
          >
            Get FLP
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FLPCard;
