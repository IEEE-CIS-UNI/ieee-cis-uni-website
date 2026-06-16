"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventCard from "@/components/ui/EventCard";
import { HiSearch, HiCalendar } from "react-icons/hi";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/database";

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha', { ascending: false });

        if (!ignore) {
          if (error) throw error;
          if (data) setEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(events.map(e => e.categoria?.toUpperCase()).filter((c): c is string => !!c)));
    return ["TODOS", ...cats].sort((a, b) => {
      if (a === "TODOS") return -1;
      if (b === "TODOS") return 1;
      return a.localeCompare(b);
    });
  }, [events]);

  const formatDate = (dateStr: string) => {
    const utcDate = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00Z`;
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    return new Date(utcDate).toLocaleDateString('es-ES', options);
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === "TODOS" || event.categoria?.toUpperCase() === filter;
    const matchesSearch = event.titulo.toLowerCase().includes(search.toLowerCase()) || 
                          (event.ponente || "").toLowerCase().includes(search.toLowerCase()) ||
                          (event.ubicacion || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative min-h-[60vh]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Toolbar: Search and Filters Stacked */}
        <div className="flex flex-col items-center mb-16 gap-8">
          <div className="relative w-full max-w-xl group">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)] opacity-50 group-focus-within:text-brand-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por evento, ponente o lugar..."
              className="w-full bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] rounded-full py-4 pl-12 pr-6 text-[var(--brand-text)] placeholder:text-[var(--brand-text-muted)] focus:outline-none focus:border-brand-accent/50 focus:bg-[var(--brand-surface)] transition-all text-center"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 sm:px-8 py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border tracking-widest ${
                  filter === cat 
                  ? "bg-brand-accent border-brand-accent text-white" 
                  : "bg-transparent border-[var(--brand-border)] text-[var(--brand-text-muted)] opacity-70 hover:opacity-100 hover:border-brand-accent/30 hover:text-[var(--brand-text)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Feed */}
        {loading ? (
          <div className="flex flex-col gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-48 bg-[var(--brand-card)] backdrop-blur-md rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <EventCard 
                      title={event.titulo}
                      date={formatDate(event.fecha)}
                      time={event.hora || "TBD"}
                      location={event.ubicacion}
                      speaker={event.ponente || "Por confirmar"}
                      category={event.categoria || "EVENTO"}
                      status={event.is_past ? "Past" : "Upcoming"}
                      link={event.link_registro || "#"}
                      imageUrl={event.image_url}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-32 border border-dashed border-[var(--brand-border)] backdrop-blur-md rounded-[3rem]">
                <div className="w-20 h-20 bg-[var(--brand-card)] rounded-3xl flex items-center justify-center text-[var(--brand-text-muted)] opacity-50 mx-auto mb-6 shadow-sm">
                  <HiCalendar size={40} />
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-text)] mb-2 uppercase tracking-widest">Sin eventos</h3>
                <p className="text-[var(--brand-text-muted)] opacity-70 max-w-xs mx-auto">No hay eventos programados en esta categoría por el momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventList;
