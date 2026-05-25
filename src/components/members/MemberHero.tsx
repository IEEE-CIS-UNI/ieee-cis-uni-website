"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const MemberHero = () => {
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 px-6 md:px-12 lg:px-24 min-h-[80vh] flex items-center overflow-hidden">

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-accent font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
                Nuestra Comunidad
              </span>
              <h1 className="font-extrabold leading-[1] tracking-tight mb-8 text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-white">El Talento</span>
                <span className="block text-white">Detrás de la</span>
                <span className="block italic text-brand-accent lg:text-[90px]">Innovación.</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Conoce a los estudiantes e investigadores que conforman el capítulo CIS UNI. Un equipo multidisciplinario dedicado al avance de la inteligencia computacional.
              </p>
            </motion.div>
          </div>

          {/* Tech Placeholder Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative group"
            >

              {/* Photo — object-contain para ver la imagen completa sin recortes */}
              <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group bg-[var(--brand-background)]/10" style={{ minHeight: "280px" }}>
                {/* Glow overlay sutil, ahora con colores más fuertes y mix-blend */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/50 via-transparent to-[#7C3AED]/50 z-10 pointer-events-none rounded-3xl mix-blend-color" />

                <Image
                  src="/images/Teamcis.jpeg"
                  alt="Equipo IEEE CIS UNI"
                  width={900}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-1000 ease-out rounded-3xl"
                  priority
                />
              </div>

              {/* Decorative Tech Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-accent rounded-tr-xl" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-accent rounded-bl-xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberHero;
