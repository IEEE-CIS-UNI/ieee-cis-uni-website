"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useIsDesktop } from "@/lib/useIsDesktop";

// Suprimir los warnings inofensivos de Spline/Three.js igual que en Hero.tsx.
// Solo se filtran mensajes propios de Spline: antes también se ocultaba cualquier
// error que contuviera "position", lo que podía esconder errores reales.
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: Parameters<typeof console.error>) => {
    const msg = args[0];
    if (
      typeof msg === "string" &&
      (msg.includes("Missing property") || msg.includes("buildTimeline"))
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
  // En celular no se carga la escena 3D (pesada y bloquea el scroll táctil).
  const isDesktop = useIsDesktop();

  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 px-6 md:px-12 lg:px-24 min-h-[80svh] flex items-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">

          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 lg:col-span-5">
            <div className="animate-fade-in-up">
              <span className="text-[var(--brand-accent-label)] font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
                Investigación y Desarrollo
              </span>
              {/* lg: la columna mide 5/12; clamp evita que "Transformando" se monte sobre el robot */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[clamp(2.25rem,calc(5.2vw-1rem),3.75rem)] font-extrabold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
                Transformando{" "}
                <em className="not-italic italic text-brand-accent-text text-5xl sm:text-6xl md:text-8xl lg:text-[clamp(3.5rem,calc(8vw-1.5rem),6rem)] font-extrabold">
                  Ideas
                </em>{" "}
                en Soluciones Realidad
              </h1>
              <p className="text-lg md:text-xl text-[var(--brand-text-muted)] leading-relaxed mb-8 drop-shadow-sm font-medium">
                Nuestros proyectos abarcan desde la investigación teórica en redes neuronales hasta la implementación de sistemas autónomos y soluciones de IA con impacto social.
              </p>
            </div>
          </div>

          {/* 3D Model Spline Container */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="animate-fade-in-scale relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-500 pointer-events-none" />

              {/* 3D Model Box */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] backdrop-blur-md flex items-center justify-center pointer-events-auto">
                {isDesktop ? (
                  <Spline scene="https://prod.spline.design/HE4AYvwMqlguAv2S/scene.splinecode" />
                ) : (
                  <Image
                    src="/images/hero_image.png"
                    alt="Ilustración de una red neuronal"
                    fill
                    sizes="90vw"
                    className="object-contain p-6"
                    priority
                  />
                )}
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
