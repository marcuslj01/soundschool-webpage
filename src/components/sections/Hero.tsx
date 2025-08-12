"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  productImage: string;
  backgroundImage: string;
  packLink: string;
}

function Hero(props: HeroProps) {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="relative h-[80vh] w-full">
      <Image
        src={props.backgroundImage}
        alt="Background image"
        fill
        className="object-cover"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10" />

      <div className="absolute inset-0 z-10 flex flex-col sm:flex-row sm:gap-10 justify-center items-center p-8">
        {/* Desktop view */}
        <div className="flex flex-col items-center sm:items-start justify-center min-h-1/4">
          <h2 className="text-4xl text-gray-300 mb-1">Welcome to</h2>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            Soundschool
          </h1>

          {/* Blue line */}
          <div className="w-30 h-1 bg-primary rounded mb-8" />

          <div className="sm:block hidden">
            <h3 className="text-2xl sm:text-3xl text-gray-300 font-bold">
              Check out our biggest pack yet!
            </h3>
            <div className="flex flex-row gap-4 mt-8">
              <Link
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
                href={props.packLink}
              >
                Explore our latest pack
              </Link>

              <button
                onClick={scrollToProducts}
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 hover:cursor-pointer transition-all duration-300"
              >
                Other products
              </button>
            </div>
          </div>
        </div>
        <div className="sm:block hidden">
          <Image
            src={props.productImage}
            alt="Picture of the product"
            width={400}
            height={400}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Mobile view */}
        <div className="h-1/2 flex flex-col items-center justify-center sm:hidden mt-12">
          <h3 className="text-2xl text-gray-200 font-bold text-center">
            Check out our biggest pack yet!
          </h3>
          <Image
            src={props.productImage}
            alt="Picture of the product"
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
          />
          <div className="flex flex-row items-center justify-center gap-4 mt-8">
            <Link
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:cursor-pointer transition-all duration-300"
              href={props.packLink}
            >
              Read more
            </Link>

            <button
              onClick={scrollToProducts}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 hover:cursor-pointer transition-all duration-300"
            >
              Other products
            </button>
          </div>
        </div>
      </div>

      <div className="h-1/2 flex flex-col items-center justify-center sm:block"></div>
    </div>
  );
}

export default Hero;
