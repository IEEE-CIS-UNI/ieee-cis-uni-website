/**
 * Fondo de marca compartido por todas las páginas: orbe azul (izquierda) y
 * orbe morado (derecha), fijos detrás del contenido.
 *
 * Va como primer hijo de la página. El contenedor de la página no debe tener
 * fondo propio (el color base lo pone <body>), porque un fondo en el contenedor
 * taparía los orbes (-z-20).
 *
 * La animación y la opacidad por tema viven en globals.css (.hero-orb-a/b):
 * en modo claro son más tenues para que el texto mantenga 4.5:1, y en celular
 * quedan quietos.
 */
export default function BrandOrbs() {
  return (
    <>
      <div
        aria-hidden="true"
        className="hero-orb-a fixed top-1/4 -left-20 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[160px] opacity-50 -z-20 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="hero-orb-b fixed bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 -z-20 pointer-events-none"
        style={{ backgroundColor: "#7C3AED" }}
      />
    </>
  );
}
