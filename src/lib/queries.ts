import { supabase } from "@/lib/supabase";
import { todayInLima } from "@/lib/events";
import type { BlogPost, Event, Member, Project } from "@/types/database";

/**
 * Consultas a Supabase hechas en el servidor.
 *
 * Las páginas las usan para mandar los datos ya incluidos en el HTML: así el
 * contenido (y sus imágenes) aparece desde el primer pintado, sin esperar a que
 * cargue el JavaScript. Antes cada sección pedía sus datos desde el navegador y,
 * en un celular lento, el contenido llegaba varios segundos tarde.
 *
 * Son las MISMAS consultas que hacen los componentes (que además siguen
 * consultando en segundo plano para mostrar cambios recientes al recargar).
 * Si una consulta falla devuelve `null` y el componente vuelve a pedir los
 * datos él mismo, como antes.
 */

export type BlogPostWithAuthor = BlogPost & { author?: { nombre: string } };

async function run<T>(label: string, query: PromiseLike<{ data: T | null; error: unknown }>): Promise<T | null> {
  try {
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error en la consulta del servidor (${label}):`, error);
    return null;
  }
}

/* ── Inicio ── */

export const getBoardMembers = () =>
  run<Member[]>("miembros BOARD", supabase.from("miembros").select("*").eq("categoria", "BOARD").order("orden", { ascending: true }));

export const getFeaturedProjects = () =>
  run<Project[]>("proyectos destacados", supabase.from("proyectos").select("*").eq("highlighted", true).limit(3));

export const getRecentPosts = () =>
  run<BlogPostWithAuthor[]>(
    "blog recientes",
    supabase.from("blog").select("*, author:miembros(nombre)").eq("published", true).order("created_at", { ascending: false }).limit(2),
  );

/** Próximos eventos; si no hay, los 3 más recientes (igual que la sección del Inicio). */
export async function getHomeEvents(): Promise<{ events: Event[]; showingPast: boolean } | null> {
  const upcoming = await run<Event[]>(
    "eventos próximos",
    supabase.from("eventos").select("*").eq("is_past", false).gte("fecha", todayInLima()).order("fecha", { ascending: true }).limit(3),
  );
  if (upcoming === null) return null;
  if (upcoming.length > 0) return { events: upcoming, showingPast: false };

  const recent = await run<Event[]>("eventos recientes", supabase.from("eventos").select("*").order("fecha", { ascending: false }).limit(3));
  if (recent === null) return null;
  return { events: recent, showingPast: recent.length > 0 };
}

/* ── Listados ── */

export const getAllProjects = () =>
  run<Project[]>("proyectos", supabase.from("proyectos").select("*").order("created_at", { ascending: false }));

export const getAllPosts = () =>
  run<BlogPostWithAuthor[]>(
    "blog",
    supabase.from("blog").select("*, author:miembros(nombre)").eq("published", true).order("created_at", { ascending: false }),
  );

export const getAllMembers = () =>
  run<Member[]>("miembros", supabase.from("miembros").select("*").order("orden", { ascending: true }));

/** Todos los eventos, del más reciente al más antiguo (la lista; el calendario los reordena). */
export const getAllEvents = () =>
  run<Event[]>("eventos", supabase.from("eventos").select("*").order("fecha", { ascending: false }));

/* ── Carruseles (Storage) ── */

/** URLs públicas de las imágenes de una carpeta, en orden alfabético (máx. 10), como los carruseles. */
export async function getStorageImages(bucket: string, folder = ""): Promise<string[] | null> {
  const files = await run(
    `storage ${bucket}/${folder}`,
    supabase.storage.from(bucket).list(folder, { limit: 10, sortBy: { column: "name", order: "asc" } }),
  );
  if (files === null) return null;
  return files
    .filter((f) => f.name !== ".emptyFolderPlaceholder" && f.name !== folder)
    .map((f) => supabase.storage.from(bucket).getPublicUrl(folder ? `${folder}/${f.name}` : f.name).data.publicUrl);
}
