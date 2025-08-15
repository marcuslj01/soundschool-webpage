"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

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

  // Animation refs
  const contentRef = useRef(null);
  const formRef2 = useRef(null);
  const isContentInView = useInView(contentRef, {
    once: true,
    margin: "-100px",
  });
  const isFormInView = useInView(formRef2, { once: true, margin: "-100px" });

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
    <div className="relative isolate bg-black min-h-screen w-full overflow-hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 w-full">
        <div
          ref={contentRef}
          className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:px-8 lg:py-48 w-full"
        >
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg w-full">
            <div className="absolute inset-y-0 left-0 -z-10 w-full h-full overflow-hidden bg-black ring-1 ring-white/10 lg:w-1/2">
              {/* Simplified background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-transparent to-primary/10" />

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-primary/20 rounded-full blur-2xl" />
              </div>
            </div>
            <motion.h2
              className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Contact us
            </motion.h2>
            <motion.p
              className="mt-6 text-lg/8 text-gray-400"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Have questions about our products or need help? Get in touch with
              us and we&apos;ll get back to you as soon as possible!
            </motion.p>
          </div>
        </div>
        <motion.form
          ref={formRef2}
          onSubmit={handleSubmit}
          className="px-6 pt-20 pb-24 sm:pb-32 lg:px-8 lg:py-48 w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={isFormInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg w-full">
            {submitStatus.type === "error" && (
              <motion.div
                className="mb-6 p-4 rounded-md bg-red-900/50 border border-red-500 text-red-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {submitStatus.message}
              </motion.div>
            )}
            {submitStatus.type === "success" && (
              <motion.div
                className="mb-6 p-4 rounded-md bg-green-900/50 border border-green-500 text-green-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {submitStatus.message}
              </motion.div>
            )}
            <div className="grid grid-cols-1 gap-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
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
              </motion.div>

              <motion.div
                className="sm:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
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
              </motion.div>
              <motion.div
                className="sm:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
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
              </motion.div>
            </div>
            <motion.div
              className="mt-8 flex justify-end"
              initial={{ opacity: 0, y: 30 }}
              animate={
                isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <button
                type="submit"
                disabled={isSubmitting || !ready}
                className="rounded-md hover:bg-primary/80 hover:cursor-pointer duration-300 hover:scale-102 transition-all bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
