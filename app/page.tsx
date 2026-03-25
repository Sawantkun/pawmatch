"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Shield, MessageCircle, MapPin, Heart, Zap } from "lucide-react";
import { getAllPets } from "@/lib/firestore";
import { PetCard } from "@/components/pets/PetCard";
import { Pet } from "@/types";

const STATS = [
  { value: "2,400+", label: "Pets Adopted" },
  { value: "180+", label: "Partner Shelters" },
  { value: "98%", label: "Match Satisfaction" },
  { value: "24/7", label: "Support Available" },
];

const FEATURES = [
  {
    icon: Sparkles,
    color: "var(--color-amber-500)",
    bg: "var(--color-amber-50)",
    title: "AI-Powered Matching",
    desc: "Our Gemini AI analyzes your lifestyle, preferences, and personality to surface the pets most likely to become your forever best friend.",
  },
  {
    icon: MessageCircle,
    color: "var(--color-teal-500)",
    bg: "var(--color-teal-50)",
    title: "Real-Time Chat",
    desc: "Talk directly with shelter staff, ask questions, schedule visits, and get updates — all in one seamless conversation thread.",
  },
  {
    icon: Shield,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    title: "Verified & Safe",
    desc: "Every shelter is verified, every pet's health records are reviewed. Adopt with full confidence and complete peace of mind.",
  },
  {
    icon: MapPin,
    color: "var(--color-rose-500)",
    bg: "#fff1f2",
    title: "GPS Pet Locations",
    desc: "Browse pets by proximity on live maps. Find your companion nearby and plan a visit to the shelter with accurate directions.",
  },
  {
    icon: Heart,
    color: "var(--color-rose-400)",
    bg: "#fff1f2",
    title: "Save Favorites",
    desc: "Bookmark pets you love and revisit anytime. Compare your saved matches and share with your family before making the big decision.",
  },
  {
    icon: Zap,
    color: "var(--color-amber-600)",
    bg: "var(--color-amber-50)",
    title: "Instant Applications",
    desc: "Submit adoption applications directly through PawMatch. Track status updates in real-time from pending to approved.",
  },
];

const TESTIMONIALS = [
  {
    quote: "PawMatch's AI suggested Max, a Border Collie mix — I'd never considered one, but it was a perfect fit. Best decision of my life.",
    name: "Jamie L.",
    role: "Adopted Max • San Francisco",
    avatar: "J",
  },
  {
    quote: "The real-time chat with the shelter was so smooth. I had all my questions answered before I even visited. Absolutely seamless.",
    name: "Priya S.",
    role: "Adopted Luna • Los Angeles",
    avatar: "P",
  },
  {
    quote: "I found Rosie in 20 minutes through the GPS filter. Two weeks later she was home. PawMatch made it effortless.",
    name: "Marcus W.",
    role: "Adopted Rosie • Austin",
    avatar: "M",
  },
];

