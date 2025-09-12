"use client";

import React from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 p-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2 text-sm">
              We use cookies to improve your experience
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              We use cookies for analytics to understand how you use our site,
              authentication to keep you logged in, and to remember your
              shopping cart. You can choose to accept or decline non-essential
              cookies.
            </p>
          </div>

          <div className="flex flex-row gap-2 sm:gap-3">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-md hover:border-gray-500 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
