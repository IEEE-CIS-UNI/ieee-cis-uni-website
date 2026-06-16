import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";

export const metadata = {
  title: "Blog & Research | IEEE CIS UNI",
  description: "Explora los últimos artículos, tutoriales e investigaciones sobre Inteligencia Artificial de la comunidad IEEE CIS UNI.",
};

export default function BlogPage() {
  return (
    <div className="relative overflow-hidden about-page-bg min-h-screen">
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
        <BlogHero />
        <BlogGrid />
      </main>
    </div>
  );
}
