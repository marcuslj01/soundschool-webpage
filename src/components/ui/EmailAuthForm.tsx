"use client";

import { useState } from "react";

interface EmailAuthFormProps {
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export default function EmailAuthForm({
  mode,
  onModeChange,
}: EmailAuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // For now, just show a placeholder message
      if (mode === "register") {
        setError("Registration functionality not implemented yet");
      } else {
        setError("Login functionality not implemented yet");
      }
    }, 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 1000);
  };

  if (showResetPassword) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-white">Reset Password</h3>
          <p className="text-sm text-gray-400 mt-1">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {resetSent ? (
          <div className="text-center">
            <div className="text-green-400 text-sm">
              Password reset email sent! Check your inbox.
            </div>
            <button
              onClick={() => {
                setShowResetPassword(false);
                setResetSent(false);
                setResetEmail("");
              }}
              className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setResetEmail("");
                  setError("");
                }}
                className="px-4 py-2 border border-white/10 rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "register" && (
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Your name"
            />
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm/6 font-medium text-gray-100"
        >
          Email address
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Password
          </label>
          {mode === "login" && (
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="font-semibold text-indigo-400 hover:text-indigo-300 hover:cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
            placeholder="Enter your password"
          />
        </div>
      </div>

      {mode === "register" && (
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm/6 font-medium text-gray-100"
          >
            Confirm Password
          </label>
          <div className="mt-2">
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              placeholder="Confirm your password"
            />
          </div>
        </div>
      )}

      {mode === "register" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <input
              id="newsletter"
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="newsletter"
              className="ml-2 block text-sm text-gray-100"
            >
              I want to receive the newsletter
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="marketing"
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="marketing"
              className="ml-2 block text-sm text-gray-100"
            >
              I want to receive marketing offers
            </label>
          </div>
        </div>
      )}

      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
        >
          {loading
            ? mode === "register"
              ? "Creating account..."
              : "Signing in..."
            : mode === "register"
              ? "Create account"
              : "Sign in"}
        </button>
      </div>

      <p className="text-center text-sm/6 text-gray-400">
        {mode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            onModeChange(mode === "login" ? "register" : "login");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setDisplayName("");
            setNewsletter(false);
            setMarketing(false);
            setError("");
          }}
          className="font-semibold text-indigo-400 hover:text-indigo-300 hover:cursor-pointer"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </form>
  );
}
