"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, 
  Home, Users, Zap, Heart, Info, Loader2,
  Dog, Cat, Rabbit, Bird, PawPrint
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PETS } from "@/data/mockData";
import { PetCard } from "@/components/pets/PetCard";
import toast from "react-hot-toast";

const STEPS = [
  {
    id: "lifestyle",
    title: "Your Lifestyle",
    question: "How would you describe your typical daily activity level?",
    options: [
      { id: "active", label: "Very Active", desc: "Hiking, running, outdoor adventures daily", icon: Zap },
      { id: "moderate", label: "Moderately Active", desc: "Daily walks and some weekend play", icon: Users },
      { id: "calm", label: "Calm & Relaxed", desc: "Short walks and lots of indoor chilling", icon: Heart },
    ]
  },
  {
    id: "homeType",
    title: "Your Home",
    question: "What kind of home environment do you live in?",
    options: [
      { id: "house", label: "House with Yard", desc: "Plenty of outdoor space to run", icon: Home },
      { id: "apartment", label: "Apartment/Condo", desc: "Limited space, needs outdoor walks", icon: Users },
      { id: "rural", label: "Rural/Farm", desc: "Wide open spaces and nature", icon: PawPrint },
    ]
  },
  {
    id: "preferredSpecies",
    title: "Pet Preference",
    question: "What kind of companion are you looking for?",
    options: [
      { id: "dog", label: "A Dog", desc: "Loyal, active, and social companions", icon: Dog },
      { id: "cat", label: "A Cat", desc: "Independent yet loving feline friends", icon: Cat },
      { id: "rabbit", label: "A Rabbit", desc: "Gentle, quiet, and adorable small pets", icon: Rabbit },
    ]
  },
  {
    id: "preferredSize",
    title: "Size Preference",
    question: "What size pet fits your living situation best?",
    options: [
      { id: "small", label: "Small", desc: "Under 20 lbs - Ideal for apartments", icon: Users },
      { id: "medium", label: "Medium", desc: "20-50 lbs - Versatile companions", icon: Users },
      { id: "large", label: "Large", desc: "50+ lbs - Better for houses with yards", icon: Users },
    ]
  }
];

