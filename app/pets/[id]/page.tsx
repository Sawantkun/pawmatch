"use client";
import { use, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, MapPin, Scale, Syringe, CheckCircle, 
  MessageCircle, ArrowLeft, Calendar, User, 
  ChevronRight, ArrowRight, ShieldCheck, Download,
  ExternalLink, Phone, Mail, Info
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPetById, getShelterById } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamic import for Leaflet map to avoid SSR issues
const PetMap = dynamic(() => import("@/components/pets/PetMap"), { 
  ssr: false,
  loading: () => <div style={{ height: 300, background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)" }} />
});

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, toggleSavePet } = useAuth();
  
  const pet = useMemo(() => getPetById(id), [id]);
  const shelter = useMemo(() => pet ? getShelterById(pet.shelterId) : null, [pet]);
  
  const [activePhoto, setActivePhoto] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const isSaved = user?.savedPets?.includes(id) ?? false;

  if (!pet) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2 className="title-lg">Pet not found</h2>
        <Link href="/pets" className="btn btn-secondary" style={{ marginTop: 24 }}>
          Back to Browse
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    if (!user) {
      toast.error("Sign in to save pets 💛");
      return;
    }
    toggleSavePet(pet.id);
    toast.success(isSaved ? "Removed from saved" : "Saved! 🐾");
  };

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast.success("Application submitted! 🐾");
      router.push("/dashboard");
    }, 1500);
  };

  const startChat = () => {
    if (!user) {
      toast.error("Sign in to chat with shelters 💬");
      return;
    }
    router.push(`/chat?petId=${pet.id}`);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* ── Breadcrumbs & Actions ── */}
      <div className="container" style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/pets" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-muted)" }}>
          <ArrowLeft size={16} />
          Back to Browse
        </Link>
        <button 
          onClick={handleSave}
          className="btn btn-secondary btn-sm"
          style={{ gap: 8, padding: "8px 16px" }}
        >
          <Heart size={16} fill={isSaved ? "var(--color-rose-500)" : "none"} color={isSaved ? "var(--color-rose-500)" : "currentColor"} />
          {isSaved ? "Saved" : "Save Pet"}
        </button>
      </div>

      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "start" }}>
          
          {/* ── Left Column: Media & Bio ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Photo Gallery */}
            <div style={{ position: "relative" }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ aspectRatio: "4/3", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
              >
                <img 
                  src={pet.photos[activePhoto]} 
                  alt={pet.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </motion.div>
              
              {pet.photos.length > 1 && (
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  {pet.photos.map((url, i) => (
                    <button 
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      style={{ 
                        width: 80, height: 80, borderRadius: "var(--radius-md)", 
                        overflow: "hidden", border: activePhoto === i ? "2.5px solid var(--color-amber-500)" : "2px solid transparent",
                        padding: 0, cursor: "pointer", opacity: activePhoto === i ? 1 : 0.7,
                        transition: "all 0.2s ease"
                      }}
                    >
                      <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <h2 className="title-lg" style={{ marginBottom: 16 }}>About {pet.name}</h2>
              <p style={{ fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.8 }}>
                {pet.bio}
              </p>
              
              {/* Traits Tags */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {pet.traits.map(t => (
                  <span key={t} className="tag active" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Detailed Info Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="card" style={{ padding: 20, background: "var(--color-surface-2)", border: "none" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Physical Info</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Breed</span>
                    <span style={{ fontWeight: 600 }}>{pet.breed}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Weight</span>
                    <span style={{ fontWeight: 600 }}>{pet.weight}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Color</span>
                    <span style={{ fontWeight: 600 }}>{pet.color}</span>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 20, background: "var(--color-surface-2)", border: "none" }}>
                <h4 style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Lifestyle</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Kids</span>
                    <span style={{ fontWeight: 600 }}>{pet.goodWithKids ? "Good with kids" : "Unknown"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span style={{ color: "var(--color-text-muted)" }}>Other Pets</span>
                    <span style={{ fontWeight: 600 }}>{pet.goodWithPets ? "Friendly" : "Needs work"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Records */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--color-teal-50)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={20} color="var(--color-teal-600)" />
                </div>
                <h2 className="title-lg">Verified Medical History</h2>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {pet.medicalRecords.map((rec) => (
                  <div key={rec.id} className="card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <Calendar size={18} color="var(--color-text-light)" />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{rec.name}</p>
                        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{rec.date} • {rec.vet}</p>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Application & Shelter ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, position: "sticky", top: 100 }}>
            
            {/* Header Info */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className={`badge badge-teal`} style={{ fontSize: "0.85rem" }}>Available</span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Posted {pet.postedAt}</span>
              </div>
              <h1 className="title-display" style={{ fontSize: "3rem", marginBottom: 8 }}>{pet.name}</h1>
              <p style={{ fontSize: "1.2rem", color: "var(--color-text-muted)" }}>{pet.breed}</p>
              
              <div style={{ display: "flex", gap: 24, marginTop: 24, padding: "16px 0", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", textTransform: "uppercase", fontWeight: 700 }}>Age</p>
                  <p style={{ fontWeight: 700 }}>{pet.ageLabel}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", textTransform: "uppercase", fontWeight: 700 }}>Size</p>
                  <p style={{ fontWeight: 700 }}>{pet.size}</p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", textTransform: "uppercase", fontWeight: 700 }}>Gender</p>
                  <p style={{ fontWeight: 700 }}>{pet.gender}</p>
                </div>
              </div>
            </div>

            {/* Adoption Actions */}
            <div className="card" style={{ padding: 24, background: "var(--color-surface)", boxShadow: "var(--shadow-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>Adoption Fee</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-amber-600)" }}>${pet.adoptionFee}</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="btn btn-primary" 
                  style={{ width: "100%", height: 52, fontSize: "1rem" }}
                >
                  {isApplying ? "Submitting..." : `Apply to Adopt ${pet.name}`}
                </button>
                <button 
                  onClick={startChat}
                  className="btn btn-secondary" 
                  style={{ width: "100%", height: 52, fontSize: "1rem" }}
                >
                  <MessageCircle size={18} />
                  Message Shelter
                </button>
              </div>
              
              <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center", padding: "12px", background: "var(--color-amber-50)", borderRadius: "var(--radius-md)" }}>
                <Info size={16} color="var(--color-amber-600)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: "0.78rem", color: "var(--color-amber-700)", lineHeight: 1.4 }}>
                  Matching with this pet? <Link href="/match" style={{ textDecoration: "underline", fontWeight: 700 }}>Take the AI Match test</Link> to see how you both fit.
                </p>
              </div>
            </div>

            {/* Shelter Info & Map */}
            {shelter && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar" style={{ width: 44, height: 44, background: "var(--color-teal-50)", fontSize: "1.2rem", border: "1px solid var(--color-teal-100)" }}>
                    {shelter.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{shelter.name}</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Located in {shelter.city}, {shelter.state}</p>
                  </div>
                </div>

                <PetMap 
                  lat={shelter.location.lat} 
                  lng={shelter.location.lng} 
                  shelterName={shelter.name}
                  address={shelter.address}
                />

                <div className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <MapPin size={16} color="var(--color-text-light)" />
                    <span style={{ fontSize: "0.85rem" }}>{shelter.address}, {shelter.city}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <Phone size={16} color="var(--color-text-light)" />
                    <span style={{ fontSize: "0.85rem" }}>{shelter.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Mail size={16} color="var(--color-text-light)" />
                    <span style={{ fontSize: "0.85rem" }}>{shelter.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 968px) {
          div[style*="grid-template-columns: 1.2fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          div[style*="position: sticky"] {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
