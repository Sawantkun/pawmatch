"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Filter, MoreVertical, 
  Trash2, Edit3, CheckCircle2, XCircle, 
  Clock, Heart, PawPrint, MessageCircle,
  TrendingUp, Users, Calendar, ArrowRight,
  ExternalLink, Home
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PETS, APPLICATIONS, CONVERSATIONS } from "@/data/mockData";
import { Pet, AdoptionApplication } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "pets" | "applications" | "saved">("overview");

  // Filter data based on user role
  const userApplications = useMemo(() => 
    user?.role === "shelter" 
      ? APPLICATIONS.filter(a => a.shelterId === user.id)
      : APPLICATIONS.filter(a => a.userId === user?.id),
    [user]
  );

  const shelterPets = useMemo(() => 
    PETS.filter(p => p.shelterId === user?.id),
    [user]
  );

  const savedPets = useMemo(() => 
    PETS.filter(p => user?.savedPets.includes(p.id)),
    [user]
  );

  if (!user) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2 className="title-lg">Access Denied</h2>
        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: 24 }}>Sign In</Link>
      </div>
    );
  }

  const isShelter = user.role === "shelter" || user.role === "admin";

  return (
    <div className="container" style={{ padding: "40px 0 80px" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 className="title-xl">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8 }}>
            {isShelter ? "Manage your rescue efforts and adoptions" : "Track your adoption journey and saved matches"}
          </p>
        </div>
        {isShelter && (
          <button className="btn btn-primary">
            <Plus size={18} />
            Post New Pet
          </button>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 32, borderBottom: "1px solid var(--color-border)", marginBottom: 32 }}>
        <button 
          onClick={() => setActiveTab("overview")}
          className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
          style={{ padding: "12px 4px", borderRadius: 0, borderBottom: activeTab === "overview" ? "2px solid var(--color-amber-500)" : "none", color: activeTab === "overview" ? "var(--color-text)" : "var(--color-text-muted)" }}
        >
          Overview
        </button>
        {isShelter && (
          <button 
            onClick={() => setActiveTab("pets")}
            className={`nav-link ${activeTab === "pets" ? "active" : ""}`}
            style={{ padding: "12px 4px", borderRadius: 0, borderBottom: activeTab === "pets" ? "2px solid var(--color-amber-500)" : "none", color: activeTab === "pets" ? "var(--color-text)" : "var(--color-text-muted)" }}
          >
            My Pets ({shelterPets.length})
          </button>
        )}
        <button 
          onClick={() => setActiveTab("applications")}
          className={`nav-link ${activeTab === "applications" ? "active" : ""}`}
          style={{ padding: "12px 4px", borderRadius: 0, borderBottom: activeTab === "applications" ? "2px solid var(--color-amber-500)" : "none", color: activeTab === "applications" ? "var(--color-text)" : "var(--color-text-muted)" }}
        >
          Applications ({userApplications.length})
        </button>
        {!isShelter && (
          <button 
            onClick={() => setActiveTab("saved")}
            className={`nav-link ${activeTab === "saved" ? "active" : ""}`}
            style={{ padding: "12px 4px", borderRadius: 0, borderBottom: activeTab === "saved" ? "2px solid var(--color-amber-500)" : "none", color: activeTab === "saved" ? "var(--color-text)" : "var(--color-text-muted)" }}
          >
            Saved Pets ({savedPets.length})
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: "var(--color-amber-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-amber-600)" }}>
                    <Calendar size={20} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "green", fontWeight: 700 }}>+12% this month</span>
                </div>
                <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{userApplications.length}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Total Applications</p>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, background: "var(--color-teal-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-teal-600)" }}>
                    <MessageCircle size={20} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-amber-600)", fontWeight: 700 }}>3 unread</span>
                </div>
                <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{CONVERSATIONS.length}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Active Chats</p>
              </div>
              {isShelter && (
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: "#f5f3ff", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                      <PawPrint size={20} />
                    </div>
                  </div>
                  <h4 style={{ fontSize: "2rem", fontWeight: 800 }}>{shelterPets.length}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Pets Listed</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 20, borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Recent Applications</h3>
                  <button onClick={() => setActiveTab("applications")} className="btn btn-ghost btn-sm">View All</button>
                </div>
                <div style={{ padding: 8 }}>
                  {userApplications.slice(0, 3).map((app, i) => (
                    <div key={app.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px", borderBottom: i < 2 ? "1px solid var(--color-border)" : "none" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                        {PETS.find(p => p.id === app.petId)?.species === "dog" ? "🐕" : "🐈"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{app.userName} applied for {app.petName}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Submitted {app.submittedAt}</p>
                      </div>
                      <span className={`badge ${app.status === "approved" ? "badge-green" : app.status === "rejected" ? "badge-red" : "badge-amber"}`} style={{ textTransform: "capitalize" }}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 24, background: "var(--color-amber-500)", color: "white", border: "none" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>Next Step: Matching</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: 24 }}>
                  Ensure your preferences are up to date! Our AI matching engine works best when it knows your latest lifestyle changes.
                </p>
                <Link href="/match" className="btn" style={{ background: "white", color: "var(--color-amber-700)", fontWeight: 700, width: "100%" }}>
                  Update Preferences
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {isShelter && activeTab === "pets" && (
          <motion.div key="pets" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead style={{ background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)" }}>
                  <tr>
                    <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Pet</th>
                    <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Status</th>
                    <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Gender/Age</th>
                    <th style={{ padding: "16px 24px", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shelterPets.map(pet => (
                    <tr key={pet.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={pet.photos[0]} style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", objectFit: "cover" }} />
                          <div>
                            <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{pet.name}</p>
                            <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>{pet.breed}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span className={`badge ${pet.status === "available" ? "badge-teal" : "badge-amber"}`} style={{ textTransform: "capitalize" }}>
                          {pet.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--color-text)" }}>{pet.gender}, {pet.ageLabel}</p>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}><Edit3 size={16} /></button>
                          <button className="btn btn-ghost btn-sm" style={{ padding: 8, color: "#ef4444" }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "applications" && (
          <motion.div key="apps" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              {userApplications.map(app => (
                <div key={app.id} className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div className="avatar" style={{ width: 60, height: 60, background: "var(--color-amber-100)", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {PETS.find(p => p.id === app.petId)?.species === "cat" ? "🐈" : "🐕"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <h3 className="title-lg" style={{ fontSize: "1.2rem", margin: 0 }}>Application for {app.petName}</h3>
                        <span className={`badge ${app.status === "approved" ? "badge-green" : app.status === "rejected" ? "badge-red" : "badge-amber"}`}>
                          {app.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: 12 }}>
                        Applied by <strong>{app.userName}</strong> on {app.submittedAt}
                      </p>
                      <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                          <Home size={14} /> {app.homeType}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                          <Users size={14} /> {app.hasChildren ? "Has kids" : "No kids"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: 10 }}>
                    {isShelter && app.status === "pending" && (
                      <>
                        <button className="btn btn-secondary btn-sm" style={{ color: "green", borderColor: "green" }}>
                          <CheckCircle2 size={16} /> Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" style={{ color: "red", borderColor: "red" }}>
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                    <Link href={`/chat?petId=${app.petId}`} className="btn btn-ghost btn-sm">
                      <MessageCircle size={16} /> Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "saved" && !isShelter && (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {savedPets.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                {savedPets.map(pet => (
                  <div key={pet.id} className="card">
                     <img src={pet.photos[0]} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
                     <div style={{ padding: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3 style={{ fontWeight: 700 }}>{pet.name}</h3>
                          <Link href={`/pets/${pet.id}`} className="btn btn-ghost btn-sm" style={{ padding: 4 }}><ExternalLink size={16} /></Link>
                        </div>
                        <button onClick={() => toast("Redirecting to adoption form...")} className="btn btn-primary btn-sm" style={{ width: "100%", marginTop: 16 }}>Apply Now</button>
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
    </div>
  );
}
