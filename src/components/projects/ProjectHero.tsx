"use client";

import { HiLightningBolt, HiCode, HiChip } from "react-icons/hi";

const ProjectHero = () => {
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 px-6 md:px-12 lg:px-24 min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 lg:col-span-5">
            <div className="animate-fade-in-up">
              <span className="text-brand-accent font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
                Investigación y Desarrollo
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
                Transformando{" "}
                <em className="not-italic italic text-brand-accent text-6xl md:text-8xl font-extrabold">
                  Ideas
                </em>{" "}
                en Soluciones Realidad
              </h1>
              <p className="text-xl text-[var(--brand-text-muted)] leading-relaxed mb-8 drop-shadow-sm font-medium">
                Nuestros proyectos abarcan desde la investigación teórica en redes neuronales hasta la implementación de sistemas autónomos y soluciones de IA con impacto social.
              </p>
            </div>
          </div>

          {/* Tech Visual — replaces Spline (zero JS errors) */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="animate-fade-in-scale relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700 pointer-events-none" />

              {/* Visual Box */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] backdrop-blur-md flex items-center justify-center pointer-events-auto">

                {/* Animated grid background */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle, #066bf3 1px, transparent 1px)", backgroundSize: "28px 28px" }}
                />

                {/* Floating orbs */}
                <div className="absolute top-8 left-12 w-24 h-24 bg-brand-accent/20 rounded-full blur-2xl hero-orb-a" />
                <div className="absolute bottom-10 right-16 w-32 h-32 bg-brand-accent/15 rounded-full blur-3xl hero-orb-b" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-brand-accent/10 rounded-full blur-[60px] hero-orb-a" style={{ animationDelay: '-2s' }} />

                {/* Central icon cluster */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <HiChip className="text-brand-accent text-3xl" />
                    </div>
                    <div className="w-20 h-20 bg-brand-accent/15 border border-brand-accent/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <HiLightningBolt className="text-brand-accent text-4xl" />
                    </div>
                    <div className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ transitionDelay: '100ms' }}>
                      <HiCode className="text-brand-accent text-3xl" />
                    </div>
                  </div>
                  <span className="text-[var(--brand-text-muted)] text-xs font-bold uppercase tracking-[0.3em] opacity-60">
                    IEEE CIS UNI — Proyectos
                  </span>
                </div>

                {/* Decorative corner lines */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-brand-accent/40 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-brand-accent/40 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-brand-accent/40 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-brand-accent/40 rounded-br-lg" />
              </div>

              {/* Decorative Tech Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-accent rounded-tr-xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-accent rounded-bl-xl pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProjectHero;
