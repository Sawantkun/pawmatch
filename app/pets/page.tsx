"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Grid, List as ListIcon, Loader2 } from "lucide-react";
import { PetCard } from "@/components/pets/PetCard";
import { Pet } from "@/types";
import { getAllPets } from "@/lib/firestore";
import Link from "next/link";

const SPECIES_OPTIONS = [
  { id: "all", label: "All Species" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
  { id: "rabbit", label: "Rabbits" },
  { id: "bird", label: "Birds" },
];

const SIZE_OPTIONS = [
  { id: "all", label: "Any Size" },
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
];

export default function PetsPage() {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("all");
  const [size, setSize] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPets()
      .then(setAllPets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredPets = useMemo(() => {
    return allPets.filter((pet) => {
      if (species !== "all" && pet.species !== species) return false;
      if (size !== "all" && pet.size !== size) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!pet.name.toLowerCase().includes(q) && !pet.breed.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allPets, search, species, size]);

  const activeFiltersCount = (species !== "all" ? 1 : 0) + (size !== "all" ? 1 : 0);

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24, borderBottom: "none" }}>
        <h1 className="title-xl">Browse Pets</h1>
        <p style={{ color: "var(--color-text-muted)", marginTop: 8 }}>
          {loading ? "Loading pets..." : `Showing ${filteredPets.length} pets available for adoption`}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        marginBottom: 32,
        position: "sticky",
        top: 65,
        zIndex: 10,
        background: "var(--color-bg)",
        padding: "8px 0",
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-light)" }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: 44, borderRadius: "var(--radius-full)" }}
              placeholder="Search by name or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters || activeFiltersCount > 0 ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "10px 16px", borderRadius: "var(--radius-full)", gap: 6 }}
          >
            <SlidersHorizontal size={16} />
            <span className="desktop-only">Filters</span>
            {activeFiltersCount > 0 && (
              <span style={{
                background: "white",
                color: "var(--color-amber-600)",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>
          <div className="desktop-only" style={{ display: "flex", background: "var(--color-surface-2)", borderRadius: "var(--radius-full)", padding: 4, border: "1px solid var(--color-border)" }}>
            <button onClick={() => setViewMode("grid")} style={{ padding: 6, borderRadius: "var(--radius-full)", background: viewMode === "grid" ? "white" : "transparent", color: viewMode === "grid" ? "var(--color-text)" : "var(--color-text-light)", border: "none", cursor: "pointer", display: "flex", boxShadow: viewMode === "grid" ? "var(--shadow-sm)" : "none" }}>
              <Grid size={18} />
            </button>
            <button onClick={() => setViewMode("list")} style={{ padding: 6, borderRadius: "var(--radius-full)", background: viewMode === "list" ? "white" : "transparent", color: viewMode === "list" ? "var(--color-text)" : "var(--color-text-light)", border: "none", cursor: "pointer", display: "flex", boxShadow: viewMode === "list" ? "var(--shadow-sm)" : "none" }}>
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                padding: 16,
                boxShadow: "var(--shadow-md)",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                <div>
                  <label className="input-label">Species</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {SPECIES_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => setSpecies(opt.id)} className={`tag ${species === opt.id ? "active" : ""}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="input-label">Size</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    {SIZE_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => setSize(opt.id)} className={`tag ${size === opt.id ? "active" : ""}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button onClick={() => { setSpecies("all"); setSize("all"); setSearch(""); }} className="btn btn-ghost btn-sm">
                  Reset All
                </button>
                <button onClick={() => setShowFilters(false)} className="btn btn-primary btn-sm">
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <Loader2 size={40} style={{ animation: "spin-slow 1s linear infinite", color: "var(--color-amber-500)" }} />
        </div>
      ) : filteredPets.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr",
          gap: 24,
        }}>
          {filteredPets.map((pet, i) => (
            <PetCard key={pet.id} pet={pet} index={i} viewMode={viewMode} />
          ))}
        </div>
      ) : allPets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-xl)",
            border: "1.5px dashed var(--color-border)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🐾</div>
          <h3 className="title-lg">No pets listed yet</h3>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8, maxWidth: 360, margin: "8px auto 24px" }}>
            Shelters haven't posted any pets yet. Check back soon or sign up as a shelter to post listings.
          </p>
          <Link href="/auth/signup" className="btn btn-primary">Sign Up as a Shelter</Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-xl)",
            border: "1.5px dashed var(--color-border)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>😿</div>
          <h3 className="title-lg">No pets found</h3>
          <p style={{ color: "var(--color-text-muted)", marginTop: 8, maxWidth: 320, margin: "8px auto 24px" }}>
            Try adjusting your search or resetting filters.
          </p>
          <button onClick={() => { setSpecies("all"); setSize("all"); setSearch(""); }} className="btn btn-primary">
            Clear All Filters
          </button>
        </motion.div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
