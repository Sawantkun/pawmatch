"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

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
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  toggleSavePet: (petId: string) => void;
  updatePreferences: (prefs: User["preferences"]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock demo users
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Alex Rivera",
    email: "alex@demo.com",
    role: "adopter",
    savedPets: ["pet-3"],
    preferences: {
      lifestyle: "active",
      homeType: "house",
      activityLevel: "high",
      experience: "some",
      preferredSize: "medium",
      preferredAge: "adult",
      preferredSpecies: "dog",
      allergies: false,
    },
  },
  {
    id: "shelter-1",
    name: "Sunny Paws Shelter",
    email: "shelter@demo.com",
    role: "shelter",
    savedPets: [],
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@demo.com",
    role: "admin",
    savedPets: [],
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem("pawmatch_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!found) {
      setIsLoading(false);
      throw new Error("Invalid email or password. Try alex@demo.com, shelter@demo.com, or admin@demo.com");
    }
    setUser(found);
    localStorage.setItem("pawmatch_user", JSON.stringify(found));
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: "adopter",
      savedPets: [],
    };
    setUser(newUser);
    localStorage.setItem("pawmatch_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pawmatch_user");
  };

  const toggleSavePet = (petId: string) => {
    if (!user) return;
    const saved = user.savedPets.includes(petId)
      ? user.savedPets.filter((id) => id !== petId)
      : [...user.savedPets, petId];
    const updated = { ...user, savedPets: saved };
    setUser(updated);
    localStorage.setItem("pawmatch_user", JSON.stringify(updated));
  };

  const updatePreferences = (prefs: User["preferences"]) => {
    if (!user) return;
    const updated = { ...user, preferences: prefs };
    setUser(updated);
    localStorage.setItem("pawmatch_user", JSON.stringify(updated));
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
