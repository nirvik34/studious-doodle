"use client";

import {
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getFirebaseAuth } from "@/lib/firebase/client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signInWithYahoo: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Firebase is not configured. Please check your environment variables.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const auth = getFirebaseAuth();

    const checkAuth = () => {
      if (!auth) {
        throw new Error("Firebase authentication is not available. Please check your configuration.");
      }
      return auth;
    };

    return {
      user,
      loading,
      signInWithGoogle: async () => {
        const authInstance = checkAuth();
        await signInWithPopup(authInstance, new GoogleAuthProvider());
      },
      signInWithMicrosoft: async () => {
        const authInstance = checkAuth();
        await signInWithPopup(authInstance, new OAuthProvider("microsoft.com"));
      },
      signInWithYahoo: async () => {
        const authInstance = checkAuth();
        await signInWithPopup(authInstance, new OAuthProvider("yahoo.com"));
      },
      signInWithEmail: async (email, password) => {
        const authInstance = checkAuth();
        await signInWithEmailAndPassword(authInstance, email, password);
      },
      signUpWithEmail: async (name, email, password) => {
        const authInstance = checkAuth();
        const cred = await createUserWithEmailAndPassword(
          authInstance,
          email,
          password
        );
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      },
      signOut: async () => {
        const authInstance = checkAuth();
        await signOut(authInstance);
      },
    };
  }, [user, loading]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-red-900">Configuration Error</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="mt-4 text-xs text-gray-500">
            Please ensure your Firebase environment variables are set in <code className="rounded bg-gray-100 px-1">.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
