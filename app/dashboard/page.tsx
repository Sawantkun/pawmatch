"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MessageCircle, CheckCircle2, XCircle,
  Heart, PawPrint, Calendar, ArrowRight,
  ExternalLink, Home, Users, Trash2, Loader2, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getApplicationsByUser, getApplicationsByShelterId,
  getAllPets, getConversationsByUser, getConversationsByShelterId,
  updateApplicationStatus, deletePet, createPet,
} from "@/lib/firestore";
import { Pet, AdoptionApplication, Conversation } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";

// ─── Create Pet Modal ─────────────────────────────────────────────────────────

interface PetFormData {
  name: string; species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed: string; ageLabel: string; ageMonths: string; size: "small" | "medium" | "large" | "xlarge";
  gender: "male" | "female"; bio: string; photoUrl: string; adoptionFee: string;
  weight: string; color: string; city: string; state: string; traits: string;
  vaccinated: boolean; neutered: boolean; goodWithKids: boolean; goodWithPets: boolean;
}

const EMPTY_FORM: PetFormData = {
  name: "", species: "dog", breed: "", ageLabel: "", ageMonths: "",
  size: "medium", gender: "male", bio: "", photoUrl: "", adoptionFee: "",
  weight: "", color: "", city: "", state: "", traits: "",
  vaccinated: false, neutered: false, goodWithKids: false, goodWithPets: false,
};

