"use client";

import { Pack } from "@/lib/types/pack";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Badge from "./Badge";
interface PackCardProps {
  product: Pack;
}

export default function PackCard({ product }: PackCardProps) {
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
      className="group relative overflow-hidden rounded-lg  bg-black/10 w-80 sm:w-96 md:w-[500px] border border-black/10"
    >
      <Link href={`/packs/${product.id}`}>
        <div className="relative">
          <Image
            alt={product.name}
            src={product.image_url}
            width={500}
            height={500}
            className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 object-cover group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex flex-row justify-between">
            <h3 className="text-lg lg:text-2xl font-medium text-white">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
            {isNew && <Badge text="New!" style="yellow" />}
          </div>
          <p className="text-sm text-gray-500 font-bold">
            {product.file_count} high quality {product.type}s
          </p>

          <div className="space-y-2 mt-2 flex flex-row justify-between">
            <div className="flex flex-row gap-2 flex-wrap">
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
