"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName?: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: typeof window.fbq;
  }
}

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    if (!pixelId || typeof window === "undefined") return;

    // Check if user has already consented
    const savedConsent = localStorage.getItem("cookie-consent");
    if (savedConsent === "accepted") {
      setHasConsented(true);
    } else if (savedConsent === "declined") {
      setHasConsented(false);
    }

    // Listen for cookie consent events
    const handleConsent = () => {
      setHasConsented(true);
    };

    window.addEventListener("cookie-consent-accepted", handleConsent);

    return () => {
      window.removeEventListener("cookie-consent-accepted", handleConsent);
    };
  }, [pixelId]);

  useEffect(() => {
    if (!hasConsented || !pixelId || typeof window === "undefined") return;

    // Function to initialize Meta Pixel after script loads
    const initializePixel = () => {
      if (!window.fbq) {
        // Script not loaded yet, wait a bit
        setTimeout(initializePixel, 100);
        return;
      }

      try {
        window.fbq("init", pixelId);
        window.fbq("track", "PageView");
      } catch (e) {
        console.error("Meta Pixel initialization error:", e);
      }
    };

    // Wait a bit for script to load, then initialize
    setTimeout(initializePixel, 100);
  }, [hasConsented, pixelId]);

  if (!pixelId || hasConsented === false) {
    // Don't load script if user declined or hasn't consented
    return null;
  }

  if (hasConsented === null) {
    // Wait for consent decision
    return null;
  }

  // Only load script after consent
  return (
    <>
      {/* Meta Pixel Code - only loads after consent */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
      {/* Meta Pixel NoScript Fallback */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  );
}
