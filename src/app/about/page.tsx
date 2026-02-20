"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

//Alrfred

const features = [
  {
    title: "High-Quality Resources",
    description:
      "All our files are created by professional producers and tested for quality.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Easy Access",
    description:
      "Download and use our resources immediately in your own project.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Continuous Updates",
    description:
      "We add new resources regularly to keep you updated with the latest trends.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isMissionInView = useInView(missionRef, {
    once: true,
    margin: "-100px",
  });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <main className="flex flex-col gap-6 w-full items-center text-white min-h-screen mt-16 sm:mt-20 px-4 sm:px-6">
      {/* Hero section */}
      <motion.div
        ref={heroRef}
        className="flex flex-col gap-6 w-full items-center text-white py-8 sm:py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center max-w-4xl">
          <motion.h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            We are <span className="text-primary">SoundSchool</span>
          </motion.h1>
          <motion.p
            className="text-gray-300 text-center max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Your digital home for professional music production resources. We
            offer high-quality MIDI files, FLP files, and packs that help
            producers and artists create amazing music.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <a
              href="/midis"
              className="bg-primary text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg hover:bg-primary/80 hover:cursor-pointer transition-all duration-300 text-center font-medium"
            >
              Explore MIDI Files
            </a>
            <a
              href="/flps"
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg hover:bg-white hover:text-black hover:cursor-pointer transition-all duration-300 text-center font-medium"
            >
              View FLP Files
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats section */}
      <motion.div
        ref={statsRef}
        className="flex flex-col gap-6 w-full items-center text-white py-8 sm:py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center max-w-4xl">
          <motion.h2
            className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Helping producers create amazing music
          </motion.h2>
          <motion.p
            className="text-gray-300 text-center max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={
              isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            SoundSchool is dedicated to giving producers and artists the best
            resources to realize their musical visions.
          </motion.p>
        </div>
      </motion.div>

      {/* Mission section */}
      <motion.div
        ref={missionRef}
        className="flex flex-col gap-8 sm:gap-12 w-full items-center text-white py-8 sm:py-16 max-w-7xl"
        initial={{ opacity: 0, y: 50 }}
        animate={isMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
          <motion.div
            className="bg-gray-900/50 rounded-lg p-6 sm:p-8 border border-gray-800"
            initial={{ opacity: 0, x: -50 }}
            animate={
              isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
            }
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl mb-4 sm:mb-6">
              Our Mission
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
              We believe that all producers deserve access to professional
              resources that can help them develop their art. SoundSchool is
              built on the principle of making music production accessible to
              everyone.
            </p>
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isMissionInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -30 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 rounded-lg p-6 sm:p-8 border border-gray-800"
            initial={{ opacity: 0, x: 50 }}
            animate={
              isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
            }
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl mb-4 sm:mb-6">
              Why Choose SoundSchool?
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {[
                "Professional quality resources",
                "Instant download access",
                "Regular new content updates",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={
                    isMissionInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 30 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-green-600/20 text-green-400 flex-shrink-0">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base text-gray-300">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA section */}
      <motion.div
        ref={ctaRef}
        className="flex flex-col gap-6 w-full items-center text-white py-8 sm:py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="bg-gray-900/50 rounded-lg p-6 sm:p-8 border border-gray-800 max-w-4xl text-center w-full">
          <motion.h2
            className="text-xl font-bold text-white sm:text-2xl lg:text-3xl mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Ready to take your music production to the next level?
          </motion.h2>
          <motion.p
            className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Explore our library of professional MIDI files, FLP files, and packs
            today.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <a
              href="/midis"
              className="bg-primary text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg hover:bg-primary/80 hover:cursor-pointer transition-all duration-300 text-center font-medium"
            >
              Explore MIDI Files
            </a>
            <a
              href="/flps"
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-3 rounded-lg hover:bg-white hover:text-black hover:cursor-pointer transition-all duration-300 text-center font-medium"
            >
              View FLP Files
            </a>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
