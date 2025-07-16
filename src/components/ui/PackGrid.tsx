import React from "react";
import { Pack } from "@/lib/types/pack";
import PackCard from "./PackCard";

interface PackGridProps {
  products: Pack[];
}

async function PackGrid({ products }: PackGridProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 flex flex-col gap-4 lg:flex-row">
      {products.map((product) => (
        <PackCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default PackGrid;
