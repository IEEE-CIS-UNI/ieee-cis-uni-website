import ProjectHero from "@/components/projects/ProjectHero";
import ProjectGrid from "@/components/projects/ProjectGrid";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";
import BrandOrbs from "@/components/ui/BrandOrbs";
import { getAllProjects } from "@/lib/queries";

// Los datos se piden en el servidor y van en el HTML (ver src/lib/queries.ts).
// Se regenera como máximo cada 60 s; los componentes además consultan en segundo
// plano, así un cambio en Supabase se ve al recargar como antes.
export const revalidate = 60;

export const metadata = {
  // El sufijo " | IEEE CIS UNI" lo agrega la plantilla de src/app/layout.tsx
  title: "Proyectos",
  description: "Explora los proyectos de investigación y desarrollo del capítulo estudiantil IEEE CIS de la Universidad Nacional de Ingeniería.",
};

export default async function ProyectosPage() {
  const projects = await getAllProjects();

  return (
    <div className="relative overflow-hidden about-page-bg min-h-svh">
      {/* ── Fondo dinámico: red neuronal interactiva ────────────────────────
           El contenedor está fijo para que permanezca en la pantalla
           mientras se hace scroll por el contenido.
      ─────────────────────────────────────────────────────────────────── */}
      {/* Mismo fondo de marca que el Inicio; la red neuronal va encima */}
      <BrandOrbs />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground />
        {/* Capa de difuminado muy suave para no ocultar la red */}
        <div className="absolute inset-0 md:backdrop-blur-[2px] bg-[var(--brand-accent)]/5" />
        {/* Gradiente radial para legibilidad, adaptativo */}
        <div className="absolute inset-0 about-radial-gradient" />
      </div>

      {/* ── Contenido principal ── */}
      <main className="relative z-10">
        <ProjectHero />
        <ProjectGrid initialProjects={projects} />
      </main>
    </div>
  );
}
