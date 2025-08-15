"use client";

import { FLP } from "@/lib/types/FLP";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import FLPCard from "./FLPCard";
import { useAuth } from "@/contexts/AuthContext";
import { OwnedFile } from "@/lib/types/ownedFile";
import { getOwnedFiles } from "@/lib/firestore/user";

export interface FLPGridProps {
  flps: FLP[];
}

function FLPGrid({ flps }: FLPGridProps) {
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
      className="mx-auto max-w-2xl px-4 sm:px-6 sm:max-w-7xl lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {flps.map((flp, index) => (
        <motion.div
          key={flp.id}
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{
            duration: 0.8,
            delay: index * 0.15,
            ease: "easeOut",
          }}
        >
          <FLPCard
            flp={flp}
            isOwned={ownedFiles.some(
              (ownedFile) => ownedFile.id === flp.id && ownedFile.type === "flp"
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default FLPGrid;
