import { HiUser } from "react-icons/hi";

/** Ruta histórica de la imagen genérica; si llega esta (o nada), se dibuja el reemplazo con el tema. */
export const MEMBER_PLACEHOLDER = "/images/placeholder-member.png";

/**
 * Reemplazo para miembros sin foto. Antes era una imagen fija casi negra que
 * en modo claro quedaba como un hueco oscuro; ahora usa los colores del tema.
 * Debe ir dentro de un contenedor `relative` con tamaño.
 */
export default function MemberPlaceholder({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="absolute inset-0 flex items-end justify-center overflow-hidden bg-[var(--brand-surface)] text-brand-accent-text/40"
    >
      <HiUser className="h-[82%] w-[82%] translate-y-[6%]" />
    </div>
  );
}
