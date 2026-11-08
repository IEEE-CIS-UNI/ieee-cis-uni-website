import EventHero from "@/components/events/EventHero";
import EventCalendar from "@/components/events/EventCalendar";
import EventList from "@/components/events/EventList";
import InstagramShowcase from "@/components/events/InstagramShowcase";
import BrandOrbs from "@/components/ui/BrandOrbs";

export const metadata = {
  title: "Eventos",
  description: "Participa en nuestros próximos workshops, conferencias y competencias. Sé parte de la comunidad de Inteligencia Computacional de la UNI.",
};

export default function EventosPage() {
  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      {/* Fondo de Orbes fijo global (estilo Home) */}
      <BrandOrbs />

      <main className="relative z-10">
        <EventHero />
        <EventCalendar />
        <EventList />
        <InstagramShowcase />
      </main>
    </div>
  );
}
