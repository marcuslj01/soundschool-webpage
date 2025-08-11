"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmailAuthForm from "@/components/ui/EmailAuthForm";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Image from "next/image";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);

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
            <EmailAuthForm
              mode={authMode}
              onModeChange={setAuthMode}
              onResetPasswordChange={setIsResetPasswordMode}
            />
          </div>

          {/* Only show Google Sign In for login, not for register or password reset */}
          {authMode === "login" && !isResetPasswordMode && (
            <>
              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-900 px-2 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              {/* Google Sign In */}
              <div className="mb-6">
                <GoogleSignInButton />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
