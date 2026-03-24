"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, MapPin, Shield, 
  Settings, Heart, Sparkles, Check,
  Home, Users, Zap, PawPrint, Dog,
  Cat, Rabbit, Bird, Trash2
} from "lucide-react";
import { useAuth, UserRole } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [prefs, setPrefs] = useState(user?.preferences || {
    lifestyle: "moderate",
    homeType: "house",
    activityLevel: "moderate",
    experience: "some",
    preferredSize: "medium",
    preferredAge: "adult",
    preferredSpecies: "dog",
    allergies: false
  });

  if (!user) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2 className="title-lg">Sign in to view your profile</h2>
        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: 24 }}>Sign In</Link>
      </div>
    );
  }

  const handleUpdatePrefs = () => {
    updatePreferences(prefs);
    setIsEditing(false);
    toast.success("Preferences updated! ✨");
  };

  return (
    <div className="container" style={{ padding: "40px 0 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }}>
        
        {/* ── Sidebar: User Info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div className="avatar" style={{ width: 100, height: 100, fontSize: "2.5rem", margin: "0 auto 20px", background: "var(--color-amber-100)", color: "var(--color-amber-700)" }}>
              {user.name[0].toUpperCase()}
            </div>
            <h2 className="title-lg" style={{ marginBottom: 4 }}>{user.name}</h2>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>{user.email}</p>
            <span className="badge badge-amber" style={{ textTransform: "capitalize" }}>{user.role}</span>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: 16, borderBottom: "1px solid var(--color-border)" }}>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>Quick Actions</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link href="/dashboard" className="nav-link" style={{ padding: "16px 20px", borderRadius: 0 }}>
                <Shield size={16} /> View Dashboard
              </Link>
              <Link href="/chat" className="nav-link" style={{ padding: "16px 20px", borderRadius: 0 }}>
                <Heart size={16} /> My Saved Pets
              </Link>
              <button 
                onClick={logout}
                style={{ textAlign: "left", width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.88rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}
              >
                <Trash2 size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Content: Preferences ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "var(--color-amber-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-amber-600)" }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="title-lg" style={{ margin: 0 }}>AI Matching Preferences</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Control how PawMatch finds your best companion</p>
                </div>
              </div>
              <button 
                onClick={() => isEditing ? handleUpdatePrefs() : setIsEditing(true)}
                className={`btn ${isEditing ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "8px 24px" }}
              >
                {isEditing ? "Save Changes" : "Edit Preferences"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label className="input-label" style={{ marginBottom: 12 }}>Lifestyle & Activity</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Active", "Moderate", "Calm"].map((l) => (
                      <button
                        key={l}
                        disabled={!isEditing}
                        onClick={() => setPrefs({ ...prefs, lifestyle: l.toLowerCase() })}
                        className={`tag ${prefs.lifestyle === l.toLowerCase() ? "active" : ""}`}
                        style={{ padding: "8px 16px", cursor: isEditing ? "pointer" : "default" }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label" style={{ marginBottom: 12 }}>Home Environment</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["House", "Apartment", "Rural"].map((h) => (
                      <button
                        key={h}
                        disabled={!isEditing}
                        onClick={() => setPrefs({ ...prefs, homeType: h.toLowerCase() })}
                        className={`tag ${prefs.homeType === h.toLowerCase() ? "active" : ""}`}
                        style={{ padding: "8px 16px", cursor: isEditing ? "pointer" : "default" }}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label className="input-label" style={{ marginBottom: 12 }}>Species Preferred</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Dog", "Cat", "Rabbit", "Bird"].map((s) => (
                      <button
                        key={s}
                        disabled={!isEditing}
                        onClick={() => setPrefs({ ...prefs, preferredSpecies: s.toLowerCase() })}
                        className={`tag ${prefs.preferredSpecies === s.toLowerCase() ? "active" : ""}`}
                        style={{ padding: "8px 16px", cursor: isEditing ? "pointer" : "default" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label" style={{ marginBottom: 12 }}>Experience Level</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["None", "Some", "Expert"].map((e) => (
                      <button
                        key={e}
                        disabled={!isEditing}
                        onClick={() => setPrefs({ ...prefs, experience: e.toLowerCase() })}
                        className={`tag ${prefs.experience === e.toLowerCase() ? "active" : ""}`}
                        style={{ padding: "8px 16px", cursor: isEditing ? "pointer" : "default" }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ marginTop: 32, padding: 20, background: "var(--color-amber-50)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-amber-100)" }}
              >
                <p style={{ fontSize: "0.85rem", color: "var(--color-amber-700)", lineHeight: 1.6 }}>
                  Our AI engine will retrain on your updated preferences to improve your future match results. This update may change your current ranked scores.
                </p>
              </motion.div>
            )}
          </div>

          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, background: "var(--color-teal-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-teal-600)" }}>
                <Settings size={20} />
              </div>
              <h3 className="title-lg" style={{ margin: 0 }}>Account Settings</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>Push Notifications</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Get real-time updates on adoption status and messages</p>
                </div>
                <div style={{ width: 48, height: 26, borderRadius: "var(--radius-full)", background: "var(--color-teal-500)", position: "relative", cursor: "pointer" }}>
                  <div style={{ position: "absolute", right: 2, top: 2, width: 22, height: 22, borderRadius: "50%", background: "white" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>Public Profile</p>
                  <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Allow shelters to view your preferences during applications</p>
                </div>
                <div style={{ width: 48, height: 26, borderRadius: "var(--radius-full)", background: "var(--color-surface-2)", position: "relative", cursor: "pointer" }}>
                  <div style={{ position: "absolute", left: 2, top: 2, width: 22, height: 22, borderRadius: "50%", background: "white", border: "1px solid var(--color-border)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
