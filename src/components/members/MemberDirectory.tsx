"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemberCard from "@/components/ui/MemberCard";
import OrgChart from "@/components/members/OrgChart";
import { HiSearch, HiUserGroup } from "react-icons/hi";
import { HiOutlineTableCells } from "react-icons/hi2";
import { TbHierarchy3 } from "react-icons/tb";
import { supabase } from "@/lib/supabase";
import { Member } from "@/types/database";

type ViewMode = "directorio" | "organigrama";

const TABS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: "directorio", label: "Directorio", icon: <HiOutlineTableCells size={15} /> },
  { id: "organigrama", label: "Organigrama", icon: <TbHierarchy3 size={15} /> },
];

const MemberDirectory = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("directorio");

  useEffect(() => {
    let ignore = false;

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('miembros')
          .select('*')
          .order('orden', { ascending: true });

        if (!ignore) {
          if (error) throw error;
          if (data) setMembers(data);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchMembers();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(members.map(m => m.categoria).filter((c): c is Member['categoria'] => !!c)));
    return ["TODOS", ...cats.sort()];
  }, [members]);

  const filteredMembers = members.filter(member => {
    const matchesFilter = filter === "TODOS" || member.categoria === filter;
    const matchesSearch = member.nombre.toLowerCase().includes(search.toLowerCase()) || 
                          member.rol.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 min-h-[60vh]">
      <div className="max-w-7xl mx-auto">

        {/* ── View Tabs ──────────────────────────────────────────── */}
        <div className="flex justify-center mb-10">
          <div className="flex p-1 gap-1 bg-[var(--brand-card)] border border-[var(--brand-border)] rounded-full backdrop-blur-md shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setView(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-2.5 rounded-full
                  text-xs font-bold uppercase tracking-widest
                  transition-all duration-300
                  ${view === tab.id
                    ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    : "text-[var(--brand-text-muted)] hover:text-[var(--brand-text)]"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar: only shown in Directorio mode ──────────────── */}
        <AnimatePresence mode="wait">
          {view === "directorio" && (
            <motion.div
              key="toolbar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center mb-16 gap-8 overflow-hidden"
            >
              <div className="relative w-full max-w-xl group">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)] group-focus-within:text-brand-accent transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o cargo..."
                  className="w-full bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] rounded-full py-4 pl-12 pr-6 text-[var(--brand-text)] placeholder:text-[var(--brand-text-muted)] focus:outline-none focus:border-brand-accent/50 focus:bg-[var(--brand-card-hover)] transition-all text-center shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 sm:px-8 py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border tracking-widest backdrop-blur-md ${
                      filter === cat 
                      ? "bg-brand-accent border-brand-accent/50 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                      : "bg-[var(--brand-surface)] border-[var(--brand-border)] text-[var(--brand-text-muted)] hover:bg-[var(--brand-card-hover)] hover:text-[var(--brand-text)] hover:shadow-sm"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {view === "directorio" ? (
            <motion.div
              key="directorio"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Member Grid */}
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-[var(--brand-card)] backdrop-blur-md rounded-3xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <motion.div 
                    layout
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MemberCard 
                            name={member.nombre}
                            role={member.rol}
                            image={member.image_url || "/images/placeholder-member.png"}
                            linkedin={member.linkedin || "#"}
                            github={member.github || "#"}
                            interests={member.interests || []}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {filteredMembers.length === 0 && (
                    <div className="text-center py-32 border border-dashed border-[var(--brand-border)] rounded-[3rem] backdrop-blur-md">
                      <div className="w-20 h-20 bg-[var(--brand-card)] rounded-3xl flex items-center justify-center text-[var(--brand-text-muted)] mx-auto mb-6 shadow-sm">
                        <HiUserGroup size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--brand-text)] mb-2 uppercase tracking-widest">Sin miembros</h3>
                      <p className="text-[var(--brand-text-muted)] max-w-xs mx-auto">No hay miembros registrados en esta categoría por el momento.</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="organigrama"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex flex-col items-center gap-6 py-20">
                  <div className="w-48 h-16 bg-[var(--brand-card)] rounded-2xl animate-pulse" />
                  <div className="flex gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-40 h-52 bg-[var(--brand-card)] rounded-2xl animate-pulse" />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-64 bg-[var(--brand-card)] rounded-2xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : (
                <OrgChart members={members} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default MemberDirectory;
