"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithRedirect,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createOrUpdateUser } from "@/lib/firestore/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<void>;
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
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("onAuthStateChanged triggered, user:", user?.email); // Debug
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
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error("Error saving user to Firestore:", error);
          setUser(user);
        }
      } else {
        setIsAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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

  // Google sign in
  const signInWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign in successful:", result.user.email);
      await createOrUpdateUser(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
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
    logout,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
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
