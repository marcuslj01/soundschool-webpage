"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CookieConsentContextType {
  hasConsented: boolean | null; // null = not decided yet, true = accepted, false = declined
  acceptCookies: () => void;
  declineCookies: () => void;
  showBanner: boolean;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent status from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem("cookie-consent");
    if (savedConsent === null) {
      // No decision made yet, show banner
      setShowBanner(true);
    } else {
      // Decision already made
      setHasConsented(savedConsent === "accepted");
      setShowBanner(false);
    }
  }, []);

  const acceptCookies = () => {
    setHasConsented(true);
    setShowBanner(false);

    localStorage.setItem("cookie-consent", "accepted");
    // Trigger analytics initialization
    window.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
  };

  const declineCookies = () => {
    setHasConsented(false);
    setShowBanner(false);

    localStorage.setItem("cookie-consent", "declined");
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsented,
        acceptCookies,
        declineCookies,
        showBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}
