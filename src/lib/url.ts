/**
 * Normaliza URLs que vienen de Supabase (escritas a mano en el panel).
 *
 * - null / vacío / "#"            → null (el llamador decide no mostrar el enlace)
 * - "htttps://", "https:/x", etc. → "https://"
 * - "www.linkedin.com/in/..."     → "https://www.linkedin.com/in/..."
 * - rutas internas ("/proyectos") → se devuelven tal cual
 */
export function normalizeUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value || value === "#") return null;

  if (value.startsWith("/") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }

  // Corrige protocolos mal escritos: "htttps://", "http:/", "https:///"
  const fixed = value.replace(/^h+t+p+(s?):\/*/i, (_m, s: string) => `http${s.toLowerCase()}://`);
  if (/^https?:\/\//i.test(fixed)) return fixed;

  return `https://${fixed}`;
}

/** true si el enlace sale del sitio (debe abrirse en una pestaña nueva). */
export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
