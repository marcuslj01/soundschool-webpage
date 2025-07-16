"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 hover:cursor-pointer"
    >
      <ArrowLeftIcon className="w-5 h-5" />
      <span className="text-sm font-medium">Back</span>
    </button>
  );
}
