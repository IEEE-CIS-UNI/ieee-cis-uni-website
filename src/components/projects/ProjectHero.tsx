"use client";

import dynamic from "next/dynamic";

// Suprimir los warnings inofensivos de Spline/Three.js igual que en Hero.tsx
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: Parameters<typeof console.error>) => {
    const msg = args[0];
    if (
      typeof msg === "string" &&
      (msg.includes("Missing property") ||
        msg.includes("buildTimeline") ||
        msg.includes("position"))
    )
      return;
    originalError(...args);
  };
}

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

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

          {/* 3D Model Spline Container */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="animate-fade-in-scale relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700 pointer-events-none" />

              {/* 3D Model Box */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] backdrop-blur-md flex items-center justify-center pointer-events-auto">
                <Spline scene="https://prod.spline.design/HE4AYvwMqlguAv2S/scene.splinecode" />
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
