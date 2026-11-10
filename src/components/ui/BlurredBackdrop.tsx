import Image from "next/image";

/**
 * Fondo difuminado hecho con la misma imagen (relleno detrás de fotos
 * verticales u horizontales en tarjetas y detalles).
 *
 * Antes era un `background-image` con la URL original: el navegador bajaba el
 * archivo completo (hasta ~600 KB por foto) aunque se viera borroso al 25–30 %.
 * En /eventos eran ~7 MB en celular. Como va desenfocado, basta una versión
 * optimizada de 48 px (unos pocos KB), con carga diferida.
 *
 * Debe ir dentro de un contenedor `relative` (usa `fill`).
 */
export default function BlurredBackdrop({ src, className = "" }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      fill
      sizes="48px"
      className={`object-cover pointer-events-none ${className}`}
    />
  );
}
