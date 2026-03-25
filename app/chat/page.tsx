"use client";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Send, Search, MoreVertical, Phone, Video,
  Image as ImageIcon, Smile, Paperclip,
  CheckCheck, ChevronLeft, PawPrint, ArrowRight,
  MessageCircle, Loader2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getConversationsByUser, getConversationsByShelterId,
  getConversationByPetAndUser, createConversation,
  subscribeToMessages, sendMessage, getAllShelters, getAllPets,
} from "@/lib/firestore";
import { Conversation, ChatMessage, Pet, Shelter } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const petIdParam = searchParams.get("petId");
  const petNameParam = searchParams.get("petName") || "";
  const shelterIdParam = searchParams.get("shelterId") || "";
  const shelterNameParam = searchParams.get("shelterName") || "";

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isMobileList, setIsMobileList] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [petPhotoMap, setPetPhotoMap] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const handledPetIdRef = useRef<string | null>(null);

  useEffect(() => { setIsMounted(true); }, []);

  // Load shelters and pet photos for avatars
  useEffect(() => {
    getAllShelters().then(setShelters).catch(() => {});
    getAllPets().then((pets) => {
      const map: Record<string, string> = {};
      for (const pet of pets) {
        if (pet.photos?.[0]) map[pet.id] = pet.photos[0];
      }
      setPetPhotoMap(map);
    }).catch(() => {});
  }, []);

  // Load conversations
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchConvs = async () => {
      setLoading(true);
      try {
        let loaded: Conversation[] = [];
        if (user.role === "shelter") {
          loaded = await getConversationsByShelterId(user.id);
        } else {
          loaded = await getConversationsByUser(user.id);
        }
        setConvs(loaded);
        if (!petIdParam && loaded.length > 0) {
          setActiveConvId(loaded[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
  }, [user]);

  // Handle petId param — open or create conversation (runs only once per petId)
  useEffect(() => {
    if (!petIdParam || !user || loading) return;
    if (handledPetIdRef.current === petIdParam) return;
    handledPetIdRef.current = petIdParam;

    const setupConv = async () => {
      // Check local state first
      const existing = convs.find((c) => c.petId === petIdParam);
      if (existing) {
        setActiveConvId(existing.id);
        setIsMobileList(false);
        return;
      }
      // Check Firestore for existing conv
      const firestoreConv = await getConversationByPetAndUser(petIdParam, user.id);
      if (firestoreConv) {
        setConvs((prev) => [firestoreConv, ...prev.filter((c) => c.id !== firestoreConv.id)]);
        setActiveConvId(firestoreConv.id);
        setIsMobileList(false);
        return;
      }
      // Create new conversation
      try {
        const newConvData: Omit<Conversation, "id"> = {
          userId: user.id,
          userName: user.name,
          shelterId: shelterIdParam,
          shelterName: shelterNameParam,
          petId: petIdParam,
          petName: petNameParam,
          lastMessage: "Conversation started",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
        };
        const convId = await createConversation(newConvData);
        const newConv: Conversation = { id: convId, ...newConvData };
        setConvs((prev) => [newConv, ...prev]);
        setActiveConvId(convId);
        setIsMobileList(false);
      } catch (err) {
        console.error(err);
      }
    };
    setupConv();
  }, [petIdParam, shelterIdParam, shelterNameParam, petNameParam, user, loading]);

  // Subscribe to messages for active conversation
  useEffect(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
    if (!activeConvId) return;
    const unsub = subscribeToMessages(activeConvId, (msgs) => {
      setMessages(msgs);
    });
    unsubRef.current = unsub;
    return () => { unsub(); };
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = useMemo(() => convs.find((c) => c.id === activeConvId), [activeConvId, convs]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !user) return;

    const msg: Omit<ChatMessage, "id"> = {
      conversationId: activeConvId,
      senderId: user.id,
      senderName: user.name,
      text: inputText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const text = inputText;
    setInputText("");

    try {
      await sendMessage(activeConvId, msg);
      // Update local conv list for immediate feedback
      setConvs((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: text, lastMessageTime: msg.timestamp }
            : c
        )
      );
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
      setInputText(text);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isMounted) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getShelterAvatar = (shelterId: string) => {
    return shelters.find((s) => s.id === shelterId)?.avatar || "🐾";
  };

  const ConvAvatar = ({ conv, size = 48 }: { conv: Conversation; size?: number }) => {
    const photo = conv.petId ? petPhotoMap[conv.petId] : null;
    if (photo) {
      return (
        <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid var(--color-border)" }}>
          <img src={photo} alt={conv.petName || "pet"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      );
    }
    return (
      <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.25, flexShrink: 0 }}>
        {getShelterAvatar(conv.shelterId)}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2 className="title-lg">Sign in to view your messages</h2>
        <Link href="/auth/login" className="btn btn-primary" style={{ marginTop: 24 }}>Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ height: "calc(100vh - 100px)", padding: "20px 0", display: "flex", gap: 20 }}>

      {/* Inbox Sidebar */}
      <div className={`chat-sidebar ${!isMobileList ? "mobile-hidden" : ""}`} style={{
        width: 380, background: "var(--color-surface)", borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        <div style={{ padding: 24, borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="title-lg" style={{ fontSize: "1.4rem", marginBottom: 16 }}>Messages</h2>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
            <input type="text" className="input" placeholder="Search conversations..."
              style={{ paddingLeft: 36, borderRadius: "var(--radius-full)", background: "var(--color-surface-2)", border: "none" }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <Loader2 size={24} style={{ animation: "spin-slow 1s linear infinite", color: "var(--color-amber-500)" }} />
            </div>
          ) : convs.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
              No conversations yet.<br />Start chatting from a pet's profile.
            </div>
          ) : (
            convs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => { setActiveConvId(conv.id); setIsMobileList(false); }}
                style={{
                  width: "100%", padding: "16px 12px", borderRadius: "var(--radius-lg)",
                  background: activeConvId === conv.id ? "var(--color-amber-50)" : "transparent",
                  border: "none", display: "flex", gap: 12, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s ease", marginBottom: 4
                }}
                onMouseEnter={(e) => { if (activeConvId !== conv.id) e.currentTarget.style.background = "var(--color-surface-2)"; }}
                onMouseLeave={(e) => { if (activeConvId !== conv.id) e.currentTarget.style.background = "transparent"; }}
              >
                <ConvAvatar conv={conv} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.shelterName || (conv.petName ? `Re: ${conv.petName}` : "Conversation")}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.petName && <span style={{ color: "var(--color-amber-600)", fontWeight: 600 }}>{conv.petName}: </span>}
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span style={{
                        width: 18, height: 18, borderRadius: "50%", background: "var(--color-amber-500)",
                        color: "white", fontSize: "0.7rem", fontWeight: 700, display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8
                      }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Thread */}
      <div className={`chat-main ${isMobileList ? "mobile-hidden" : ""}`} style={{
        flex: 1, background: "var(--color-surface)", borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        {activeConv ? (
          <>
            {/* Thread Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setIsMobileList(true)} className="mobile-only" style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <ChevronLeft size={24} />
                </button>
                <ConvAvatar conv={activeConv} size={40} />
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{activeConv.shelterName || (activeConv.petName ? `Re: ${activeConv.petName}` : "Conversation")}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Online</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-icon"><Phone size={18} /></button>
                <button className="btn btn-ghost btn-icon"><Video size={18} /></button>
                <button className="btn btn-ghost btn-icon"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Pet Context Banner */}
            {activeConv.petId && (
              <div style={{ padding: "8px 24px", background: "var(--color-surface-2)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PawPrint size={14} color="var(--color-amber-600)" />
                  <span style={{ fontSize: "0.85rem" }}>
                    Discussing adoption for <strong>{activeConv.petName || "a pet"}</strong>
                  </span>
                </div>
                <Link href={`/pets/${activeConv.petId}`} className="btn btn-ghost btn-sm" style={{ fontSize: "0.75rem", padding: "4px 8px" }}>
                  View Profile <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ textAlign: "center", margin: "10px 0 20px" }}>
                <span style={{ fontSize: "0.75rem", background: "var(--color-surface-2)", padding: "4px 12px", borderRadius: "var(--radius-full)", color: "var(--color-text-light)" }}>
                  Beginning of your conversation
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{
                      alignSelf: isMe ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start"
                    }}
                  >
                    <div style={{
                      padding: "12px 16px",
                      borderRadius: isMe ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background: isMe ? "var(--color-amber-500)" : "var(--color-surface-2)",
                      color: isMe ? "white" : "var(--color-text)",
                      boxShadow: isMe ? "0 4px 12px rgba(245, 158, 11, 0.2)" : "none",
                    }}>
                      <p style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{msg.text}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, padding: "0 4px" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)" }}>
                        {formatTime(msg.timestamp)}
                      </span>
                      {isMe && <CheckCheck size={12} color="var(--color-amber-500)" />}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: "16px 24px 24px", borderTop: "1px solid var(--color-border)" }}>
              <form onSubmit={handleSendMessage} style={{
                display: "flex", gap: 12, alignItems: "center",
                background: "var(--color-surface-2)", borderRadius: "var(--radius-xl)",
                padding: "8px 12px"
              }}>
                <button type="button" className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Paperclip size={20} /></button>
                <input
                  type="text"
                  className="input"
                  placeholder="Type your message..."
                  style={{ border: "none", background: "transparent", flex: 1, padding: "8px 0" }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" className="btn btn-ghost btn-icon" style={{ padding: 6 }}><ImageIcon size={20} /></button>
                  <button type="button" className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Smile size={20} /></button>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary btn-icon ${!inputText.trim() ? "btn-disabled" : ""}`}
                  style={{ borderRadius: "var(--radius-lg)", width: 44, height: 44 }}
                  disabled={!inputText.trim()}
                >
                  <Send size={18} fill="currentColor" strokeWidth={0} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "var(--color-text-muted)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <MessageCircle size={40} />
            </div>
            <h3 className="title-lg" style={{ color: "var(--color-text-muted)" }}>Your messages</h3>
            <p style={{ fontSize: "0.9rem", marginTop: 8 }}>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 968px) {
          .chat-sidebar { width: 100% !important; }
          .mobile-hidden { display: none !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 969px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
        <Loader2 size={32} style={{ animation: "spin-slow 1s linear infinite", color: "var(--color-amber-500)" }} />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
