"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser, createUserDoc, updateUserDoc, UserDoc } from "@/lib/firestore";

export type UserRole = "adopter" | "shelter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  savedPets: string[];
  preferences?: {
    lifestyle: string;
    homeType: string;
    activityLevel: string;
    experience: string;
    preferredSize: string;
    preferredAge: string;
    preferredSpecies: string;
    allergies: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  toggleSavePet: (petId: string) => void;
  updatePreferences: (prefs: User["preferences"]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo email → role mapping
function getRoleFromEmail(email: string): UserRole {
  if (email === "shelter@demo.com") return "shelter";
  if (email === "admin@demo.com") return "admin";
  return "adopter";
}

// Demo email → display name mapping
function getNameFromEmail(email: string): string {
  if (email === "alex@demo.com") return "Alex Rivera";
  if (email === "shelter@demo.com") return "Sunny Paws Shelter";
  if (email === "admin@demo.com") return "Admin User";
  return email.split("@")[0];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userData = await getUser(fbUser.uid);
          if (userData) {
            setUser(userData as User);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    let userData = await getUser(cred.user.uid);
    // Auto-create Firestore doc for demo accounts if missing
    if (!userData) {
      const newDoc: UserDoc = {
        id: cred.user.uid,
        name: getNameFromEmail(email),
        email,
        role: getRoleFromEmail(email),
        savedPets: [],
      };
      await createUserDoc(cred.user.uid, newDoc);
      userData = newDoc;
    }
    setUser(userData as User);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "adopter"
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const newDoc: UserDoc = {
      id: cred.user.uid,
      name,
      email,
      role,
      savedPets: [],
    };
    await createUserDoc(cred.user.uid, newDoc);
    setUser(newDoc as User);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const toggleSavePet = (petId: string) => {
    if (!user) return;
    const saved = user.savedPets.includes(petId)
      ? user.savedPets.filter((id) => id !== petId)
      : [...user.savedPets, petId];
    const updated = { ...user, savedPets: saved };
    setUser(updated);
    updateUserDoc(user.id, { savedPets: saved }).catch(console.error);
  };

  const updatePreferences = (prefs: User["preferences"]) => {
    if (!user) return;
    const updated = { ...user, preferences: prefs };
    setUser(updated);
    updateUserDoc(user.id, { preferences: prefs }).catch(console.error);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, toggleSavePet, updatePreferences }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
