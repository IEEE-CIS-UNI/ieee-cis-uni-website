"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/ui/EventCard";
import Button from "@/components/ui/Button";
import { HiArrowRight, HiCalendar } from "react-icons/hi";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/database";
import { todayInLima } from "@/lib/events";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  // true cuando no hay eventos futuros y se muestran los más recientes
  const [showingPast, setShowingPast] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchUpcomingEvents = async () => {
      try {
        // "Próximos" se decide por la fecha, no solo por el flag is_past
        // (que hay que actualizar a mano en Supabase).
        const today = todayInLima();
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .eq('is_past', false)
          .gte('fecha', today)
          .order('fecha', { ascending: true })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          if (!ignore) setEvents(data);
          return;
        }

        // Sin eventos próximos: mostrar los últimos realizados en vez de una sección vacía.
        const { data: recent, error: recentError } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha', { ascending: false })
          .limit(3);

        if (recentError) throw recentError;
        if (!ignore && recent) {
          setEvents(recent);
          setShowingPast(recent.length > 0);
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchUpcomingEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const utcDate = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00Z`;
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    return new Date(utcDate).toLocaleDateString('es-ES', options);
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const ticketVariants: Variants = {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, type: "spring", bounce: 0.3 } }
  };

  const ctaVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.5 } }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">

      {/* Contenido principal — relative z-10 para quedar encima de los orbes */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          variants={headerVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold text-brand-accent-text uppercase tracking-widest mb-4">
            {showingPast ? "Eventos Recientes" : "Próximos Eventos"}
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
            Eventos que{" "}
            <em className="not-italic italic text-brand-accent-text text-5xl md:text-6xl lg:text-7xl font-extrabold">
              Inspiran
            </em>
          </h3>
          <p className="text-[var(--brand-text-muted)] text-lg">
            Participa en nuestros seminarios, talleres y conferencias. Conecta con expertos y expande tu conocimiento.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-[400px] bg-[var(--brand-card)] rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {events.map((event) => (
                <motion.div key={event.id} variants={ticketVariants} className="h-full">
                  <EventCard 
                    title={event.titulo}
                    date={formatDate(event.fecha)}
                    time={event.hora || "TBD"}
                    location={event.ubicacion}
                    speaker={event.ponente || "Por confirmar"}
                    category={event.categoria || "EVENTO"}
                    status={showingPast ? "Past" : "Upcoming"}
                    link={event.link_registro}
                    imageUrl={event.image_url}
                  />
                </motion.div>
              ))}
            </motion.div>

            {events.length === 0 && (
              <div className="text-center py-20 border border-dashed border-[var(--brand-border)] rounded-3xl">
                <div className="w-16 h-16 bg-[var(--brand-card)] rounded-2xl flex items-center justify-center text-[var(--brand-text-muted)] mx-auto mb-4">
                  <HiCalendar size={32} />
                </div>
                <p className="text-[var(--brand-text-muted)]">No hay eventos programados próximamente.</p>
              </div>
            )}
          </>
        )}

        <motion.div 
          variants={ctaVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button href="/eventos" variant="outline" icon={<HiArrowRight />}>
            Ver calendario completo
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
