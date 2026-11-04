"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HiExternalLink } from "react-icons/hi";

const Institutional = () => {
  const bodies = [
    {
      name: "IEEE Global",
      description: "La organización profesional técnica más grande del mundo dedicada al avance de la tecnología para la humanidad.",
      logo: "/images/ieee_white_logo.png",
      web: "https://www.ieee.org"
    },
    {
      name: "CIS Society",
      description: "Computational Intelligence Society, enfocada en redes neuronales, sistemas borrosos y computación evolutiva.",
      logo: "/images/cis_white_logo.png",
      web: "https://cis.ieee.org"
    },
    {
      name: "UNI",
      description: "La Universidad Nacional de Ingeniería, alma mater y cuna de la ingeniería y ciencia en el Perú.",
      logo: "/images/logo_uni_white.png",
      web: "https://www.uni.edu.pe"
    }
  ];

  return (
    <section className="py-12 md:py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
            Respaldo Institucional
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-[var(--brand-text)] mb-8 drop-shadow-sm">
            Nuestra{" "}
            <em className="not-italic italic text-brand-accent text-5xl md:text-6xl font-extrabold">
              Red
            </em>
          </h3>
        </div>

        {/* 1 columna en celular (antes 2 columnas con texto de 10px), 2 en tablet, 3 en escritorio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch relative">
          {/* Decorative Connection Line Background - Hidden on Mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent -z-10" />

          {/* Toda la tarjeta es el enlace (antes solo un icono de Chrome de 18px, poco visible) */}
          {bodies.map((body, index) => (
            <motion.a
              key={index}
              href={body.web}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar el sitio oficial de ${body.name}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`p-6 md:p-10 rounded-2xl md:rounded-3xl bg-[var(--brand-card)] border border-[var(--brand-border)] backdrop-blur-md flex flex-col items-center text-center group hover:border-brand-accent/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(6,107,243,0.1)] shadow-sm transition-all cursor-pointer ${
                index === 2 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="h-16 md:h-20 flex items-center justify-center mb-6 md:mb-8">
                <Image
                  src={body.logo}
                  alt={body.name}
                  width={150}
                  height={50}
                  className="w-auto h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity logo-adaptive"
                />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-[var(--brand-text)] mb-2 md:mb-4 group-hover:text-brand-accent transition-colors">{body.name}</h4>
              <p className="text-[var(--brand-text-muted)] opacity-80 text-sm leading-relaxed mb-6 md:mb-8">
                {body.description}
              </p>
              <div className="mt-auto pt-4 md:pt-6 border-t border-[var(--brand-border)] w-full flex justify-center">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-accent">
                  Visitar sitio
                  <HiExternalLink className="text-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Institutional;
