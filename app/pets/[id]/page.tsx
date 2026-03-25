"use client";
import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart, MapPin, Syringe, MessageCircle, ArrowLeft, Calendar,
  ChevronRight, ArrowRight, ShieldCheck, Download,
  Phone, Mail, Info, Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFirestorePetById, getFirestoreShelterById, createApplication } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { Pet, Shelter } from "@/types";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const PetMap = dynamic(() => import("@/components/pets/PetMap"), {
  ssr: false,
  loading: () => <div style={{ height: 300, background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)" }} />,
});

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, toggleSavePet } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  const isSaved = user?.savedPets?.includes(id) ?? false;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const petData = await getFirestorePetById(id);
        setPet(petData);
        if (petData?.shelterId) {
          const shelterData = await getFirestoreShelterById(petData.shelterId);
          setShelter(shelterData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "120px 0" }}>
        <Loader2 size={40} style={{ animation: "spin-slow 1s linear infinite", color: "var(--color-amber-500)" }} />
      </div>
    );
  }

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

  const handleApply = async () => {
    if (!user) {
      toast.error("Sign in to apply 💛");
      router.push("/auth/login");
      return;
    }
    setIsApplying(true);
    try {
      await createApplication({
        petId: pet.id,
        petName: pet.name,
        userId: user.id,
        userName: user.name,
        shelterId: pet.shelterId,
        status: "pending",
        submittedAt: new Date().toISOString().split("T")[0],
        homeType: user.preferences?.homeType || "unknown",
        hasChildren: false,
        hasOtherPets: false,
        experience: user.preferences?.experience || "none",
        motivation: "I would love to give this pet a forever home.",
      });
      toast.success("Application submitted! 🐾 Check your dashboard.");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to submit application. Please try again.");
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  const startChat = () => {
    if (!user) {
      toast.error("Sign in to chat with shelters 💬");
      router.push("/auth/login");
      return;
    }
    const params = new URLSearchParams({
      petId: pet.id,
      petName: pet.name,
      shelterId: pet.shelterId,
      shelterName: pet.shelterName,
    });
    router.push(`/chat?${params.toString()}`);
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Breadcrumbs */}
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

      <div className="container pet-detail-container">
        <div className="grid-layout" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "start" }}>

          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* Photo Gallery */}
            <div style={{ position: "relative" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ aspectRatio: "4/3", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
              >
                <img src={pet.photos[activePhoto]} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                        padding: 0, cursor: "pointer", opacity: activePhoto === i ? 1 : 0.7, transition: "all 0.2s ease"
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
              <p style={{ fontSize: "1rem", color: "var(--color-text)", lineHeight: 1.8 }}>{pet.bio}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                {pet.traits.map((t) => (
                  <span key={t} className="tag active" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Info Cards */}
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
                        <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{rec.date} · {rec.vet}</p>
                      </div>
                    </div>
                    <button className="btn btn-ghost btn-icon"><Download size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="pet-detail-sticky" style={{ display: "flex", flexDirection: "column", gap: 32, position: "sticky", top: 100 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span className={`badge ${pet.status === "available" ? "badge-teal" : "badge-amber"}`} style={{ fontSize: "0.85rem", textTransform: "capitalize" }}>{pet.status}</span>
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
                  disabled={isApplying || pet.status !== "available"}
                  className="btn btn-primary"
                  style={{ width: "100%", height: 52, fontSize: "1rem" }}
                >
                  {isApplying ? (
                    <><Loader2 size={18} style={{ animation: "spin-slow 0.8s linear infinite" }} /> Submitting...</>
                  ) : pet.status !== "available" ? (
                    "Not Available"
                  ) : (
                    `Apply to Adopt ${pet.name}`
                  )}
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
                  Want to check compatibility? <Link href="/match" style={{ textDecoration: "underline", fontWeight: 700 }}>Take the AI Match test</Link>.
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
                <PetMap lat={shelter.location.lat} lng={shelter.location.lng} shelterName={shelter.name} address={shelter.address} />
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

      {/* Mobile Floating Actions */}
      <div className="mobile-only mobile-actions-bar">
        <button onClick={handleApply} disabled={isApplying || pet.status !== "available"} className="btn btn-primary">
          {isApplying ? "..." : "Apply"}
        </button>
        <button onClick={startChat} className="btn btn-secondary">
          <MessageCircle size={18} />
        </button>
        <button onClick={handleSave} className="btn btn-secondary">
          <Heart size={18} fill={isSaved ? "var(--color-rose-500)" : "none"} color={isSaved ? "var(--color-rose-500)" : "currentColor"} />
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 968px) {
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 969px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
