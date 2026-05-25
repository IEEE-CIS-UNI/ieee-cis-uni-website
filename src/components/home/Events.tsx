"use client";

import { useState, useEffect } from "react";
import EventTicket from "@/components/ui/EventTicket";
import Button from "@/components/ui/Button";
import { HiArrowRight, HiCalendar } from "react-icons/hi";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/database";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchUpcomingEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .eq('is_past', false)
          .order('fecha', { ascending: true })
          .limit(3);

        if (!ignore) {
          if (error) throw error;
          if (data) setEvents(data);
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
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      
      {/*
       * FONDO ORBE — "respiración" suave via CSS puro.
       * hero-orb-a: ciclo 8s  |  hero-orb-b: ciclo 11s (desfasado)
       * Orbe izquierdo: azul IEEE | Orbe derecho: violeta tecnológico
       */}
      <div className="hero-orb-a absolute top-1/3 -left-32 w-[500px] h-[500px] bg-brand-accent rounded-full blur-[130px] -z-10" />
      <div className="hero-orb-b absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-[120px] -z-10" style={{ backgroundColor: "#7C3AED" }} />

      {/* Contenido principal — relative z-10 para quedar encima de los orbes */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
            Próximos Eventos
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Eventos que{" "}
            <em className="not-italic italic text-brand-accent text-5xl md:text-6xl lg:text-7xl font-extrabold">
              Inspiran
            </em>
          </h3>
          <p className="text-[var(--brand-text-muted)] text-lg">
            Únete a nuestras actividades y potencia tus conocimientos con los líderes en tecnología de la UNI.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-full h-40 bg-[var(--brand-card)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {events.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventTicket 
                    title={event.titulo}
                    date={formatDate(event.fecha)}
                    time={event.hora || "TBD"}
                    location={event.ubicacion}
                    speaker={event.ponente || "Por confirmar"}
                    category={event.categoria || "EVENTO"}
                    status="Upcoming"
                    link={event.link_registro || "#"}
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

        <div className="text-center mt-16">
          <Button href="/eventos" variant="outline" icon={<HiArrowRight />}>
            Ver calendario completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Events;
