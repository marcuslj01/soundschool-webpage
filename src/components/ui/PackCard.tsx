"use client";

import { Pack } from "@/lib/types/pack";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Badge from "./Badge";

interface PackCardProps {
  product: Pack;
  isOwned: boolean;
}

export default function PackCard({ product, isOwned }: PackCardProps) {
  function checkIsNew(date: string) {
    const today = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(today.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3;
  }

  const isNew = checkIsNew(product.created_at.toISOString());

  return (
    <div className="group overflow-hidden rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 hover:scale-[1.02] w-full">
      <Link href={`/pack?id=${product.id}`}>
        {/* Image — white background to make pack art pop */}
        <div className="overflow-hidden bg-gray-300">
          <Image
            alt={product.name}
            src={product.image_url}
            width={500}
            height={500}
            className="w-full h-60 sm:h-72 object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Info */}
        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold truncate">
              {product.name}
            </h3>
            {isOwned ? (
              <Badge text="OWNED" style="indigo" />
            ) : product.is_discounted ? (
              <Badge text="SALE!" style="green" />
            ) : (
              isNew && <Badge text="NEW!" style="yellow" />
            )}
          </div>

          <p className="text-xs text-zinc-500 mt-0.5 mb-3">
            {product.file_count} high quality {product.type}s
          </p>

          <div className="flex items-center justify-between">
            {!product.is_discounted ? (
              <p className="text-white font-bold">${product.price}</p>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-zinc-500 line-through text-sm">
                  ${product.price}
                </p>
                <p className="text-green-400 font-bold">
                  ${product.discount_price}
                </p>
              </div>
            )}

            <div className="hidden lg:flex flex-row gap-1.5 flex-wrap justify-end max-w-[55%]">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-zinc-400 bg-zinc-700 rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
