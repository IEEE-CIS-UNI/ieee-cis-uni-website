"use client";

import Image from "next/image";
import MemberPlaceholder from "@/components/ui/MemberPlaceholder";
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import { Member } from "@/types/database";
import { normalizeUrl } from "@/lib/url";

interface OrgNodeProps {
  member: Member;
  size?: "lg" | "md" | "sm";
  accentColor?: string;
  delay?: number;
}

const SIZE_STYLES = {
  lg: {
    // w-36 en celular: la junta queda en 2 columnas en pantallas de 360px
    wrapper: "w-36 sm:w-40 md:w-48",
    image: "w-20 h-20 md:w-24 md:h-24",
    name: "text-sm md:text-base font-bold",
    role: "text-[11px]",
    card: "p-4 md:p-5 rounded-2xl",
    ring: "ring-2",
  },
  md: {
    // w-32 en celular: director + subdirector caben lado a lado en pantallas de 360px
    wrapper: "w-32 sm:w-36 md:w-40",
    image: "w-14 h-14 md:w-16 md:h-16",
    name: "text-xs md:text-sm font-bold",
    role: "text-[11px]",
    card: "p-3 md:p-4 rounded-xl",
    ring: "ring-[1.5px]",
  },
  sm: {
    wrapper: "w-32 md:w-36",
    image: "w-11 h-11 md:w-12 md:h-12",
    name: "text-[11px] md:text-xs font-semibold",
    role: "text-[11px]",
    card: "p-2.5 md:p-3 rounded-xl",
    ring: "ring-[1px]",
  },
};

const OrgNode = ({
  member,
  size = "md",
  accentColor = "rgba(37,99,235,0.7)",
  delay = 0,
}: OrgNodeProps) => {
  const s = SIZE_STYLES[size];
  const linkedin = normalizeUrl(member.linkedin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`${s.wrapper} flex flex-col items-center group`}
    >
      <div
        className={`
          w-full flex flex-col items-center ${s.card}
          bg-[var(--brand-card)] backdrop-blur-md
          border border-[var(--brand-border)]
          hover:border-opacity-80
          shadow-lg hover:shadow-xl
          transition duration-300 ease-out
          hover:-translate-y-1
          cursor-default
        `}
        style={{
          boxShadow: `0 4px 24px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Avatar */}
        <div
          className={`
            relative ${s.image} rounded-full overflow-hidden mb-3
            transition duration-300
          `}
          style={{
            outline: `${size === "lg" ? "2px" : "1.5px"} solid ${accentColor}`,
            outlineOffset: "3px",
          }}
        >
          {member.image_url ? (
            <Image
              src={member.image_url}
              alt={member.nombre}
              fill
              sizes="96px"
              className="object-cover grayscale-[0.15] group-hover:grayscale-0 transition duration-500"
            />
          ) : (
            <MemberPlaceholder label={`Sin foto de ${member.nombre}`} />
          )}
          {/* Subtle glow overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"
            style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
          />
        </div>

        {/* Name */}
        <h4
          className={`${s.name} text-[var(--brand-text)] text-center leading-tight mb-1`}
        >
          {member.nombre}
        </h4>

        {/* Role */}
        <p
          className={`${s.role} font-semibold uppercase tracking-widest text-center leading-tight`}
          style={{ color: accentColor }}
        >
          {member.rol}
        </p>

        {/* LinkedIn — solo si existe. En celular (sin hover) se muestra siempre. */}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${member.nombre}`}
            className="mt-2 p-1 text-[var(--brand-text-muted)] hover:text-brand-accent-text transition-colors md:opacity-0 md:group-hover:opacity-100 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <FaLinkedin size={size === "lg" ? 14 : 12} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default OrgNode;
