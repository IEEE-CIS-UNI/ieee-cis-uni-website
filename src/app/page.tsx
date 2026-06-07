import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Team from "@/components/home/Team";
import Projects from "@/components/home/Projects";
import Events from "@/components/home/Events";
import Blog from "@/components/home/Blog";
import Reveal from "@/components/ui/Reveal";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Fondo de Orbes fijo global */}
      <div className="hero-orb-a fixed top-1/4 -left-20 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[160px] opacity-50 -z-20 pointer-events-none" />
      <div className="hero-orb-b fixed bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 -z-20 pointer-events-none" style={{ backgroundColor: "#7C3AED" }} />

      <Hero />
      <Reveal><About /></Reveal>
      <Reveal><Team /></Reveal>
      <Reveal><Projects /></Reveal>
      <Reveal><Events /></Reveal>
      <Reveal><Blog /></Reveal>
    </div>
  );
}