function FadeUp({ children, delay = 0, className = "", style = {} }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);

  useEffect(() => {
    getAllPets()
      .then((pets) => setFeaturedPets(pets.filter((p) => p.status === "available").slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #fffbeb 0%, #faf9f7 40%, #f0fdfa 100%)",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--color-amber-100)", borderRadius: "var(--radius-full)", marginBottom: 24 }}
            >
              <Sparkles size={14} color="var(--color-amber-600)" />
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-amber-700)", letterSpacing: "0.04em" }}>AI-POWERED PET MATCHING</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="title-display"
              style={{ marginBottom: 20 }}
            >
              Find your{" "}
              <span className="gradient-text">perfect</span>
              <br />
              companion.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontSize: "1.1rem", color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}
            >
              PawMatch uses AI to connect you with pets that truly fit your life — not just ones that look cute. Every adoption story starts with the right match.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link href="/match" className="btn btn-primary btn-lg">
                <Sparkles size={18} />
                Find My Match
                <ArrowRight size={18} />
              </Link>
              <Link href="/pets" className="btn btn-secondary btn-lg">
                Browse All Pets
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-text)" }}>{value}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual — floating pet cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 600 }}
            className="hero-visual"
          >
            {/* Main card */}
            <div style={{ position: "relative", zIndex: 2, maxWidth: 520, width: "100%" }}>
              <div className="card" style={{ overflow: "visible", transform: "rotate(-1deg)" }}>
                {featuredPets[0]?.photos?.[0] ? (
                  <img src={featuredPets[0].photos[0]} alt={featuredPets[0].name} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "4/3", background: "var(--color-amber-50)", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🐾</div>
                )}
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontWeight: 700 }}>🐕 {featuredPets[0]?.name ?? "Find your pet"}</h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{featuredPets[0]?.breed ?? "Browse available pets"}</p>
                    </div>
                    <span className="badge badge-teal">Available</span>
                  </div>
                </div>
              </div>

              {/* Floating match badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  padding: "10px 14px",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  zIndex: 5,
                  whiteSpace: "nowrap",
                }}
              >
                <Sparkles size={16} color="var(--color-amber-500)" />
                <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>96% Match!</span>
              </motion.div>

              {/* Floating chat badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: -24,
                  background: "var(--color-teal-500)",
                  borderRadius: "var(--radius-lg)",
                  padding: "10px 14px",
                  boxShadow: "var(--shadow-xl)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  zIndex: 5,
                  whiteSpace: "nowrap",
                }}
              >
                <MessageCircle size={16} color="white" />
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "white" }}>Chat with shelter</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 968px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center; padding-top: 40px; }
            .hero-visual { min-height: 400px !important; margin-top: 20px; }
            .hero-visual > div { max-width: 320px !important; }
            section[style*="minHeight: 90vh"] { min-height: auto !important; padding-bottom: 60px; }
            div[style*="maxWidth: 480"] { margin: 0 auto; }
            div[style*="justifyContent: center"] { justify-content: center; }
          }
        `}</style>
      </section>

      {/* ── Featured Pets ── */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <FadeUp>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-amber-600)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                  Recently Added
                </p>
                <h2 className="title-xl">Meet your new best friends</h2>
              </div>
              <Link href="/pets" className="btn btn-secondary btn-sm">
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {featuredPets.map((pet, i) => (
              <PetCard key={pet.id} pet={pet} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" style={{ background: "var(--color-surface-2)" }}>
        <div className="container">
          <FadeUp style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-teal-600)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Why PawMatch
            </p>
            <h2 className="title-xl" style={{ maxWidth: 500, margin: "0 auto" }}>
              Adoption reimagined for the modern world
            </h2>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.07}>
                <div className="card" style={{ padding: 28 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section">
        <div className="container">
          <FadeUp style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="title-xl">Three steps to forever love</h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40, maxWidth: 900, margin: "0 auto" }}>
            {[
              { step: "01", title: "Tell us about you", desc: "Answer a short questionnaire about your lifestyle, home, and preferences. Takes less than 2 minutes." },
              { step: "02", title: "See your matches", desc: "Our AI ranks every available pet by compatibility. Read match reasons and browse at your own pace." },
              { step: "03", title: "Meet & adopt", desc: "Chat with the shelter, schedule a visit, and submit your application — all without leaving PawMatch." },
            ].map(({ step, title, desc }, i) => (
              <FadeUp key={step} delay={i * 0.1}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-amber-200)", letterSpacing: "-0.04em", marginBottom: 12 }}>{step}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.65 }}>{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/match" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              Start My AI Match
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section" style={{ background: "var(--color-surface-2)" }}>
        <div className="container">
          <FadeUp style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="title-xl">Happy tails. Real stories.</h2>
          </FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map(({ quote, name, role, avatar }, i) => (
              <FadeUp key={name} delay={i * 0.08}>
                <div className="card" style={{ padding: 28 }}>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>
                    "{quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 40, height: 40, background: "var(--color-amber-100)", color: "var(--color-amber-700)", fontWeight: 800 }}>
                      {avatar}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>{name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: "linear-gradient(135deg, var(--color-amber-500), var(--color-amber-600))", padding: "80px 0" }}>
        <FadeUp>
          <div className="container" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "3rem", marginBottom: 16 }}>🐾</p>
            <h2 className="title-xl" style={{ color: "white", marginBottom: 16, maxWidth: 480, margin: "0 auto 16px" }}>
              Your forever companion is waiting
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: 36 }}>
              Join 50,000+ families who found their perfect match on PawMatch.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/auth/signup" className="btn" style={{ background: "white", color: "var(--color-amber-700)", fontWeight: 700 }}>
                Create Free Account
              </Link>
              <Link href="/pets" className="btn" style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.6)", color: "white" }}>
                Browse Pets
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--color-text)", color: "rgba(255,255,255,0.7)", padding: "48px 0 32px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "white", marginBottom: 12 }}>🐾 PawMatch</div>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.7, maxWidth: 280 }}>
                AI-powered pet adoption platform connecting animals with loving families since 2024.
              </p>
            </div>
            {[
              { title: "Platform", links: ["Browse Pets", "AI Matching", "Chat", "Dashboard"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "For Shelters", "Privacy", "Terms"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontWeight: 700, color: "white", fontSize: "0.85rem", marginBottom: 12 }}>{title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {links.map((l) => (
                    <span key={l} style={{ fontSize: "0.8rem", cursor: "pointer", transition: "color 0.15s" }}
                      onMouseOver={(e) => ((e.target as HTMLElement).style.color = "white")}
                      onMouseOut={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
                    >{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: "0.78rem" }}>© 2026 PawMatch. All rights reserved.</p>
            <p style={{ fontSize: "0.78rem" }}>Made with 🐾 for animals everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
