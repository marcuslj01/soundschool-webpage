"use client";

import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface PlayButtonProps {
  previewUrl: string;
  className?: string;
}

function PlayButton({ previewUrl, className = "" }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (previewUrl) {
      const audioElement = new Audio(previewUrl);
      audioElement.addEventListener("ended", () => setIsPlaying(false));
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.removeEventListener("ended", () => setIsPlaying(false));
      };
    }
  }, [previewUrl]);

  const handlePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <button
      className={`w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 hover:cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${className}`}
      onClick={handlePlayPause}
    >
      {isPlaying ? (
        <>
          <PauseIcon className="w-4 h-4" />
          <span>Pause Preview</span>
        </>
      ) : (
        <>
          <PlayIcon className="w-4 h-4" />
          <span>Play Preview</span>
        </>
      )}
    </button>
  );
}

export default PlayButton;
