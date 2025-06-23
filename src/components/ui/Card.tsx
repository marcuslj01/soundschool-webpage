"use client";

import { Button } from "@headlessui/react";
import {
  CheckCircleIcon,
  HeartIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface CardProps {
  title: string;
  date: string;
  scale: string;
  bpm: number;
}

function Card({ title, date, scale, bpm }: CardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="bg-[#1A1D23] rounded-2xl w-full h-[100px] text-white p-2 flex flex-row items-center gap-2 min-w-fit">
      {/* Play/Pause Button */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 flex items-center justify-center rounded-full focus:outline-none"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <div className="relative w-full h-full flex items-center justify-center ">
              <svg
                className="absolute w-full h-full hover:cursor-pointer"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  className="text-blue-500"
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
          <span>{date}</span>
          <span>·</span>
          <span>{scale}</span>
          <span>·</span>
          <span>{bpm} BPM</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 flex flex-col justify-end w-1/4 gap-2">
        {/* New and Heart button */}
        <div className="flex flex-row gap-2 justify-end">
          <Button className="bg-secondary text-black rounded-md px-1 font-bold text-xs sm:text-sm h-5">
            NEW!
          </Button>
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
              className="bg-primary/20 text-white text-xs rounded-md w-full h-8 px-1 flex items-center justify-center flex-row hover:bg-primary/10 hover:cursor-pointer"
              onClick={() => setIsAdded(!isAdded)}
            >
              <p>In cart</p> <CheckCircleIcon className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="bg-primary text-white text-xs sm:text-sm rounded-md w-full h-8 px-1 flex items-center justify-center flex-row gap-1 hover:bg-primary/70 hover:cursor-pointer"
              onClick={() => setIsAdded(!isAdded)}
            >
              <p>Add</p> <ShoppingCartIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
