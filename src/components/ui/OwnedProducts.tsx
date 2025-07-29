"use client";

import { Midi } from "@/lib/types/midi";
import { Pack } from "@/lib/types/pack";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Badge from "./Badge";
import Link from "next/link";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

interface OwnedMidiCardProps {
  midi: Midi;
}

export function OwnedMidiCard({ midi }: OwnedMidiCardProps) {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format date for display
  function formatDateForDisplay(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const displayDate = formatDateForDisplay(midi.created_at.toISOString());

  // Audio functionality
  React.useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => setProgress(0));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => setProgress(0));
    };
  }, [audioRef]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleDownload = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          fileId: midi.id,
          fileType: "midi",
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const { downloadUrl, fileName } = await response.json();

      // Trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="bg-[#1A1D23] rounded-2xl w-full h-[100px] text-white p-2 flex flex-row items-center gap-2 transition-all duration-300 hover:bg-[#2b303a]">
      {/* Play/Pause Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handlePlayPause}
          className="w-14 h-14 flex items-center justify-center rounded-full focus:outline-none"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="#2563eb"
                  strokeWidth="5"
                  fill="none"
                  style={{
                    strokeDasharray: 2 * Math.PI * 48,
                    strokeDashoffset: (1 - progress) * 2 * Math.PI * 48,
                    transition: "stroke-dashoffset 0.1s linear",
                  }}
                />
              </svg>
              {/* Pause Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </div>
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center hover:cursor-pointer bg-[#292E35]">
              {/* Play Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Text section */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Link href={`/midi?id=${midi.id}`} className="hover:cursor-pointer">
          <h1 className="font-semibold text-sm sm:text-lg transition-colors hover:text-blue-400">
            {midi.name}
          </h1>

          <div className="flex flex-row flex-wrap items-center gap-0.5 text-xs sm:text-md text-gray-400">
            <div className="hidden sm:block">
              <Badge text={displayDate} style="gray" />
            </div>
            <Badge text={midi.root + " " + midi.scale} style="gray" />
            <Badge text={midi.bpm + " BPM"} style="gray" />
          </div>
        </Link>
      </div>

      {/* Download Button */}
      <div className="flex flex-col justify-end gap-2 flex-shrink-0">
        <div className="flex flex-row gap-2 justify-end items-center">
          <Badge text="OWNED" style="indigo" />
        </div>
        <div className="flex flex-row justify-end">
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white text-xs rounded-md w-full h-8 px-1 flex items-center justify-center flex-row gap-1 hover:bg-green-700 hover:cursor-pointer transition-all duration-300"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:block">Download</span>
          </button>
        </div>
      </div>
      <audio ref={audioRef} src={midi.preview_url} />
    </div>
  );
}

interface OwnedPackCardProps {
  pack: Pack;
}

export function OwnedPackCard({ pack }: OwnedPackCardProps) {
  const { user } = useAuth();

  const handleDownload = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          fileId: pack.id,
          fileType: "pack",
        }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const { downloadUrl, fileName } = await response.json();

      // Trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-black/10 border border-black/10 hover:scale-102 opacity-95 hover:opacity-100 transition-all duration-300 w-full">
      <Link href={`/pack?id=${pack.id}`}>
        <div className="relative">
          <Image
            alt={pack.name}
            src={pack.image_url}
            width={500}
            height={500}
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-900 object-contain"
          />
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-white mb-1">
                {pack.name}
              </h3>
              <p className="text-sm text-gray-500 font-bold mb-3">
                {pack.file_count} high quality {pack.type}s
              </p>
            </div>
            <Badge text="OWNED" style="indigo" />
          </div>

          {/* Tags - Mobile: wrap, Desktop: flex */}
          <div className="flex flex-wrap gap-2 mt-3 max-w-4/5">
            {pack.tags.map((tag) => (
              <Badge key={tag} text={tag} style="blue" />
            ))}
          </div>
        </div>
      </Link>

      {/* Download Button - Mobile: bottom center, Desktop: bottom right */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownload();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors text-xs sm:text-sm"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span className="hidden sm:block">Download</span>
        </button>
      </div>
    </div>
  );
}
