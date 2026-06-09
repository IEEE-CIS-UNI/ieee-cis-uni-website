"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EventTicket from "@/components/ui/EventTicket";
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
          .order('fecha', { ascending: true });

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
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
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
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por evento, ponente o lugar..."
              className="w-full bg-brand-secondary/10 border border-white/5 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-accent/50 focus:bg-brand-secondary/20 transition-all text-center"
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
                  : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
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
              <div key={i} className="w-full h-48 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-10">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <EventTicket 
                      title={event.titulo}
                      date={formatDate(event.fecha)}
                      time={event.hora || "TBD"}
                      location={event.ubicacion}
                      speaker={event.ponente || "Por confirmar"}
                      category={event.categoria || "EVENTO"}
                      status={event.is_past ? "Past" : "Upcoming"}
                      link={event.link_registro || "#"}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mx-auto mb-6">
                  <HiCalendar size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Sin eventos</h3>
                <p className="text-white/40 max-w-xs mx-auto">No hay eventos programados en esta categoría por el momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventList;
