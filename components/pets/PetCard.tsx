"use client";
import { Pet } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Scale, Syringe, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  rabbit: "🐇",
  bird: "🦜",
  other: "🐾",
};

const SIZE_LABEL: Record<string, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  xlarge: "X-Large",
};

const STATUS_COLOR: Record<string, string> = {
  available: "badge-teal",
  pending: "badge-amber",
  adopted: "badge-gray",
};

interface PetCardProps {
  pet: Pet;
  index?: number;
  matchScore?: number;
  matchReason?: string;
}

export function PetCard({ pet, index = 0, matchScore, matchReason }: PetCardProps) {
  const { user, toggleSavePet } = useAuth();
  const isSaved = user?.savedPets?.includes(pet.id) ?? false;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to save pets 💛");
      return;
    }
    toggleSavePet(pet.id);
    toast.success(isSaved ? "Removed from saved" : "Saved! 🐾");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/pets/${pet.id}`} style={{ display: "block" }}>
        <div className="card" style={{ cursor: "pointer", position: "relative" }}>
          {/* Photo */}
          <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
            <img
              src={pet.photos[0]}
              alt={pet.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseOver={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseOut={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Status badge */}
            <div style={{ position: "absolute", top: 12, left: 12 }}>
              <span className={`badge ${STATUS_COLOR[pet.status]}`} style={{ textTransform: "capitalize" }}>
                {pet.status}
              </span>
            </div>
            {/* Save button */}
            <button
              onClick={handleSave}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)")}
              onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
            >
              <Heart
                size={16}
                fill={isSaved ? "var(--color-rose-500)" : "none"}
                color={isSaved ? "var(--color-rose-500)" : "var(--color-text-muted)"}
              />
            </button>
            {/* Match score overlay */}
            {matchScore !== undefined && (
              <div style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                borderRadius: "var(--radius-full)",
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--color-amber-600)" }}>
                  {matchScore}%
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>match</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {SPECIES_EMOJI[pet.species]} {pet.name}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: 2 }}>
                  {pet.breed}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-amber-600)" }}>
                  ${pet.adoptionFee}
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)" }}>adoption fee</p>
              </div>
            </div>

            {/* Quick info row */}
            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                <span>🎂</span>
                <span>{pet.ageLabel}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                <Scale size={12} />
                <span>{SIZE_LABEL[pet.size]}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
                <MapPin size={12} />
                <span>{pet.location.city}</span>
              </div>
            </div>

            {/* Traits */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              {pet.traits.slice(0, 3).map((t) => (
                <span key={t} className="tag" style={{ fontSize: "0.72rem", padding: "3px 8px", cursor: "default" }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Vaccinated / neutered chips */}
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              {pet.vaccinated && (
                <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.72rem", color: "var(--color-teal-600)" }}>
                  <Syringe size={11} />
                  <span>Vaccinated</span>
                </div>
              )}
              {pet.neutered && (
                <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.72rem", color: "var(--color-teal-600)" }}>
                  <CheckCircle size={11} />
                  <span>Neutered</span>
                </div>
              )}
            </div>

            {/* Match reason */}
            {matchReason && (
              <div style={{
                marginTop: 10,
                padding: "8px 10px",
                background: "var(--color-amber-50)",
                borderRadius: "var(--radius-sm)",
                borderLeft: "3px solid var(--color-amber-400)",
              }}>
                <p style={{ fontSize: "0.72rem", color: "var(--color-amber-700)", lineHeight: 1.4 }}>
                  ✨ {matchReason}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
