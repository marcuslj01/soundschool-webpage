import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

const testimonials = [
  {
    id: 2,
    author: { name: "Giggy Mop" },
    avatar: "/images/Giggy.png",
    body: "A must have for any producer wanting to make professional tracks faster!",
    rating: 5,
  },
  {
    id: 1,
    author: { name: "Alex Deeper" },
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjU5oGdha7fxEte20o-ACsx7up8AxwMDnt4F1m6o3-AjaA2Fbex_=s385-p-k-rw-no",
    body: "The megapack allowed me to create professional tracks more quickly and easily! Highly recommend it!",
    rating: 5,
  },
  {
    id: 3,
    author: { name: "Manny West" },
    avatar:
      "https://lh3.googleusercontent.com/a-/ALV-UjU5oGdha7fxEte20o-ACsx7up8AxwMDnt4F1m6o3-AjaA2Fbex_=s385-p-k-rw-no",
    body: "I can finally stop wasting hours on finding the perfect chord progression for my tracks! This pack is a game changer!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative isolate pt-24 pb-32 sm:pt-32 bg-gray-950">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="ml-[max(50%,38rem)] aspect-1313/771 w-328.25 bg-linear-to-tr from-[#22D3EE] to-[#60A5FA]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="-ml-88 aspect-1313/771 w-328.25 flex-none origin-top-right rotate-30 bg-linear-to-tr from-[#22D3EE] to-[#60A5FA] xl:mr-[calc(50%-12rem)] xl:ml-0"
        />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-blue-200">
            Testimonials
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl dark:text-white">
            See what others are saying
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 grid lg:grid-cols-3 grid-cols-1 gap-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="pt-8 sm:inline-block sm:w-full sm:px-4"
              >
                <figure className="rounded-2xl bg-gray-50 p-8 text-sm/6 dark:bg-white/2.5 shadow-lg h-full flex flex-col justify-between">
                  {testimonial.rating && (
                    <div className="flex items-center gap-x-2 pb-2">
                      <p className="text-yellow-400 text-lg font-bold">
                        {testimonial.rating}
                      </p>
                      {Array.from({ length: testimonial.rating }).map(
                        (_, index) => (
                          <StarIcon
                            key={index}
                            className="w-4 h-4 text-yellow-500"
                          />
                        ),
                      )}
                    </div>
                  )}
                  <blockquote className="text-gray-100">
                    <p>{`“${testimonial.body}”`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <Image
                      alt=""
                      src={testimonial.avatar}
                      width={40}
                      height={40}
                      className="size-10 rounded-full bg-gray-50 dark:bg-gray-800"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author.name}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
