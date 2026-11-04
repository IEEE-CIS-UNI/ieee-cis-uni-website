import { Member } from "@/types/database";
import { normalizeUrl } from "@/lib/url";

/** Autor ya resuelto, listo para mostrar en la página del proyecto. */
export type ProjectAuthor = {
  nombre: string;
  /** Rol dentro del proyecto, escrito entre paréntesis en Supabase */
  rol: string | null;
  image_url: string | null;
  linkedin: string | null;
  /** true si el nombre coincidió con alguien de la tabla `miembros` */
  esMiembro: boolean;
};

type MemberLite = Pick<Member, "nombre" | "image_url" | "linkedin">;

/** "Camila Ceferino (Frontend)" → { nombre: "Camila Ceferino", rol: "Frontend" } */
export function parseAuthor(raw: string): { nombre: string; rol: string | null } {
  const value = raw.trim();
  const match = value.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
  if (match && match[1].trim()) {
    return { nombre: match[1].trim(), rol: match[2].trim() || null };
  }
  return { nombre: value, rol: null };
}

/** Minúsculas, sin tildes y separado en palabras: "Martín  Puicón" → ["martin", "puicon"] */
function tokens(name: string): string[] {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9ñ]+/)
    .filter(Boolean);
}

/**
 * Busca al miembro cuyo nombre coincide con el autor. Ignora tildes y mayúsculas,
 * y acepta nombres más largos o más cortos ("Camila Ceferino Velasquez" ↔
 * "Camila Ceferino") siempre que coincidan al menos 2 palabras, para que un solo
 * nombre de pila como "Luis" no se asigne a la persona equivocada.
 */
export function findMember<T extends MemberLite>(nombre: string, members: T[]): T | undefined {
  const a = tokens(nombre);
  if (a.length === 0) return undefined;

  return members.find((m) => {
    const b = tokens(m.nombre);
    const [shorter, longer] = a.length <= b.length ? [a, b] : [b, a];
    return shorter.length >= 2 && shorter.every((t) => longer.includes(t));
  });
}

/** Convierte la lista de Supabase en autores, completando foto y LinkedIn de los miembros. */
export function resolveAuthors(raw: string[] | null | undefined, members: MemberLite[]): ProjectAuthor[] {
  return (raw ?? [])
    .filter((r): r is string => typeof r === "string" && r.trim().length > 0)
    .map((r) => {
      const { nombre, rol } = parseAuthor(r);
      const member = findMember(nombre, members);
      return {
        nombre: member?.nombre ?? nombre,
        rol,
        image_url: member?.image_url ?? null,
        linkedin: normalizeUrl(member?.linkedin),
        esMiembro: Boolean(member),
      };
    });
}
