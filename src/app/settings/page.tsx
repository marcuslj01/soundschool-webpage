"use client";

import { useState, useEffect } from "react";
import { EnvelopeIcon, BellIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserData,
  updateUserPreferences,
  deleteUser,
} from "@/lib/firestore/user";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    newsletter: false,
    marketing: false,
  });
  const router = useRouter();

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

  const handleDeleteAccount = async () => {
    if (!user?.uid) return;

    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
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

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

        {/* Profile Information */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Profile Information
          </h2>
          <p className="text-gray-400 mb-6">
            Your profile information is managed by your Google account.
          </p>

          <div className="flex items-center gap-6 mb-6">
            <Image
              width={96}
              height={96}
              alt="Profile picture"
              src={
                user?.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              className="size-24 rounded-full bg-gray-800 object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">
                Profile managed by Google
              </p>
              <p className="text-sm text-gray-400">
                To change your profile picture or name, please update your
                Google account.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Preferences */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
          <p className="text-gray-400 mb-6">
            Manage your notification and communication preferences.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="size-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-white">Newsletter</h3>
                  <p className="text-sm text-gray-400">
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
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellIcon className="size-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Marketing emails
                  </h3>
                  <p className="text-sm text-gray-400">
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
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
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
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Delete account
          </h2>
          <p className="text-gray-400 mb-6">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 transition-colors"
          >
            <TrashIcon className="size-4" />
            Delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
