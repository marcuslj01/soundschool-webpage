"use client";

import React, { useState, useRef } from "react";

function useRecaptchaV3(siteKey: string) {
  const [ready, setReady] = useState(false);

  // Load the reCAPTCHA script
  React.useEffect(() => {
    if (window.grecaptcha) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [siteKey]);

  // Function to execute reCAPTCHA and get token
  const execute = async (action: string = "submit") => {
    if (!window.grecaptcha || typeof window.grecaptcha.execute !== "function")
      throw new Error("reCAPTCHA not loaded");
    return await window.grecaptcha.execute(siteKey, { action });
  };

  return { ready, execute };
}

declare global {
  interface Window {
    grecaptcha:
      | {
          execute(
            siteKey: string,
            options: { action: string }
          ): Promise<string>;
          render?: (...args: unknown[]) => unknown;
          reset?: (...args: unknown[]) => unknown;
        }
      | undefined;
  }
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const { ready, execute } = useRecaptchaV3(siteKey);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsSubmitting(false);
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    let captchaToken = "";
    try {
      if (!ready) throw new Error("reCAPTCHA ikke klar");
      captchaToken = await execute();
    } catch {
      setIsSubmitting(false);
      setSubmitStatus({
        type: "error",
        message: "Could not verify CAPTCHA. Please try again.",
      });
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          captchaToken,
        }),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon.",
      });
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative isolate bg-black min-h-screen">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-black ring-1 ring-white/10 lg:w-1/2">
              <svg
                aria-hidden="true"
                className="absolute inset-0 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-white/10"
              >
                <defs>
                  <pattern
                    x="100%"
                    y={-1}
                    id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                  className="fill-black"
                />
                <svg
                  x="100%"
                  y={-1}
                  className="overflow-visible fill-gray-800/20"
                >
                  <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect
                  fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                />
              </svg>
              <div
                aria-hidden="true"
                className="absolute top-[calc(100%-13rem)] -left-56 block transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))]"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
                  }}
                  className="aspect-1155/678 w-288.75 bg-gradient-to-br from-primary to-purple-600 opacity-20"
                />
              </div>
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
              Contact us
            </h2>
            <p className="mt-6 text-lg/8 text-gray-400">
              Have questions about our products or need help? Get in touch with
              us and we&apos;ll get back to you as soon as possible!
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          ref={formRef}
          className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48"
        >
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            {submitStatus.type === "error" && (
              <div className="mb-6 p-4 rounded-md bg-red-900/50 border border-red-500 text-red-200">
                {submitStatus.message}
              </div>
            )}
            {submitStatus.type === "success" && (
              <div className="mb-6 p-4 rounded-md bg-green-900/50 border border-green-500 text-green-200">
                {submitStatus.message}
              </div>
            )}
            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm/6 font-semibold text-white"
                >
                  Name *
                </label>
                <div className="mt-2.5">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-semibold text-white"
                >
                  Email *
                </label>
                <div className="mt-2.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm/6 font-semibold text-white"
                >
                  Message *
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-primary"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !ready}
                className="rounded-md hover:bg-primary/80 hover:cursor-pointer duration-300 hover:scale-102 transition-all bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
