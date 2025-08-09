"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailAuthForm from "@/components/ui/EmailAuthForm";
import Image from "next/image";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (user && !loading) {
      // Check if there's a redirect URL saved
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin"); // Clean up
        router.push(redirectUrl || "/");
      } else {
        router.push("/");
        console.log("Redirecting to home page");
      }
    }
  }, [user, loading, router]);

  // While authenticating, show a loading spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if user is already logged in
  if (user) {
    return null; // Router will handle redirect, so we don't need to return anything
  }

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="SoundSchool"
            src="/logo/sslogo.png"
            className="mx-auto h-10 w-auto"
            width={100}
            height={100}
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            {authMode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Email/Password Authentication */}
          <div className="mb-8">
            <EmailAuthForm mode={authMode} onModeChange={setAuthMode} />
          </div>
        </div>
      </div>
    </>
  );
}
