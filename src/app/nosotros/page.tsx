import AboutHero from "@/components/about/AboutHero";
import Stats from "@/components/about/Stats";
import Timeline from "@/components/about/Timeline";
import Institutional from "@/components/about/Institutional";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";

export default function AboutPage() {
  return (
    /*
     * Wrapper con position:relative + overflow:hidden para contener
     * el canvas de NeuralNetworkBackground en toda la sección /nosotros.
     */
    <div className="relative overflow-hidden bg-[var(--brand-surface)]">

      {/* ── Fondo dinámico: red neuronal interactiva ────────────────────────
           El canvas ocupa todo el wrapper (absolute inset-0).
           pointer-events:none garantiza que no bloquee ningún click.
      ─────────────────────────────────────────────────────────────────── */}
      <NeuralNetworkBackground />

      {/* Capa de difuminado suave sobre el canvas */}
      <div className="absolute inset-0 pointer-events-none backdrop-blur-[6px] bg-[var(--brand-surface)]/10" />

      {/* Gradiente radial para legibilidad del contenido */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 20%, transparent 35%, var(--brand-surface) 75%)",
        }}
      />

      {/* ── Contenido principal ── */}
      <main className="relative z-10">
        <AboutHero />
        <Stats />
        <Timeline />
        <Institutional />
      </main>
    </div>
  );
}
