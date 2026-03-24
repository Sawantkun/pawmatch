"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success("Account created! Welcome to PawMatch 🐾");
      router.push("/match"); // Direct to matching questionnaire after signup
    } catch (err: any) {
      setError(err.message || "Signup failed");
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: 440 }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🐾</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Join PawMatch</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: 6, fontSize: "0.9rem" }}>
            Start your journey to find a forever best friend
          </p>
        </div>

        <div style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
          padding: "32px",
        }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                background: "#fee2e2",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                marginBottom: 20,
              }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: "0.82rem", color: "#991b1b", lineHeight: 1.4 }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label className="input-label">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: 40 }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">Password</label>
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
              <p style={{ marginTop: 8, fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                Must be at least 6 characters long
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
              {loading ? (
                <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <CheckCircle2 size={16} color="var(--color-teal-500)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Free for all adopters</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <CheckCircle2 size={16} color="var(--color-teal-500)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>Access to AI-powered matching</p>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--color-amber-600)", fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
