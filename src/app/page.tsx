import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Team from "@/components/home/Team";
import Projects from "@/components/home/Projects";
import Events from "@/components/home/Events";
import Blog from "@/components/home/Blog";
import BrandOrbs from "@/components/ui/BrandOrbs";
import { getBoardMembers, getFeaturedProjects, getHomeEvents, getRecentPosts } from "@/lib/queries";

// Los datos se piden en el servidor y van en el HTML (ver src/lib/queries.ts).
// Se regenera como máximo cada 60 s; los componentes además consultan en segundo
// plano, así un cambio en Supabase se ve al recargar como antes.
export const revalidate = 60;

export default async function Home() {
  const [members, projects, events, posts] = await Promise.all([
    getBoardMembers(),
    getFeaturedProjects(),
    getHomeEvents(),
    getRecentPosts(),
  ]);

  return (
    <div className="relative w-full min-h-svh">
      {/* Fondo de Orbes fijo global */}
      <BrandOrbs />

      <Hero />
      {/* Sin <Reveal>: cada sección ya tiene su propia entrada; envolverlas
          hacía que todo entrara dos veces (la sección subía y sus tarjetas se deslizaban). */}
      <About />
      <Team initialMembers={members} />
      <Projects initialProjects={projects} />
      <Events initialData={events} />
      <Blog initialPosts={posts} />
    </div>
  );
}
