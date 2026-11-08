"use client";

import { MotionConfig } from "framer-motion";

/**
 * Hace que todas las animaciones de Framer Motion respeten "reducir movimiento"
 * del sistema: se quitan los desplazamientos y escalas, pero se mantienen los
 * fundidos de opacidad, así el contenido sigue apareciendo con suavidad.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
