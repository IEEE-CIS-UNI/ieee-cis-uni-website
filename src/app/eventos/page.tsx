import EventHero from "@/components/events/EventHero";
import EventCalendar from "@/components/events/EventCalendar";
import EventList from "@/components/events/EventList";
import InstagramShowcase from "@/components/events/InstagramShowcase";
import BrandOrbs from "@/components/ui/BrandOrbs";
import { getAllEvents, getStorageImages } from "@/lib/queries";

// Los datos se piden en el servidor y van en el HTML (ver src/lib/queries.ts).
// Se regenera como máximo cada 60 s; los componentes además consultan en segundo
// plano, así un cambio en Supabase se ve al recargar como antes.
export const revalidate = 60;

export const metadata = {
  title: "Eventos",
  description: "Participa en nuestros próximos workshops, conferencias y competencias. Sé parte de la comunidad de Inteligencia Computacional de la UNI.",
};

export default async function EventosPage() {
  const [heroImages, events] = await Promise.all([getStorageImages("hero-eventos"), getAllEvents()]);

  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      {/* Fondo de Orbes fijo global (estilo Home) */}
      <BrandOrbs />

      <main className="relative z-10">
        <EventHero initialImages={heroImages} />
        <EventCalendar initialEvents={events} />
        <EventList initialEvents={events} />
        <InstagramShowcase />
      </main>
    </div>
  );
}
