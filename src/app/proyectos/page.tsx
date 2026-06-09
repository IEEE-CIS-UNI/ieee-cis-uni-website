import ProjectHero from "@/components/projects/ProjectHero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";

export const metadata = {
  title: "Proyectos | IEEE CIS UNI",
  description: "Explora los proyectos de investigación y desarrollo del capítulo estudiantil IEEE CIS de la Universidad Nacional de Ingeniería.",
};

export default function ProyectosPage() {
  return (
    <div className="relative overflow-hidden bg-[#00102a] min-h-screen">
      {/* ── Fondo dinámico: red neuronal interactiva ────────────────────────
           El contenedor está fijo para que permanezca en la pantalla
           mientras se hace scroll por el contenido.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground />
        {/* Capa de difuminado muy suave para no ocultar la red */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-[var(--brand-accent)]/5" />
        {/* Gradiente radial para legibilidad, usando un azul profundo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 20%, transparent 20%, #00102a 85%)",
          }}
        />
      </div>

      {/* ── Contenido principal ── */}
      <main className="relative z-10">
        <ProjectHero />
        <ProjectGrid />
      </main>
    </div>
  );
}
