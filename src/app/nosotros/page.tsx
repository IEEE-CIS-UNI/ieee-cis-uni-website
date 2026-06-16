import AboutHero from "@/components/about/AboutHero";
import Stats from "@/components/about/Stats";
import GlobalCIS from "@/components/about/GlobalCIS";
import Institutional from "@/components/about/Institutional";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden about-page-bg">
      {/* ── Fondo dinámico: red neuronal interactiva ────────────────────────
           El contenedor está fijo para que permanezca en la pantalla
           mientras se hace scroll por el contenido.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground />
        {/* Capa de difuminado muy suave para no ocultar la red */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-[var(--brand-accent)]/5" />
        {/* Gradiente radial para legibilidad, adaptativo */}
        <div className="absolute inset-0 about-radial-gradient" />
      </div>

      {/* ── Contenido principal ── */}
      <main className="relative z-10">
        <AboutHero />
        <Stats />
        <GlobalCIS />
        <Institutional />
      </main>
    </div>
  );
}
