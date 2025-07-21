"use client";

import { useAuth } from "@/contexts/AuthContext";

export function LoginButton() {
  const { user, signInWithGoogle, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Hei, {user.displayName}!</span>
        <button onClick={logout}>Logg ut</button>
      </div>
    );
  }

  return <button onClick={signInWithGoogle}>Logg inn med Google</button>;
}