function CreatePetModal({ onClose, onCreated, shelterId, shelterName }: {
  onClose: () => void; onCreated: (pet: Pet) => void;
  shelterId: string; shelterName: string;
}) {
  const [form, setForm] = useState<PetFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof PetFormData, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.breed || !form.city || !form.state) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const petData: Omit<Pet, "id"> = {
        name: form.name,
        species: form.species,
        breed: form.breed,
        age: parseInt(form.ageMonths) || 12,
        ageLabel: form.ageLabel || `${Math.round((parseInt(form.ageMonths) || 12) / 12)} year${(parseInt(form.ageMonths) || 12) >= 24 ? "s" : ""}`,
        size: form.size,
        gender: form.gender,
        photos: form.photoUrl ? [form.photoUrl] : [],
        bio: form.bio,
        traits: form.traits ? form.traits.split(",").map((t) => t.trim()).filter(Boolean) : [],
        medicalRecords: [],
        shelterId,
        shelterName,
        location: { lat: 0, lng: 0, city: form.city, state: form.state },
        status: "available",
        vaccinated: form.vaccinated,
        neutered: form.neutered,
        goodWithKids: form.goodWithKids,
        goodWithPets: form.goodWithPets,
        adoptionFee: parseFloat(form.adoptionFee) || 0,
        postedAt: new Date().toISOString().split("T")[0],
        color: form.color,
        weight: form.weight,
      };
      const id = await createPet(petData);
      toast.success(`${form.name} listed for adoption! 🐾`);
      onCreated({ id, ...petData });
    } catch {
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "var(--radius-md)",
    border: "1.5px solid var(--color-border)", background: "var(--color-surface-2)",
    fontSize: "0.9rem", color: "var(--color-text)", outline: "none",
    boxSizing: "border-box" as const,
  };
  const labelStyle = { fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 6, display: "block" };
  const checkRow = (label: string, field: keyof PetFormData) => (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.88rem" }}>
      <input type="checkbox" checked={!!form[field]} onChange={(e) => set(field, e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--color-amber-500)" }} />
      {label}
    </label>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-xl)" }}
      >
        {/* Header */}
        <div style={{ padding: "24px 32px 20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "var(--color-surface)", zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Post New Adoption Listing</h2>
            <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: 4 }}>Fill in the details below to list a pet for adoption</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16, color: "var(--color-amber-600)" }}>Basic Information</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Pet Name *</label>
                <input style={inputStyle} placeholder="e.g. Buddy" value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Breed *</label>
                <input style={inputStyle} placeholder="e.g. Golden Retriever" value={form.breed} onChange={(e) => set("breed", e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Species *</label>
                <select style={inputStyle} value={form.species} onChange={(e) => set("species", e.target.value as PetFormData["species"])}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="bird">Bird</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Gender *</label>
                <select style={inputStyle} value={form.gender} onChange={(e) => set("gender", e.target.value as PetFormData["gender"])}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Age (months) *</label>
                <input style={inputStyle} type="number" min="1" placeholder="e.g. 18" value={form.ageMonths} onChange={(e) => set("ageMonths", e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Age Label</label>
                <input style={inputStyle} placeholder="e.g. 1.5 years" value={form.ageLabel} onChange={(e) => set("ageLabel", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Size *</label>
                <select style={inputStyle} value={form.size} onChange={(e) => set("size", e.target.value as PetFormData["size"])}>
                  <option value="small">Small (&lt;20 lbs)</option>
                  <option value="medium">Medium (20–50 lbs)</option>
                  <option value="large">Large (50–90 lbs)</option>
                  <option value="xlarge">X-Large (&gt;90 lbs)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Adoption Fee ($)</label>
                <input style={inputStyle} type="number" min="0" placeholder="e.g. 150" value={form.adoptionFee} onChange={(e) => set("adoptionFee", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16, color: "var(--color-amber-600)" }}>Appearance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Color</label>
                <input style={inputStyle} placeholder="e.g. Golden" value={form.color} onChange={(e) => set("color", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Weight</label>
                <input style={inputStyle} placeholder="e.g. 65 lbs" value={form.weight} onChange={(e) => set("weight", e.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Photo URL</label>
                <input style={inputStyle} type="url" placeholder="https://..." value={form.photoUrl} onChange={(e) => set("photoUrl", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Bio & Traits */}
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16, color: "var(--color-amber-600)" }}>About the Pet</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Bio / Description *</label>
                <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} placeholder="Describe the pet's personality, habits, and what makes them special..." value={form.bio} onChange={(e) => set("bio", e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Personality Traits (comma-separated)</label>
                <input style={inputStyle} placeholder="e.g. Playful, Gentle, Energetic, Loyal" value={form.traits} onChange={(e) => set("traits", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16, color: "var(--color-amber-600)" }}>Location</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} placeholder="e.g. San Francisco" value={form.city} onChange={(e) => set("city", e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <input style={inputStyle} placeholder="e.g. CA" value={form.state} onChange={(e) => set("state", e.target.value)} required />
              </div>
            </div>
          </div>

          {/* Health & Compatibility */}
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 16, color: "var(--color-amber-600)" }}>Health & Compatibility</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {checkRow("Vaccinated", "vaccinated")}
              {checkRow("Neutered / Spayed", "neutered")}
              {checkRow("Good with Kids", "goodWithKids")}
              {checkRow("Good with Other Pets", "goodWithPets")}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--color-border)" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ minWidth: 140 }}>
              {saving ? <><Loader2 size={16} style={{ animation: "spin-slow 0.8s linear infinite" }} /> Posting...</> : <><Plus size={16} /> Post Listing</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "pets" | "applications" | "saved">("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [shelterPets, setShelterPets] = useState<Pet[]>([]);
  const [savedPets, setSavedPets] = useState<Pet[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const isShelter = user?.role === "shelter" || user?.role === "admin";

  const loadData = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      const [apps, convs, allPets] = await Promise.all([
        isShelter ? getApplicationsByShelterId(user.id) : getApplicationsByUser(user.id),
        isShelter ? getConversationsByShelterId(user.id) : getConversationsByUser(user.id),
        getAllPets(),
      ]);
      setApplications(apps);
      setConversations(convs);
      if (isShelter) {
        setShelterPets(allPets.filter((p) => p.shelterId === user.id));
      } else {
        setSavedPets(allPets.filter((p) => user.savedPets.includes(p.id)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleStatusUpdate = async (appId: string, status: AdoptionApplication["status"]) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
      toast.success(`Application ${status}`);
    } catch {
      toast.error("Failed to update application");
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await deletePet(petId);
      setShelterPets((prev) => prev.filter((p) => p.id !== petId));
      toast.success("Pet listing removed");
    } catch {
      toast.error("Failed to remove pet");
    }
  };

  const handlePetCreated = (pet: Pet) => {
    setShelterPets((prev) => [pet, ...prev]);
    setShowCreateModal(false);
    setActiveTab("pets");
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2 className="title-lg">Access Denied</h2>
        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: 24 }}>Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container dashboard-page" style={{ padding: "40px var(--container-px) 80px" }}>
      {showCreateModal && (
        <CreatePetModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handlePetCreated}
          shelterId={user.id}
          shelterName={user.name}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 className="title-xl">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8 }}>
            {isShelter ? "Manage your rescue efforts and adoptions" : "Track your adoption journey and saved matches"}
          </p>
        </div>
        {isShelter && (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus size={18} /> Post New Pet
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 32, borderBottom: "1px solid var(--color-border)", marginBottom: 32, overflowX: "auto" }}>
        {(["overview", ...(isShelter ? ["pets"] : []), "applications", ...(isShelter ? [] : ["saved"])] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`nav-link ${activeTab === tab ? "active" : ""}`}
            style={{
              padding: "12px 4px", borderRadius: 0, whiteSpace: "nowrap",
              borderBottom: activeTab === tab ? "2px solid var(--color-amber-500)" : "none",
              color: activeTab === tab ? "var(--color-text)" : "var(--color-text-muted)"
            }}
          >
            {tab === "overview" && "Overview"}
            {tab === "pets" && `My Pets (${shelterPets.length})`}
            {tab === "applications" && `Applications (${applications.length})`}
            {tab === "saved" && `Saved Pets (${savedPets.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Loader2 size={36} style={{ animation: "spin-slow 1s linear infinite", color: "var(--color-amber-500)" }} />
        </div>
      ) : (
        <AnimatePresence mode="wait">

          {/* Overview */}
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ width: 40, height: 40, background: "var(--color-amber-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-amber-600)", marginBottom: 16 }}>
                    <Calendar size={20} />
                  </div>
                  <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{applications.length}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Applications</p>
                </div>
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ width: 40, height: 40, background: "var(--color-teal-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-teal-600)", marginBottom: 16 }}>
                    <MessageCircle size={20} />
                  </div>
                  <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{conversations.length}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Active Chats</p>
                </div>
                {isShelter && (
                  <div className="card" style={{ padding: 24 }}>
                    <div style={{ width: 40, height: 40, background: "#f5f3ff", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6", marginBottom: 16 }}>
                      <PawPrint size={20} />
                    </div>
                    <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{shelterPets.length}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Pets Listed</p>
                  </div>
                )}
                {!isShelter && (
                  <div className="card" style={{ padding: 24 }}>
                    <div style={{ width: 40, height: 40, background: "#fdf2f8", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ec4899", marginBottom: 16 }}>
                      <Heart size={20} />
                    </div>
                    <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{savedPets.length}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Saved Pets</p>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
                <div className="card" style={{ padding: 0 }}>
                  <div style={{ padding: 20, borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Recent Applications</h3>
                    <button onClick={() => setActiveTab("applications")} className="btn btn-ghost btn-sm">View All</button>
                  </div>
                  <div style={{ padding: 8 }}>
                    {applications.length === 0 ? (
                      <p style={{ padding: 20, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>No applications yet.</p>
                    ) : (
                      applications.slice(0, 3).map((app, i) => (
                        <div key={app.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px", borderBottom: i < Math.min(applications.length, 3) - 1 ? "1px solid var(--color-border)" : "none" }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🐾</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{app.userName} → {app.petName}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{typeof app.submittedAt === "string" ? app.submittedAt.split("T")[0] : app.submittedAt}</p>
                          </div>
                          <span className={`badge ${app.status === "approved" ? "badge-green" : app.status === "rejected" ? "badge-red" : "badge-amber"}`} style={{ textTransform: "capitalize" }}>
                            {app.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="card" style={{ padding: 24, background: "var(--color-amber-500)", color: "white", border: "none" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>
                    {isShelter ? "List a New Pet" : "Find Your Match"}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: 24 }}>
                    {isShelter
                      ? "Post a new adoption listing and help a pet find their forever home."
                      : "Keep your preferences up to date so our AI finds your ideal companion."}
                  </p>
                  {isShelter ? (
                    <button onClick={() => setShowCreateModal(true)} className="btn" style={{ background: "white", color: "var(--color-amber-700)", fontWeight: 700, width: "100%" }}>
                      <Plus size={16} /> Post New Pet
                    </button>
                  ) : (
                    <Link href="/match" className="btn" style={{ background: "white", color: "var(--color-amber-700)", fontWeight: 700, width: "100%" }}>
                      Update Preferences <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Shelter Pets Tab */}
          {isShelter && activeTab === "pets" && (
            <motion.div key="pets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {shelterPets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px", background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)", border: "1.5px dashed var(--color-border)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>🐾</div>
                  <h3 className="title-lg">No pets listed yet</h3>
                  <p style={{ color: "var(--color-text-muted)", marginTop: 8, marginBottom: 24 }}>Start by posting your first adoption listing.</p>
                  <button onClick={() => setShowCreateModal(true)} className="btn btn-primary"><Plus size={16} /> Post Your First Pet</button>
                </div>
              ) : (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 600 }}>
                      <thead style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
                        <tr>
                          <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Pet</th>
                          <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Status</th>
                          <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Details</th>
                          <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shelterPets.map((pet) => (
                          <tr key={pet.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                            <td style={{ padding: "16px 24px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {pet.photos?.[0] ? (
                                  <img src={pet.photos[0]} style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🐾</div>
                                )}
                                <div>
                                  <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{pet.name}</p>
                                  <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{pet.breed}</p>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <span className={`badge ${pet.status === "available" ? "badge-teal" : "badge-amber"}`} style={{ textTransform: "capitalize" }}>{pet.status}</span>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <p style={{ fontSize: "0.85rem" }}>{pet.gender}, {pet.ageLabel}</p>
                              <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{pet.location?.city}, {pet.location?.state}</p>
                            </td>
                            <td style={{ padding: "16px 24px" }}>
                              <div style={{ display: "flex", gap: 8 }}>
                                <Link href={`/pets/${pet.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: "0.78rem" }}>View</Link>
                                <button onClick={() => handleDeletePet(pet.id)} className="btn btn-ghost btn-sm" style={{ padding: 8, color: "#ef4444" }}>
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <motion.div key="apps" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                {applications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ color: "var(--color-text-muted)" }}>No applications yet.</p>
                    {!isShelter && <Link href="/pets" className="btn btn-secondary" style={{ marginTop: 16 }}>Browse Pets</Link>}
                  </div>
                ) : (
                  applications.map((app) => (
                    <div key={app.id} className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ display: "flex", gap: 20 }}>
                        <div className="avatar" style={{ width: 56, height: 56, background: "var(--color-amber-100)", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>🐾</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Application for {app.petName}</h3>
                            <span className={`badge ${app.status === "approved" ? "badge-green" : app.status === "rejected" ? "badge-red" : app.status === "interview" ? "badge-teal" : "badge-amber"}`} style={{ textTransform: "capitalize" }}>{app.status}</span>
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: 12 }}>
                            By <strong>{app.userName}</strong> · {typeof app.submittedAt === "string" ? app.submittedAt.split("T")[0] : app.submittedAt}
                          </p>
                          <div style={{ display: "flex", gap: 16 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                              <Home size={13} /> {app.homeType}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                              <Users size={13} /> {app.hasChildren ? "Has kids" : "No kids"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        {isShelter && app.status === "pending" && (
                          <>
                            <button onClick={() => handleStatusUpdate(app.id, "approved")} className="btn btn-secondary btn-sm" style={{ color: "green", borderColor: "green" }}>
                              <CheckCircle2 size={15} /> Approve
                            </button>
                            <button onClick={() => handleStatusUpdate(app.id, "rejected")} className="btn btn-secondary btn-sm" style={{ color: "red", borderColor: "red" }}>
                              <XCircle size={15} /> Reject
                            </button>
                          </>
                        )}
                        <Link href={`/chat?petId=${app.petId}`} className="btn btn-ghost btn-sm">
                          <MessageCircle size={15} /> Chat
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Saved Pets Tab */}
          {activeTab === "saved" && !isShelter && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {savedPets.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                  {savedPets.map((pet) => (
                    <div key={pet.id} className="card">
                      {pet.photos?.[0] ? (
                        <img src={pet.photos[0]} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", aspectRatio: "16/9", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🐾</div>
                      )}
                      <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3 style={{ fontWeight: 700 }}>{pet.name}</h3>
                          <Link href={`/pets/${pet.id}`} className="btn btn-ghost btn-sm" style={{ padding: 4 }}><ExternalLink size={16} /></Link>
                        </div>
                        <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: 4 }}>{pet.breed} · {pet.ageLabel}</p>
                        <Link href={`/pets/${pet.id}`} className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: 16, display: "flex", justifyContent: "center" }}>View & Apply</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ color: "var(--color-text-muted)" }}>You haven't saved any pets yet.</p>
                  <Link href="/pets" className="btn btn-secondary" style={{ marginTop: 16 }}>Start Browsing</Link>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      )}
    </div>
  );
}
