"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const dummySession = localStorage.getItem("dummy_user");
    if (dummySession) {
      setUser(JSON.parse(dummySession));
      setLoading(false);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!localStorage.getItem("dummy_user")) {
        setUser(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Github login failed:", error);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    // Bypass Firebase completely for demo access
    const dummyUser = {
      uid: "dummy-" + Date.now(),
      email: email,
      displayName: email.split('@')[0],
      photoURL: null,
    } as unknown as User;
    
    localStorage.setItem("dummy_user", JSON.stringify(dummyUser));
    setUser(dummyUser);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      localStorage.removeItem("dummy_user");
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithGithub, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
