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
    return diffDays < 3; // If pack is less than 3 days old, it's new
  }

  const isNew = checkIsNew(product.created_at.toISOString());

  return (
    <div
      key={product.id}
      className="group relative overflow-hidden rounded-lg bg-gray-700/10 w-full border border-black/10 hover:scale-102 opacity-95 hover:opacity-100 transition-all duration-300"
    >
      <Link href={`/pack?id=${product.id}`}>
        <div className="relative">
          <Image
            alt={product.name}
            src={product.image_url}
            width={500}
            height={500}
            className="w-full h-64 sm:h-80 bg-gray-900 object-contain"
          />
        </div>
        <div className="p-4">
          <div className="flex flex-row justify-between relative">
            <h3 className="text-md font-medium text-white max-w-3/4 truncate">
              <span aria-hidden="true" className="absolute inset-0" />
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
          <p className="text-sm text-gray-500 font-bold mb-2">
            {product.file_count} high quality {product.type}s
          </p>
          <div className="flex flex-row justify-between">
            {!product.is_discounted ? (
              <p className="text-gray-200 text-lg font-bold">
                ${product.price}
              </p>
            ) : (
              <p className="text-gray-200 text-lg font-bold flex flex-row gap-2">
                <span className="text-gray-400 line-through">
                  ${product.price}
                </span>
                <span className="text-green-400">
                  ${product.discount_price}
                </span>
              </p>
            )}
          </div>
          <div className="space-y-2 flex flex-row justify-between mt-2 ">
            <div className="flex-row gap-2 flex-wrap h-fit hidden lg:flex max-w-full truncate">
              {product.tags.map((tag) => (
                <Badge key={tag} text={tag} style="blue" />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
