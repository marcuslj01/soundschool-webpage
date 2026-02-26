"use client";

import { PlayIcon, PauseIcon } from "@heroicons/react/24/outline";
import { AudioWaveform } from "lucide-react";
import React, { useEffect, useState } from "react";

interface PlayButtonProps {
  previewUrl: string;
  className?: string;
  name: string;
  type?: "midi" | "pack";
}

function PlayButton({ previewUrl, name, type }: PlayButtonProps) {
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
    <>
      {/* Megapack playbuttons */}
      {type === "pack" ? (
        <div>
          {isPlaying ? (
            <>
              <button
                key={name}
                onClick={handlePlayPause}
                className="flex flex-col items-center justify-center bg-white/20 rounded-lg p-4 hover:cursor-pointer hover:bg-gray-100/20 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <AudioWaveform className="lg:w-10 lg:h-10 w-8 h-8 m-2 text-gray-200" />
                <div className="flex flex-row items-center justify-center">
                  <PauseIcon className="lg:w-5 lg:h-5 w-4 h-4 mr-2" />
                  <span className="text-white lg:text-lg text-xs">{name}</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                key={name}
                onClick={handlePlayPause}
                className="flex flex-col items-center justify-center bg-white/10 rounded-lg p-4 hover:cursor-pointer hover:bg-gray-100/20 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <AudioWaveform className="lg:w-10 lg:h-10 w-8 h-8 m-2 text-gray-200" />
                <div className="flex flex-row items-center justify-center">
                  <PlayIcon className="lg:w-5 lg:h-5 w-4 h-4 mr-2" />
                  <span className="text-white lg:text-lg text-xs">{name}</span>
                </div>
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          {isPlaying ? (
            <div>
              <button
                key={name}
                onClick={handlePlayPause}
                className="flex flex-col items-center w-full justify-center bg-white/10 rounded-lg p-4 hover:cursor-pointer hover:bg-gray-100/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-row items-center justify-center">
                  <PauseIcon className="w-4 h-4 mr-2" />
                  <span className="text-white lg:text-sm text-xs">{name}</span>
                </div>
              </button>
            </div>
          ) : (
            <div>
              <button
                key={name}
                onClick={handlePlayPause}
                className="flex flex-col items-center w-full justify-center bg-white/10 rounded-lg p-4 hover:cursor-pointer hover:bg-gray-100/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex flex-row items-center justify-center">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  <span className="text-white lg:text-sm text-xs">{name}</span>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PlayButton;
