"use client";

import { useEffect } from "react";

export default function HtmlWrapper() {
  useEffect(() => {
    // Handle Google Analytics Opt-out extension attribute
    const html = document.documentElement;

    // If the extension adds the attribute, we need to handle it
    if (html.hasAttribute("data-google-analytics-opt-out")) {
      // This is expected behavior from the extension, so we just acknowledge it
      console.log("Google Analytics Opt-out extension detected");
    }
  }, []);

  return null;
}
