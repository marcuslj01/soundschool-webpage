"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { claimFiles } from "@/lib/firestore/user";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function ClaimFilesButton() {
  const { user } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  const handleClaimFiles = async () => {
    if (!user?.email) return;

    setIsClaiming(true);
    setMessage(null);

    try {
      const result = await claimFiles(user.uid, user.email);

      if (result.success) {
        setMessageType("success");
        setMessage(result.message);

        // Refresh the page to show newly claimed files
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessageType("info");
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error claiming files:", error);
      setMessageType("error");
      setMessage("Failed to claim files. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  if (!user?.email) return null;

  return (
    <div className="mb-8">
      <button
        onClick={handleClaimFiles}
        disabled={isClaiming}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 hover:cursor-pointer ${
          isClaiming
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-primary hover:bg-primary/80 text-white hover:scale-105"
        }`}
      >
        {isClaiming ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Claiming files...</span>
          </>
        ) : (
          <>
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span>Claim Previous Purchases</span>
          </>
        )}
      </button>

      {message && (
        <div
          className={`mt-3 p-3 rounded-md ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : messageType === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          {message}
        </div>
      )}

      <p className="text-sm text-gray-400 mt-2">
        If you&apos;ve made purchases as a guest with this email address, click
        here to claim your files.
      </p>
    </div>
  );
}
