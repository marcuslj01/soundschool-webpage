"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <div
      ref={ref}
      className="mx-auto max-w-2xl px-4 sm:px-6 sm:max-w-7xl lg:px-8 grid  gap-4 grid-cols-1 md:grid-cols-2"
    >
      {products.map(
        (product, index) =>
          !product.hidden && (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            >
              <PackCard
                product={product}
                isOwned={ownedFiles.some(
                  (ownedFile) =>
                    ownedFile.id === product.id && ownedFile.type === "pack",
                )}
              />
            </motion.div>
          ),
      )}
    </div>
  );
}

export default PackGrid;
