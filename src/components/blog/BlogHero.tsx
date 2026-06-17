"use client";

import { motion } from "framer-motion";
import { HiBookOpen } from "react-icons/hi";
import Image from "next/image";

const BlogHero = () => {
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 px-6 md:px-12 lg:px-24 min-h-[80vh] flex items-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] z-0 pointer-events-none" />
      
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
                Conocimiento e Innovación
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
                Explora la{" "}
                <em className="not-italic italic text-brand-accent text-6xl md:text-8xl font-extrabold">
                  Frontera
                </em>{" "}
                de la Inteligencia
              </h1>
              <p className="text-xl text-[var(--brand-text-muted)] leading-relaxed mb-8">
                Artículos técnicos, tutoriales paso a paso y reflexiones sobre el impacto de la IA en el mundo real, escritos por nuestra comunidad.
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
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700" />
              
              {/* Image Container */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] flex items-center justify-center group">
                <Image
                  src="/images/invest.png"
                  alt="Explora la Frontera de la Inteligencia"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
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

export default BlogHero;