export default function MatchPage() {
  const { user, updatePreferences } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isMatching, setIsMatching] = useState(false);
  const [results, setResults] = useState<{ petId: string; score: number; reason: string }[] | null>(null);

  const handleSelect = (optionId: string) => {
    const stepId = STEPS[currentStep].id;
    setAnswers(prev => ({ ...prev, [stepId]: optionId }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      runMatch();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const runMatch = async () => {
    setIsMatching(true);
    // Simulate AI processing
    await new Promise(r => setTimeout(r, 2500));
    
    // In a real app, we would call Gemini here.
    // Let's mock the ranking based on our answers.
    const mockResults = PETS.map(pet => {
      let score = 70 + Math.floor(Math.random() * 25); // Baseline 70-95
      
      // Basic matching logic for demo
      if (answers.preferredSpecies && pet.species !== answers.preferredSpecies) score -= 30;
      if (answers.preferredSize && pet.size !== answers.preferredSize) score -= 10;
      if (answers.lifestyle === "active" && pet.traits.includes("Energetic")) score += 5;
      if (answers.lifestyle === "calm" && pet.traits.includes("Calm")) score += 5;
      
      const reasons = [
        `Matches your ${answers.lifestyle} lifestyle perfectly.`,
        `Great fit for a ${answers.homeType} environment.`,
        `Complements your activity level and space.`,
        `${pet.name}'s personality aligns with your preferences.`
      ];

      return {
        petId: pet.id,
        score: Math.min(Math.max(score, 0), 99),
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      };
    }).sort((a, b) => b.score - a.score);

    setResults(mockResults);
    setIsMatching(false);
    
    // Save preferences to auth context
    if (user) {
      updatePreferences({
        lifestyle: answers.lifestyle || "moderate",
        homeType: answers.homeType || "house",
        activityLevel: answers.lifestyle || "moderate",
        experience: "some",
        preferredSize: answers.preferredSize || "medium",
        preferredAge: "adult",
        preferredSpecies: answers.preferredSpecies || "dog",
        allergies: false
      });
    }

    toast.success("Matches found! 🐾");
  };

  if (results) {
    return (
      <div className="container match-page" style={{ paddingBottom: 80, paddingLeft: "var(--container-px)", paddingRight: "var(--container-px)" }}>
        <div style={{ padding: "60px 0 40px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", padding: "8px 16px", background: "var(--color-amber-100)", borderRadius: "var(--radius-full)", marginBottom: 16 }}>
            <Sparkles size={16} color="var(--color-amber-600)" />
          </div>
          <h1 className="title-xl">Your Best Matches</h1>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8 }}>
            Our AI analyzed {PETS.length} pets to find your perfect companions.
          </p>
          <button 
            onClick={() => setResults(null)}
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 16 }}
          >
            Retake Quiz
          </button>
        </div>

        <div className="grid-cols-mobile">
          {results.slice(0, 6).map((res, i) => {
            const pet = PETS.find(p => p.id === res.petId);
            if (!pet) return null;
            return (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                index={i} 
                matchScore={res.score} 
                matchReason={res.reason} 
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="container match-page" style={{ 
      minHeight: "calc(100vh - 64px)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px var(--container-px)"
    }}>
      <div style={{ width: "100%", maxWidth: 640 }}>
        
        {/* Progress Bar */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-amber-600)" }}>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div style={{ height: 6, background: "var(--color-surface-2)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              style={{ height: "100%", background: "var(--color-amber-500)" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isMatching ? (
            <motion.div 
              key="matching"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 32px" }}>
                <Loader2 size={100} color="var(--color-amber-500)" className="animate-spin" style={{ opacity: 0.2 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles size={40} color="var(--color-amber-500)" />
                  </motion.div>
                </div>
              </div>
              <h2 className="title-lg">Finding your perfect match...</h2>
              <p style={{ color: "var(--color-text-muted)", marginTop: 12 }}>
                Our AI is analyzing pet personalities and your lifestyle
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-amber-600)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
                {STEPS[currentStep].title}
              </p>
              <h1 className="title-xl" style={{ marginBottom: 40, lineHeight: 1.2 }}>
                {STEPS[currentStep].question}
              </h1>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* ... existing options mapping ... */}
                {STEPS[currentStep].options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = answers[STEPS[currentStep].id] === opt.id;
                  
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      className="card"
                      style={{
                        padding: 20,
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        border: isSelected ? "2.5px solid var(--color-amber-500)" : "1.5px solid var(--color-border)",
                        background: isSelected ? "var(--color-amber-50)" : "var(--color-surface)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ 
                        width: 48, height: 48, borderRadius: "var(--radius-md)", 
                        background: isSelected ? "var(--color-amber-100)" : "var(--color-surface-2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isSelected ? "var(--color-amber-600)" : "var(--color-text-muted)"
                      }}>
                        <Icon size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, color: isSelected ? "var(--color-amber-700)" : "var(--color-text)" }}>{opt.label}</p>
                        <p style={{ fontSize: "0.85rem", color: isSelected ? "var(--color-amber-600)" : "var(--color-text-muted)" }}>{opt.desc}</p>
                      </div>
                      {isSelected && (
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-amber-500)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48 }}>
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="btn btn-ghost"
                  style={{ gap: 8 }}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!answers[STEPS[currentStep].id]}
                  className="btn btn-primary btn-lg"
                  style={{ gap: 8, padding: "16px 40px" }}
                >
                  {currentStep === STEPS.length - 1 ? "Submit" : "Next Step"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Tip */}
        {!isMatching && (
          <div style={{ marginTop: 60, padding: 20, background: "rgba(245, 158, 11, 0.05)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(245, 158, 11, 0.1)", display: "flex", gap: 16 }}>
            <Info size={20} color="var(--color-amber-500)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: "0.85rem", color: "var(--color-amber-700)", lineHeight: 1.6 }}>
              <strong>AI Tip:</strong> Being honest about your lifestyle helps our Gemini engine find pets with the highest chance of long-term bonding success.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
