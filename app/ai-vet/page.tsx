"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, BookOpen, Activity, AlertTriangle, 
  Stethoscope, Thermometer, ShieldCheck, Info,
  Search, ChevronRight, MessageSquare, HeartPulse
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PETS } from "@/data/mockData";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: string;
  type?: "info" | "warning" | "success";
}

const SUGGESTED_TOPICS = [
  { id: "nutrition", label: "Nutrition & Diet", icon: BookOpen },
  { id: "symptoms", label: "Check Symptoms", icon: Stethoscope },
  { id: "vaccines", label: "Vaccination Info", icon: ShieldCheck },
  { id: "behavior", label: "Behavioral Help", icon: Activity },
];

export default function AIVetPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Hello! I'm your PawMatch AI Vet Assistant. How can I help you and your furry friend today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = "";
      const lowerText = text.toLowerCase();

      if (lowerText.includes("vomit") || lowerText.includes("sick")) {
        botResponse = "I'm sorry to hear your pet is feeling unwell. If they have vomited more than twice in 24 hours or seem lethargic, please contact a local emergency vet immediately. In the meantime, ensure they have access to fresh water and avoid feeding for 6-12 hours.";
      } else if (lowerText.includes("food") || lowerText.includes("eat") || lowerText.includes("diet")) {
        botResponse = "Proper nutrition is key! For dogs, high-quality protein should be the first ingredient. Avoid grapes, chocolate, and onions as they are toxic. Would you like me to recommend a diet based on your pet's breed?";
      } else if (lowerText.includes("scratch") || lowerText.includes("itch")) {
        botResponse = "Frequent scratching can be caused by allergies, fleas, or skin infections. Have you noticed any redness or hair loss? I recommend checking for flea dirt or consulting a vet for an allergy test.";
      } else {
        botResponse = "That's a great question. As an AI assistant, I can provide general health tips and triage advice. For specific medical diagnosis, I always recommend seeing a licensed veterinarian. Is there something specific about your pet's health you're worried about?";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: botResponse,
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (iso: string) => {
    if (!isMounted) return "--:--";
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container vet-page-container" style={{ height: "calc(100vh - 120px)", padding: "20px var(--container-px)", display: "flex", gap: 32 }}>
      
      {/* ── Left Side: Resources & Topics ── */}
      <div className="desktop-only" style={{ width: 320, display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="card" style={{ padding: 24, background: "var(--color-teal-600)", border: "none" }}>
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.2)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <HeartPulse size={24} color="white" />
          </div>
          <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 800 }}>AI Health Assistant</h3>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.5 }}>
            Get instant guidance on pet nutrition, symptoms, and behavior 24/7.
          </p>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: 16 }}>Quick Topics</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SUGGESTED_TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSend(`Tell me about ${topic.label}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-surface-2)",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--color-teal-50)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--color-surface-2)"}
                >
                  <Icon size={18} color="var(--color-teal-600)" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{topic.label}</span>
                  <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ padding: 20, background: "#fffbeb", border: "1px solid #fde68a" }}>
          <div style={{ display: "flex", gap: 10, color: "var(--color-amber-700)" }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.82rem", fontWeight: 700 }}>Medical Disclaimer</p>
              <p style={{ fontSize: "0.75rem", marginTop: 4, lineHeight: 1.4 }}>
                This AI is for informational purposes only and is NOT a substitute for professional veterinary advice. Always consult a vet for emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Chat Interface ── */}
      <div className="vet-chat-container" style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        
        {/* Chat Header */}
        <div className="vet-chat-header" style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "var(--color-teal-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-teal-600)" }}>
              <Bot size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Dr. PawMatch AI</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Online Assistant</span>
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
            <Info size={16} /> Help
          </button>
        </div>

        {/* Scrollable Messages */}
        <div className="vet-messages" style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.map((msg) => {
            const isBot = msg.role === "bot";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  alignSelf: isBot ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                  display: "flex",
                  gap: 12,
                  flexDirection: isBot ? "row" : "row-reverse"
                }}
              >
                {isBot && (
                  <div style={{ width: 32, height: 32, background: "var(--color-teal-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                    <Bot size={18} color="var(--color-teal-600)" />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "flex-start" : "flex-end" }}>
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: isBot ? "0 20px 20px 20px" : "20px 0 20px 20px",
                    background: isBot ? "var(--color-surface-2)" : "var(--color-teal-600)",
                    color: isBot ? "var(--color-text)" : "white",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                    boxShadow: isBot ? "none" : "0 4px 12px rgba(13, 148, 136, 0.2)"
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--color-text-light)", marginTop: 6, padding: "0 4px" }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {isTyping && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 32, height: 32, background: "var(--color-teal-100)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={18} color="var(--color-teal-600)" />
              </div>
              <div style={{ background: "var(--color-surface-2)", padding: "12px 16px", borderRadius: "0 20px 20px 20px", display: "flex", gap: 4 }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-text-muted)" }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-text-muted)" }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-text-muted)" }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Chat Input */}
        <div className="vet-input-area" style={{ padding: "16px 24px 24px", borderTop: "1px solid var(--color-border)" }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ display: "flex", gap: 12, background: "var(--color-surface-2)", padding: "8px 12px", borderRadius: "var(--radius-xl)", border: "1px solid transparent", transition: "all 0.2s" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--color-teal-500)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
          >
            <input
              type="text"
              className="input"
              placeholder="Describe symptoms or ask about pet health..."
              style={{ border: "none", background: "transparent", flex: 1, boxShadow: "none" }}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit" 
              className={`btn btn-primary btn-icon ${!inputText.trim() ? "btn-disabled" : ""}`}
              style={{ background: "var(--color-teal-600)", border: "none", width: 44, height: 44, borderRadius: "var(--radius-lg)" }}
              disabled={!inputText.trim() || isTyping}
            >
              <Send size={18} fill="white" strokeWidth={0} />
            </button>
          </form>
          <div className="vet-popular-topics" style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Popular:</span>
            <button onClick={() => setInputText("What human foods are toxic to dogs?")} style={{ fontSize: "0.75rem", color: "var(--color-teal-600)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Toxic foods</button>
            <button onClick={() => setInputText("How to tell if my cat has a fever?")} style={{ fontSize: "0.75rem", color: "var(--color-teal-600)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Fever signs</button>
            <button onClick={() => setInputText("New puppy vaccination schedule")} style={{ fontSize: "0.75rem", color: "var(--color-teal-600)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Vaccines</button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
