"use client";

import { useSyncExternalStore } from "react";

// Mismo breakpoint que `lg:` de Tailwind.
const QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * true en pantallas de escritorio (≥1024px).
 * En el servidor y durante la hidratación devuelve false, así que el contenido
 * pesado (p. ej. escenas 3D de Spline) solo se monta en el cliente de escritorio
 * y nunca se descarga en celulares.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
