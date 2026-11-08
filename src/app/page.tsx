import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Team from "@/components/home/Team";
import Projects from "@/components/home/Projects";
import Events from "@/components/home/Events";
import Blog from "@/components/home/Blog";
import BrandOrbs from "@/components/ui/BrandOrbs";

export default function Home() {
  return (
    <div className="relative w-full min-h-svh">
      {/* Fondo de Orbes fijo global */}
      <BrandOrbs />

      <Hero />
      {/* Sin <Reveal>: cada sección ya tiene su propia entrada; envolverlas
          hacía que todo entrara dos veces (la sección subía y sus tarjetas se deslizaban). */}
      <About />
      <Team />
      <Projects />
      <Events />
      <Blog />
    </div>
  );
}
