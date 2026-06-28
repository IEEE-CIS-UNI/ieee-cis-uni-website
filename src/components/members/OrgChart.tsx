"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import OrgNode from "./OrgNode";
import { Member } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubArea {
  /** Nombre visible de la sub-área */
  label: string;
  /** Categorías de Supabase que pertenecen a esta sub-área */
  categories: string[];
}

interface AreaConfig {
  label: string;
  subAreas: SubArea[];
  accent: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
}

// ─── Configuración de Áreas y Sub-áreas ──────────────────────────────────────
// Ajusta `categories` según los valores exactos de tu Supabase.

const AREAS: AreaConfig[] = [
  {
    label: "Proyectos y Capacitaciones",
    icon: "🚀",
    accent: "#3B82F6",
    gradientFrom: "rgba(59,130,246,0.12)",
    gradientTo: "rgba(59,130,246,0.02)",
    subAreas: [
      { label: "Proyectos",       categories: ["PROYECTOS", "PROJECTS"] },
      { label: "Capacitaciones",  categories: ["CAPACITACIONES", "TRAINING"] },
      { label: "Desarrollo",      categories: ["DESARROLLO", "DEVELOPMENT", "DEV"] },
      { label: "Webmaster",       categories: ["WEBMASTER", "WEB"] },
    ],
  },
  {
    label: "Marketing y Publicidad",
    icon: "📣",
    accent: "#8B5CF6",
    gradientFrom: "rgba(139,92,246,0.12)",
    gradientTo: "rgba(139,92,246,0.02)",
    subAreas: [
      { label: "Marketing",   categories: ["MARKETING"] },
      { label: "Publicidad",  categories: ["PUBLICIDAD", "MEDIA"] },
      { label: "Membresía",   categories: ["MEMBRESIA", "MEMBRESÍA", "MEMBRESIA"] },
    ],
  },
  {
    label: "Relaciones Públicas y Eventos",
    icon: "🤝",
    accent: "#EC4899",
    gradientFrom: "rgba(236,72,153,0.12)",
    gradientTo: "rgba(236,72,153,0.02)",
    subAreas: [
      { label: "Relaciones Públicas", categories: ["RELACIONES PUBLICAS", "RELACIONES PÚBLICAS", "RRPP", "PR"] },
      { label: "Eventos",             categories: ["EVENTOS", "EVENTS"] },
    ],
  },
];

// ─── Role helpers ─────────────────────────────────────────────────────────────

function isDirector(rol: string) {
  const r = rol.toLowerCase();
  // "subdirector" must NOT match as director
  return r.includes("director") && !r.includes("sub");
}

function isSubdirector(rol: string) {
  const r = rol.toLowerCase();
  return r.includes("subdirector") || r.includes("sub-director") || r.includes("sub director");
}

function getDirector(members: Member[]): Member | undefined {
  return members.find((m) => isDirector(m.rol));
}

function getSubdirectors(members: Member[]): Member[] {
  return members.filter((m) => isSubdirector(m.rol));
}

// ─── Connector helpers ────────────────────────────────────────────────────────

const VerticalConnector = ({ color, height = 24 }: { color: string; height?: number }) => (
  <div className="flex justify-center">
    <svg width="2" height={height} className="overflow-visible">
      <line
        x1="1" y1="0" x2="1" y2={height}
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.45"
      />
    </svg>
  </div>
);

const HorizontalBranch = ({ count, color }: { count: number; color: string }) => {
  if (count <= 1) return <VerticalConnector color={color} />;
  return (
    <div className="relative flex justify-center">
      <svg className="overflow-visible" style={{ width: "100%", height: 32 }} preserveAspectRatio="none">
        <line x1="50%" y1="0" x2="50%" y2="16" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        <line x1="0"   y1="16" x2="100%" y2="16" stroke={color} strokeWidth="1.5" opacity="0.3" />
      </svg>
    </div>
  );
};

// ─── Empty slot placeholder ───────────────────────────────────────────────────

