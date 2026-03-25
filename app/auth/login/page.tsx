"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! 🐾");
      router.push("/pets");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const DEMO_NAMES: Record<string, string> = {
    "alex@demo.com": "Alex Rivera",
    "shelter@demo.com": "Sunny Paws Shelter",
    "admin@demo.com": "Admin User",
  };
  const DEMO_ROLES: Record<string, "adopter" | "shelter" | "admin"> = {
    "alex@demo.com": "adopter",
    "shelter@demo.com": "shelter",
    "admin@demo.com": "admin",
  };

  const demoLogin = async (demoEmail: string, label: string) => {
    setEmail(demoEmail);
    setPassword("demo123");
    setLoading(true);
    setError("");
    try {
      await login(demoEmail, "demo123");
      toast.success(`Signed in as ${label} 🐾`);
      router.push(label === "Shelter" ? "/dashboard" : "/pets");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Account doesn't exist yet — auto-create it
      if (msg.includes("user-not-found") || msg.includes("invalid-credential") || msg.includes("INVALID_LOGIN_CREDENTIALS") || msg.includes("auth/invalid-credential")) {
        try {
          await signup(
            DEMO_NAMES[demoEmail] || label,
            demoEmail,
            "demo123",
            DEMO_ROLES[demoEmail] || "adopter"
          );
          toast.success(`Demo account created! Signed in as ${label} 🐾`);
          router.push(label === "Shelter" ? "/dashboard" : "/pets");
        } catch (createErr) {
          setError(`Demo setup failed: ${createErr instanceof Error ? createErr.message : String(createErr)}`);
        }
      } else {
        setError(msg || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #fffbeb 0%, #faf9f7 60%, #f0fdfa 100%)",
      padding: "40px 24px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🐾</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Welcome back</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: 6, fontSize: "0.9rem" }}>
            Sign in to continue your adoption journey
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
          padding: "32px",
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  background: "#fee2e2",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  marginBottom: 20,
                }}
              >
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: "0.82rem", color: "#991b1b", lineHeight: 1.4 }}>{error}</p>
              </motion.div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
                <input
                  type="email"
                  className="input"
                  style={{ paddingLeft: 40 }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="input-label" style={{ margin: 0 }}>Password</label>
                <button type="button" style={{ fontSize: "0.78rem", color: "var(--color-amber-600)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
                <input
                  type={showPw ? "text" : "password"}
                  className="input"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-light)" }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? (
                <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ position: "relative", margin: "24px 0", textAlign: "center" }}>
            <div className="divider" style={{ position: "absolute", top: "50%", left: 0, right: 0, margin: 0 }} />
            <span style={{ position: "relative", background: "var(--color-surface)", padding: "0 12px", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              or try a demo account
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { email: "alex@demo.com", label: "Adopter", desc: "Browse pets & AI match" },
              { email: "shelter@demo.com", label: "Shelter", desc: "Manage pets & applications" },
              { email: "admin@demo.com", label: "Admin", desc: "Full platform access" },
            ].map(({ email: dEmail, label, desc }) => (
              <button
                key={dEmail}
                type="button"
                onClick={() => demoLogin(dEmail, label)}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-2)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-amber-400)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-amber-50)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface-2)";
                }}
              >
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text)" }}>{label} Demo</p>
                  <p style={{ fontSize: "0.74rem", color: "var(--color-text-muted)" }}>{dEmail} · {desc}</p>
                </div>
                <ArrowRight size={14} color="var(--color-text-muted)" />
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Don't have an account?{" "}
          <Link href="/auth/signup" style={{ color: "var(--color-amber-600)", fontWeight: 700 }}>
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
