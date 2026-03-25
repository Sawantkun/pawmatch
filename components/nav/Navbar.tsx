"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, LayoutDashboard, Search, Menu, X, LogOut, User, Sparkles, Stethoscope } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getConversationsByUser, getConversationsByShelterId } from "@/lib/firestore";

const NAV_ITEMS = [
  { href: "/pets", label: "Browse", icon: Search },
  { href: "/match", label: "AI Match", icon: Sparkles },
  { href: "/ai-vet", label: "AI Vet", icon: Stethoscope },
  { href: "/chat", label: "Messages", icon: MessageCircle, badge: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user) { setTotalUnread(0); return; }
    const fetch = user.role === "shelter"
      ? getConversationsByShelterId(user.id)
      : getConversationsByUser(user.id);
    fetch.then((convs) => setTotalUnread(convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0))).catch(() => {});
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setProfileOpen(false);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(250, 249, 247, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", height: 64, gap: 16 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "var(--color-text)", flexShrink: 0 }}>
          <span style={{ fontSize: "1.4rem" }}>🐾</span>
          <span>Paw<span className="gradient-text">Match</span></span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }} className="desktop-nav">
          {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname?.startsWith(href) ? "active" : ""}`}
              style={{ position: "relative" }}
            >
              <Icon size={15} />
              {label}
              {badge && totalUnread > 0 && (
                <span style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 16,
                  height: 16,
                  background: "var(--color-amber-500)",
                  borderRadius: "50%",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {totalUnread}
                </span>
              )}
            </Link>
          ))}

          {user?.role === "shelter" || user?.role === "admin" ? (
            <Link href="/dashboard" className={`nav-link ${pathname?.startsWith("/dashboard") ? "active" : ""}`}>
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
          ) : null}

          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface)",
                  border: "1.5px solid var(--color-border)",
                  cursor: "pointer",
                  marginLeft: 8,
                  transition: "all 0.2s ease",
                }}
              >
                <div className="avatar" style={{ width: 28, height: 28, background: "var(--color-amber-100)", color: "var(--color-amber-700)", fontSize: "0.75rem" }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text)" }}>{user.name.split(" ")[0]}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-xl)",
                      minWidth: 200,
                      overflow: "hidden",
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: "16px", borderBottom: "1px solid var(--color-border)" }}>
                      <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{user.name}</p>
                      <p style={{ fontSize: "0.78rem", color: "var(--color-text-muted)", marginTop: 2 }}>{user.email}</p>
                      <span className={`badge badge-amber`} style={{ marginTop: 6, display: "inline-flex" }}>{user.role}</span>
                    </div>
                    <div style={{ padding: 8 }}>
                      <Link href="/profile" onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)", transition: "background 0.15s", cursor: "pointer" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <User size={15} />
                        Profile & Preferences
                      </Link>
                      <Link href="/profile?tab=saved" onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text)", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--color-surface-2)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <Heart size={15} />
                        Saved Pets
                      </Link>
                      <div style={{ height: 1, background: "var(--color-border)", margin: "8px 0" }} />
                      <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: "var(--radius-md)", fontSize: "0.85rem", fontWeight: 500, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/auth/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ marginLeft: "auto", display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)", overflow: "hidden" }}
          >
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={`nav-link ${pathname?.startsWith(href) ? "active" : ""}`} onClick={() => setMobileOpen(false)}
                  style={{ justifyContent: "flex-start" }}>
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
              {(user?.role === "shelter" || user?.role === "admin") && (
                <Link href="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
              )}
              <div style={{ height: 1, background: "var(--color-border)", margin: "8px 0" }} />
              {user ? (
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ justifyContent: "flex-start" }}>
                  <LogOut size={15} />
                  Sign Out
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <Link href="/auth/login" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: "center" }}>Sign In</Link>
                  <Link href="/auth/signup" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)} style={{ flex: 1, justifyContent: "center" }}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