const EmptySlot = ({ accent, label }: { accent: string; label: string }) => (
  <div
    className="w-32 md:w-36 flex flex-col items-center justify-center gap-1 px-3 py-4 rounded-xl border border-dashed"
    style={{ borderColor: `${accent}30` }}
  >
    <span className="text-lg opacity-20">👤</span>
    <p className="text-[9px] text-[var(--brand-text-muted)] text-center leading-tight">{label}</p>
  </div>
);

// ─── Sub-area row ─────────────────────────────────────────────────────────────

interface SubAreaRowProps {
  subAreaLabel: string;
  director?: Member;
  subdirectors: Member[];
  accent: string;
  animDelay: number;
}

const SubAreaRow = ({ subAreaLabel, director, subdirectors, accent, animDelay }: SubAreaRowProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay: animDelay }}
    className="w-full"
  >
    {/* Sub-area label */}
    <div className="flex items-center gap-2 mb-3">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }} />
      <span
        className="text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full border"
        style={{ color: accent, borderColor: `${accent}35`, background: `${accent}10` }}
      >
        {subAreaLabel}
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, ${accent}40, transparent)` }} />
    </div>

    {/* Director (left) ──── Subdirector(es) (right) */}
    <div className="flex items-start justify-center gap-4 md:gap-6">
      {/* Director */}
      <div className="flex flex-col items-center gap-1">
        {director ? (
          <OrgNode member={director} size="md" accentColor={accent} delay={animDelay + 0.05} />
        ) : (
          <EmptySlot accent={accent} label="Director sin asignar" />
        )}
      </div>

      {/* Divider line */}
      <div className="flex flex-col items-center self-center mt-4">
        <svg width="28" height="2" className="overflow-visible">
          <line x1="0" y1="1" x2="28" y2="1" stroke={accent} strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4" />
        </svg>
      </div>

      {/* Subdirector(es) — stacked if more than one */}
      <div className="flex flex-col items-center gap-3">
        {subdirectors.length > 0 ? (
          subdirectors.map((sub, i) => (
            <OrgNode key={sub.id} member={sub} size="md" accentColor={accent} delay={animDelay + 0.1 + i * 0.06} />
          ))
        ) : (
          <EmptySlot accent={accent} label="Subdirector sin asignar" />
        )}
      </div>
    </div>
  </motion.div>
);

// ─── Main OrgChart ────────────────────────────────────────────────────────────

interface OrgChartProps {
  members: Member[];
}

const OrgChart = ({ members }: OrgChartProps) => {
  const boardAccent = "rgba(37,99,235,0.85)";

  const boardMembers = useMemo(
    () =>
      members
        .filter((m) => m.categoria?.toUpperCase() === "BOARD")
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
    [members]
  );

  // Build area data: for each area, for each sub-area, find director & subdirector
  const areasData = useMemo(() => {
    return AREAS.map((area) => ({
      ...area,
      subAreasData: area.subAreas.map((sub) => {
        const subMembers = members
          .filter((m) =>
            sub.categories.some(
              (cat) => m.categoria?.toUpperCase() === cat.toUpperCase()
            )
          )
          .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

        const director    = getDirector(subMembers);
        const subdirectors = getSubdirectors(subMembers);
        const others = subMembers.filter(
          (m) => !isDirector(m.rol) && !isSubdirector(m.rol)
        );

        // Fallback: si el rol no contiene "director"/"subdirector"
        // (ej: "Webmaster"), mostrar el primer miembro en el slot de director.
        const effectiveDirector =
          director ?? (subdirectors.length === 0 && others.length > 0
            ? others[0]
            : undefined);
        const effectiveOthers =
          !director && subdirectors.length === 0 ? others.slice(1) : others;

        return {
          label: sub.label,
          director: effectiveDirector,
          subdirectors,
          others: effectiveOthers,
        };
      }),
    }));
  }, [members]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full py-8"
    >
      {/* ── IEEE-CIS Banner ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-2"
      >
        <div className="flex items-center gap-3 px-8 py-3 bg-[var(--brand-card)] backdrop-blur-md border border-brand-accent/30 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.15)]">
          <span className="text-xl">⚡</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
              Capítulo Estudiantil
            </p>
            <h3 className="text-base md:text-lg font-bold text-[var(--brand-text)] leading-tight">
              IEEE CIS — UNI
            </h3>
          </div>
        </div>
      </motion.div>

      <VerticalConnector color={boardAccent} />

      {/* ── Junta Directiva ───────────────────────────────────────── */}
      <div className="flex flex-col items-center mb-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-3 px-3 py-1 border border-brand-accent/30 rounded-full bg-brand-accent/10"
        >
          Junta Directiva
        </motion.p>

        <div className="relative w-full">
          {boardMembers.length > 1 && (
            <>
              <div className="flex justify-center">
                <HorizontalBranch count={boardMembers.length} color={boardAccent} />
              </div>
              <div className="flex justify-around mb-0" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                {boardMembers.map((_, i) => (
                  <svg key={i} width="2" height="16" className="overflow-visible">
                    <line x1="1" y1="0" x2="1" y2="16" stroke={boardAccent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.45" />
                  </svg>
                ))}
              </div>
            </>
          )}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {boardMembers.length > 0 ? (
              boardMembers.map((m, i) => (
                <OrgNode key={m.id} member={m} size="lg" accentColor={boardAccent} delay={0.1 + i * 0.08} />
              ))
            ) : (
              <p className="text-[var(--brand-text-muted)] text-sm italic">
                Sin miembros BOARD registrados
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Connector: board → areas */}
      <div className="flex justify-center">
        <HorizontalBranch count={AREAS.length} color="rgba(255,255,255,0.2)" />
      </div>
      <div className="flex justify-around" style={{ paddingLeft: "3%", paddingRight: "3%" }}>
        {AREAS.map((area, i) => (
          <svg key={i} width="2" height="20" className="overflow-visible">
            <line x1="1" y1="0" x2="1" y2="20" stroke={area.accent} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
          </svg>
        ))}
      </div>

      {/* ── Áreas ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
        {areasData.map((area, areaIdx) => (
          <motion.div
            key={area.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + areaIdx * 0.1 }}
            className="flex flex-col"
          >
            {/* Area header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border mb-5 backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${area.gradientFrom}, ${area.gradientTo})`,
                borderColor: `${area.accent}40`,
                boxShadow: `0 0 20px ${area.accent}15`,
              }}
            >
              <span className="text-xl">{area.icon}</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight" style={{ color: area.accent }}>
                  Área de
                </p>
                <h4 className="text-xs md:text-sm font-bold text-[var(--brand-text)] leading-tight">
                  {area.label}
                </h4>
              </div>
            </div>

            {/* Sub-areas: one row per sub-area */}
            <div className="flex flex-col gap-5">
              {area.subAreasData.map((sub, subIdx) => (
                <div key={sub.label}>
                  {subIdx > 0 && (
                    <div className="mb-5">
                      <VerticalConnector color={area.accent} height={20} />
                    </div>
                  )}
                  <SubAreaRow
                    subAreaLabel={sub.label}
                    director={sub.director}
                    subdirectors={sub.subdirectors}
                    accent={area.accent}
                    animDelay={0.35 + areaIdx * 0.1 + subIdx * 0.08}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-4 mt-12 pt-8 border-t border-[var(--brand-border)]"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-accent opacity-80" />
          <span className="text-[10px] text-[var(--brand-text-muted)] uppercase tracking-wider">Junta Directiva</span>
        </div>
        {AREAS.map((area) => (
          <div key={area.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.accent, opacity: 0.8 }} />
            <span className="text-[10px] text-[var(--brand-text-muted)] uppercase tracking-wider">
              {area.label.split(" y ")[0]}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default OrgChart;
