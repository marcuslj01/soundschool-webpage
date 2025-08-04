"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  getIdTokenResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createOrUpdateUser } from "@/lib/firestore/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateUserInState: (updatedUser: User) => void;
  refreshUser: () => Promise<void>;
}

// Define AuthContext with correct type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to refresh user data
  const refreshUser = async () => {
    if (auth.currentUser) {
      // Force a token refresh to get updated user data
      await auth.currentUser.getIdToken(true);
      setUser({ ...auth.currentUser });
    }
  };

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          createOrUpdateUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await createOrUpdateUser(user);
          // Check admin status
          const adminStatus = await checkAdminStatus(user);
          setIsAdmin(adminStatus);

          // If user has no displayName, try to get it from Firestore
          if (!user.displayName) {
            console.log("User has no displayName, attempting to refresh...");
            // Force a token refresh to get updated user data
            await user.getIdToken(true);
            // Update user state with refreshed data
            setUser({ ...user });
          }
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
        }
      } else {
        setIsAdmin(false);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      // Check if we're on mobile or Safari (which has stricter popup blocking)
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      const isSafari =
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent);

      // Use redirect for mobile OR Safari (to avoid popup blocking issues)
      if (isMobile || isSafari) {
        console.log("Using signInWithRedirect (mobile or Safari detected)");
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.log("Using signInWithPopup (desktop Chrome/Firefox)");
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);

      // Handle specific errors
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "auth/popup-closed-by-user") {
          console.log("User closed the popup window");
          return;
        }
        if (error.code === "auth/unauthorized-domain") {
          console.error("Domain not authorized for Firebase Auth");
          return;
        }
        if (error.code === "auth/popup-blocked") {
          console.error(
            "Popup blocked by browser - this should not happen with redirect"
          );
          return;
        }
      }
    }
  };

  // Email and password sign in
  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await createOrUpdateUser(result.user);
  };

  // Email and password sign up
  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createOrUpdateUser(result.user);
    return result;
  };

  // Update user in state
  const updateUserInState = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Email and password reset password
  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const checkAdminStatus = async (user: User) => {
    try {
      const tokenResult = await getIdTokenResult(user);
      return tokenResult.claims?.admin === true;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    signInWithGoogle,
    logout,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    updateUserInState,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
