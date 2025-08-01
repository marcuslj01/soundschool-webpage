"use client";

import { FLP } from "@/lib/types/FLP";
import React, { useEffect, useState } from "react";
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl xl:max-w-7xl mx-auto p-4">
      {flps.map((flp) => (
        <FLPCard
          key={flp.id}
          flp={flp}
          isOwned={ownedFiles.some(
            (ownedFile) => ownedFile.id === flp.id && ownedFile.type === "flp"
          )}
        />
      ))}
    </div>
  );
}

export default FLPGrid;
