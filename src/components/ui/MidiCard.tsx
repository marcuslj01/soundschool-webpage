"use client";

import { Button } from "@headlessui/react";
import {
  CheckCircleIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { addToCart, removeFromCart, isInCart } from "@/lib/cart";
import { CartItem } from "@/lib/types/cartItem";
import Badge from "./Badge";

interface CardProps {
  id: string;
  title: string;
  date: string;
  root: string;
  scale: string;
  bpm: number;
  previewUrl: string;
  price: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

function MidiCard({
  id,
  title,
  date,
  root,
  scale,
  bpm,
  price,
  previewUrl,
  isPlaying,
  onPlay,
  onPause,
}: CardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [progress, setProgress] = useState(0);

  function checkIsNew(date: string) {
    const today = new Date();
    const dateObj = new Date(date);
    const diffTime = Math.abs(today.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3; // If midi is less than 3 days old, it's new
  }

  // Format date for display
  function formatDateForDisplay(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const isNew = checkIsNew(date);
  const displayDate = formatDateForDisplay(date);

  // Check localStorage for initial isAdded
  useEffect(() => {
    setIsAdded(isInCart(id, "midi"));
    const update = () => setIsAdded(isInCart(id, "midi"));
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [id]);

  // Cart stuff
  const handleAddToCart = (item: CartItem) => {
    if (isAdded) {
      // Remove item from cart
      removeFromCart(id);
      setIsAdded(false);
    } else if (!isAdded) {
      // Add item to cart
      addToCart(item);
      setIsAdded(true);
    }
  };

  // Audio stuff
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => onPause();
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [onPause]);

  useEffect(() => {
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
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="bg-[#1A1D23] rounded-2xl w-full h-[100px] text-white p-2 flex flex-row items-center gap-2 min-w-fit hover:bg-[#2b303a] transition-all duration-300">
      {/* Play/Pause Button */}
      <div className="flex-shrink-0">
        <button
          onClick={handlePlayPause}
          className="w-14 h-14 flex items-center justify-center rounded-full focus:outline-none"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <div className="relative w-full h-full flex items-center justify-center ">
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
            <div className="w-full h-full rounded-full bg-[#292E35] flex items-center justify-center hover:cursor-pointer">
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
      <div className="flex flex-col gap-1 w-2/3 min-w-fit">
        <h1 className="font-semibold text-sm sm:text-lg">{title}</h1>
        <div className="flex flex-row flex-wrap items-center gap-0.5 text-xs sm:text-md text-gray-400 truncate">
          <Badge text={displayDate} style="gray" />
          <Badge text={root + " " + scale} style="gray" />
          <Badge text={bpm + " BPM"} style="gray" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 flex flex-col justify-end w-1/4 gap-2">
        {/* New and Heart button */}
        <div className="flex flex-row gap-2 justify-end">
          {isNew && <Badge text="NEW!" style="yellow" />}
          <Button
            className="h-5 w-5 flex items-center justify-center hover:cursor-pointer"
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? (
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </Button>
        </div>
        <div className="flex flex-row justify-end">
          {isAdded ? (
            <Button
              className="bg-primary/20 text-white text-xs rounded-md w-full h-8 px-1 flex items-center justify-center flex-row hover:bg-primary/10 hover:cursor-pointer transition-all duration-300"
              onClick={() =>
                handleAddToCart({
                  id: id,
                  type: "midi",
                  title: title,
                  price: price,
                })
              }
            >
              <p>In cart</p> <CheckCircleIcon className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="bg-primary text-white text-xs sm:text-sm rounded-md w-full h-8 px-1 flex items-center justify-center flex-row gap-1 hover:bg-primary/70 hover:cursor-pointer transition-all duration-300"
              onClick={() =>
                handleAddToCart({
                  id: id,
                  type: "midi",
                  title: title,
                  price: price,
                })
              }
            >
              <p>Add</p> <ShoppingCartIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <audio ref={audioRef} src={previewUrl} />
    </div>
  );
}

export default MidiCard;
