"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function EmptyHeroPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden bg-black pt-20 pb-4">
      {/* Dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      {/* Blurred blue spotlights */}
      <div className="absolute inset-0 z-0">
        {/* Top left spotlight */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-primary/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Top right spotlight */}
        <motion.div
          className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/35 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Bottom center spotlight */}
        <motion.div
          className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-primary/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Center left spotlight */}
        <motion.div
          className="absolute top-1/2 -left-16 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.45, 0.3],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Center right spotlight */}
        <motion.div
          className="absolute top-1/3 -right-20 w-56 h-56 bg-primary/35 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Welcome to <span className="text-primary">SoundSchool</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-2xl lg:text-4xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            The best place to start your next track!
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            Discover premium MIDI files, sample packs, and FLP projects to
            elevate your music production
          </motion.p>

          {/* Call to action buttons - mobile first */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="#products"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 block"
              >
                Latest Products
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/about"
                className="w-full sm:w-auto border border-primary/30 text-primary hover:bg-primary/10 font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 block"
              >
                Learn More →
              </Link>
            </motion.div>
          </motion.div>

          {/* Quality attributes */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <motion.div transition={{ duration: 0.2 }}>
              <div className="text-md lg:text-2xl font-bold text-gray-300">
                Reliable
              </div>
              <div className="text-xs lg:text-base text-gray-400">
                Trusted by producers
              </div>
            </motion.div>
            <div className="hidden sm:block w-px h-8 bg-gray-600"></div>
            <motion.div transition={{ duration: 0.2 }}>
              <div className="text-md lg:text-2xl font-bold text-gray-300">
                High Quality
              </div>
              <div className="text-xs lg:text-base text-gray-400">
                We ensure the best quality
              </div>
            </motion.div>
            <div className="hidden sm:block w-px h-8 bg-gray-600"></div>
            <motion.div transition={{ duration: 0.2 }}>
              <div className="text-md lg:text-2xl font-bold text-gray-300">
                Ready to Use
              </div>
              <div className="text-xs lg:text-base text-gray-400">
                Download & start creating
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
