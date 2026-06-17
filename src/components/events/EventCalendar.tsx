"use client";

import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight, HiCalendar } from "react-icons/hi";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/database";
import EventTicket from "@/components/ui/EventTicket";

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Constants
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    let ignore = false;
    
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('eventos')
          .select('*')
          .order('fecha', { ascending: true });

        if (error) throw error;
        
        if (!ignore && data) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events for calendar:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      ignore = true;
    };
  }, []);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  // Helper to get events for a specific day
  const getEventsForDay = (day: number) => {
    const targetDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.fecha.startsWith(targetDateStr));
  };

  // Helper to get events for the currently selected date
  const selectedDateEvents = selectedDate 
    ? getEventsForDay(selectedDate.getDate())
    : [];

  const formatDate = (dateStr: string) => {
    // Treat the date string as UTC and format it in UTC to avoid any local timezone shifts
    const utcDate = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00Z`;
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    return new Date(utcDate).toLocaleDateString('es-ES', options);
  };

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--brand-text)] mb-4 tracking-tighter uppercase">
            Calendario de <span className="text-brand-accent">Actividades</span>
          </h2>
          <p className="text-[var(--brand-text-muted)] opacity-80 max-w-2xl mx-auto">
            Explora las fechas clave de nuestra comunidad. Haz clic en los días marcados para ver el detalle de cada evento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: The Calendar */}
          <div className="lg:col-span-2 bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] shadow-2xl rounded-[3rem] p-8 md:p-12">
            
            {/* Header controls */}
            <div className="flex items-center justify-between mb-10">
              <button 
                onClick={prevMonth}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--brand-surface)] text-[var(--brand-text)] hover:text-brand-accent hover:-translate-x-1 transition-all"
              >
                <HiChevronLeft size={24} />
              </button>
              
              <h3 className="text-2xl font-black text-[var(--brand-text)] uppercase tracking-widest">
                {monthNames[currentMonth]} <span className="text-brand-accent">{currentYear}</span>
              </h3>
              
              <button 
                onClick={nextMonth}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--brand-surface)] text-[var(--brand-text)] hover:text-brand-accent hover:translate-x-1 transition-all"
              >
                <HiChevronRight size={24} />
              </button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="text-center font-bold text-[var(--brand-text-muted)] text-xs tracking-widest uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12 md:h-16" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const isSelected = selectedDate?.getDate() === day;
                const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => handleDayClick(day)}
                    className={`relative h-12 md:h-16 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'bg-brand-accent text-white shadow-[0_0_20px_rgba(6,107,243,0.4)]'
                        : hasEvents
                          ? 'bg-[var(--brand-surface)] text-[var(--brand-text)] border border-brand-accent/30 hover:border-brand-accent'
                          : 'text-[var(--brand-text)] hover:bg-[var(--brand-surface)]'
                    }`}
                  >
                    <span className={`text-sm md:text-lg font-bold ${isToday && !isSelected ? 'text-brand-accent' : ''}`}>
                      {day}
                    </span>

                    {hasEvents && (
                      <div className="absolute bottom-2 flex gap-1">
                        {dayEvents.map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-brand-accent'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Day Events */}
          <div className="lg:col-span-1 relative">
            {/* Panel: date selected */}
            <div className={`transition-all duration-300 ${selectedDate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 pointer-events-none absolute inset-0'} h-full`}>
              {selectedDate && (
                <>
                  <h4 className="text-xl font-bold text-[var(--brand-text)] mb-6 flex items-center gap-2">
                    <HiCalendar className="text-brand-accent" />
                    {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
                  </h4>

                  {selectedDateEvents.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      {selectedDateEvents.map((event) => (
                        <div key={event.id} className="scale-90 origin-top">
                          <EventTicket
                            title={event.titulo}
                            date={formatDate(event.fecha)}
                            time={event.hora || "TBD"}
                            location={event.ubicacion}
                            speaker={event.ponente || "Por confirmar"}
                            category={event.categoria || "EVENTO"}
                            status={event.is_past ? "Past" : "Upcoming"}
                            link={event.link_registro || "#"}
                            imageUrl={event.image_url}
                            variant="compact"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] shadow-sm rounded-[2rem] p-8 text-center">
                      <p className="text-[var(--brand-text-muted)] opacity-80">
                        No hay eventos programados para este día.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Panel: no date selected */}
            <div className={`transition-all duration-300 ${!selectedDate ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'} h-full flex flex-col items-center justify-center bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] shadow-sm rounded-[3rem] p-12 text-center`}>
              <div className="w-20 h-20 bg-[var(--brand-surface)] rounded-full flex items-center justify-center mb-6 text-[var(--brand-text-muted)] opacity-50">
                <HiCalendar size={32} />
              </div>
              <h4 className="text-[var(--brand-text)] font-bold text-lg mb-2">Selecciona un día</h4>
              <p className="text-[var(--brand-text-muted)] opacity-70 text-sm">
                Haz clic en cualquier día del calendario para ver los eventos programados.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
