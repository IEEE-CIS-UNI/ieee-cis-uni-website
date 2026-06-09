import EventHero from "@/components/events/EventHero";
import EventList from "@/components/events/EventList";

export const metadata = {
  title: "Eventos | IEEE CIS UNI",
  description: "Participa en nuestros próximos workshops, conferencias y competencias. Sé parte de la comunidad de Inteligencia Computacional de la UNI.",
};

export default function EventosPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fondo de Orbes fijo global (estilo Home) */}
      <div className="hero-orb-a fixed top-1/4 -left-20 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[160px] opacity-50 -z-20 pointer-events-none" />
      <div className="hero-orb-b fixed bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 -z-20 pointer-events-none" style={{ backgroundColor: "#7C3AED" }} />

      <main className="relative z-10">
        <EventHero />
        <EventList />
      </main>
    </div>
  );
}
