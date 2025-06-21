import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  productImage: string;
  backgroundImage: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

function Hero(props: HeroProps) {
  return (
    <div className="relative h-screen w-full">
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
          <h2 className="text-4xl text-gray-300 mb-1">{props.title}</h2>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            {props.subtitle}
          </h1>

          {/* Blue line */}
          <div className="w-30 h-1 bg-primary rounded mb-8" />

          <div className="sm:block hidden">
            <h3 className="text-2xl sm:text-3xl text-gray-300 font-bold">
              {props.description}
            </h3>
            <div className="flex flex-row gap-4 mt-8">
              <Button type="primary" text={props.primaryButtonText} />
              <Button type="secondary" text={props.secondaryButtonText} />
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
            {props.description}
          </h3>
          <Image
            src={props.productImage}
            alt="Picture of the product"
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
          />
          <div className="flex flex-row items-center justify-center gap-4 mt-8">
            <Button type="primary" text={props.primaryButtonText} />
            <Button type="secondary" text={props.secondaryButtonText} />
          </div>
        </div>
      </div>

      <div className="h-1/2 flex flex-col items-center justify-center sm:block"></div>
    </div>
  );
}

export default Hero;
