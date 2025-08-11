"use client";

import { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  BellIcon,
  TrashIcon,
  XMarkIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserData,
  updateUserPreferences,
  deleteUser,
} from "@/lib/firestore/user";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import Image from "next/image";

// Helper function to get initials from display name
const getInitials = (displayName: string | null): string => {
  if (!displayName) return "?";

  const names = displayName.trim().split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Helper function to check if user signed up with email/password
const isEmailPasswordUser = (user: User): boolean => {
  return (
    user?.providerData?.length > 0 &&
    user.providerData[0].providerId === "password"
  );
};

export default function SettingsPage() {
  const { user, logout, resetPassword } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    newsletter: false,
    marketing: false,
  });
  const router = useRouter();
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const data = await getUserData(user.uid);
          if (data?.preferences) {
            setPreferences({
              newsletter: data.preferences.newsletter ?? false,
              marketing: data.preferences.marketing ?? false,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handlePreferenceChange = async (
    key: keyof typeof preferences,
    value: boolean
  ) => {
    if (!user?.uid) return;

    setPreferences((prev) => ({ ...prev, [key]: value }));

    try {
      setSaving(true);
      await updateUserPreferences(user.uid, { [key]: value });
    } catch (error) {
      console.error("Error updating preferences:", error);
      setPreferences((prev) => ({ ...prev, [key]: !value }));
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    try {
      await resetPassword(user.email);
      setResetEmailSent(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetEmailSent(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Failed to send reset email. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;
    {
      try {
        await deleteUser(user.uid);

        const authResponse = await fetch("/api/delete-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });

        if (!authResponse.ok) {
          throw new Error("Failed to delete Firebase Auth account");
        }

        await logout();
        router.push("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again or contact support.");
      }
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="text-white text-xl">You are not logged in</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-white">Loading...</span>
        </div>
      </div>
    );
  }

  const initials = getInitials(user?.displayName as string);
  const isEmailUser = isEmailPasswordUser(user as User);

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm lg:max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Reset Password
              </h2>
              <button
                className="text-gray-400 hover:text-white transition-colors hover:cursor-pointer"
                type="button"
                onClick={() => setShowResetPassword(false)}
              >
                <XMarkIcon className="size-6" />
              </button>
            </div>
            {resetEmailSent ? (
              <div className="text-center">
                <p className="text-green-400 mb-4">
                  Password reset email sent! Check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(false)}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-6">
                  We&apos;ll send a password reset link to your email address.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-sm lg:max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Delete account
              </h2>
              <button
                className="text-gray-400 hover:text-white transition-colors hover:cursor-pointer"
                type="button"
                onClick={() => setShowDeleteAccount(false)}
              >
                <XMarkIcon className="size-6" />
              </button>
            </div>
            <p className="text-gray-400 mb-6">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition-colors hover:cursor-pointer"
            >
              <TrashIcon className="size-4" />
              Delete my account
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
          Account Settings
        </h1>

        {/* Profile Information */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Profile Information
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            {/* Avatar - Show photo for Google users, initials for email users */}
            {user?.photoURL && !isEmailUser ? (
              <Image
                src={user.photoURL}
                alt="Profile picture"
                className="size-20 sm:size-24 rounded-full bg-gray-800 object-cover mx-auto sm:mx-0"
                width={96}
                height={96}
              />
            ) : (
              <div className="size-20 sm:size-24 rounded-full bg-indigo-600 flex items-center justify-center mx-auto sm:mx-0">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {initials}
                </span>
              </div>
            )}

            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-white">
                {isEmailUser ? "Email & Password Account" : "Google Account"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isEmailUser
                  ? "Your profile information is managed through your account settings."
                  : "To change your name, please update your Google account."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Display name
              </label>
              <input
                type="text"
                value={user?.displayName || ""}
                disabled
                className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full rounded-md bg-gray-800 px-3 py-2 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password Reset Section - Only for email/password users */}
          {isEmailUser && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <KeyIcon className="size-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Password</h3>
                    <p className="text-sm text-gray-400">
                      Reset your password via email
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Preferences
          </h2>
          <p className="text-gray-400 mb-6">
            Manage your notification and communication preferences.
          </p>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <EnvelopeIcon className="size-5 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <h3 className="text-sm font-medium text-white">Newsletter</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Receive updates about new products and features
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handlePreferenceChange("newsletter", !preferences.newsletter)
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start sm:self-center ${
                  preferences.newsletter ? "bg-indigo-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.newsletter ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <BellIcon className="size-5 text-gray-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Marketing emails
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Receive promotional emails and special offers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  handlePreferenceChange("marketing", !preferences.marketing)
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start sm:self-center ${
                  preferences.marketing ? "bg-indigo-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.marketing ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
            Delete account
          </h2>
          <p className="text-gray-400 mb-6">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => setShowDeleteAccount(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition-colors hover:cursor-pointer"
          >
            <TrashIcon className="size-4" />
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
