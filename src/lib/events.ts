import { Event } from "@/types/database";

/** Fecha de hoy en Lima como "YYYY-MM-DD" (mismo formato que `eventos.fecha`). */
export function todayInLima(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

/**
 * Un evento está finalizado si se marcó `is_past` en Supabase o si su fecha ya pasó.
 * Así no depende de que alguien actualice el flag a mano.
 */
export function isPastEvent(event: Pick<Event, "fecha" | "is_past">): boolean {
  return event.is_past || event.fecha.slice(0, 10) < todayInLima();
}
