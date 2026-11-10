import AboutHero from "@/components/about/AboutHero";
import Stats from "@/components/about/Stats";
import GlobalCIS from "@/components/about/GlobalCIS";
import Institutional from "@/components/about/Institutional";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";
import BrandOrbs from "@/components/ui/BrandOrbs";
import { getStorageImages } from "@/lib/queries";

// Los datos se piden en el servidor y van en el HTML (ver src/lib/queries.ts).
// Se regenera como máximo cada 60 s; los componentes además consultan en segundo
// plano, así un cambio en Supabase se ve al recargar como antes.
export const revalidate = 60;

export const metadata = {
  title: "Nosotros",
  description: "Conoce al capítulo estudiantil IEEE Computational Intelligence Society de la Universidad Nacional de Ingeniería: nuestra misión, trayectoria y red institucional.",
};

export default async function AboutPage() {
  const heroImages = await getStorageImages("aboutus", "about");

  return (
    <div className="relative overflow-hidden about-page-bg">
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
        <AboutHero initialImages={heroImages} />
        <Stats />
        <GlobalCIS />
        <Institutional />
      </main>
    </div>
  );
}
