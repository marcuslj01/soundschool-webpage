"use client";

import React, { useEffect, useState } from "react";
import { Pack } from "@/lib/types/pack";
import PackCard from "./PackCard";
import { OwnedFile } from "@/lib/types/ownedFile";
import { getOwnedFiles } from "@/lib/firestore/user";
import { useAuth } from "@/contexts/AuthContext";

interface PackGridProps {
  products: Pack[];
}

function PackGrid({ products }: PackGridProps) {
  const { user } = useAuth();
  const [ownedFiles, setOwnedFiles] = useState<OwnedFile[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOwnedFiles = async () => {
        const existingOwnedFiles = await getOwnedFiles(user.uid);
        setOwnedFiles(existingOwnedFiles);
      };
      fetchOwnedFiles();
    }
  }, [user]);
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 sm:max-w-7xl lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(
        (product) =>
          !product.hidden && (
            <PackCard
              key={product.id}
              product={product}
              isOwned={ownedFiles.some(
                (ownedFile) =>
                  ownedFile.id === product.id && ownedFile.type === "pack"
              )}
            />
          )
      )}
    </div>
  );
}

export default PackGrid;
