"use client";

import Button from "@/components/ui/Button";
/*
 * Usamos la importación cliente de Spline porque Hero es "use client".
 * La importación /next es SOLO para React Server Components.
 */
import Spline from "@splinetool/react-spline";
import { HiArrowRight, HiPlay } from "react-icons/hi";

// ============================================================
//  HERO COMPONENT — GUÍA RÁPIDA DE EDICIÓN
// ============================================================
//  📌 POSICIÓN DEL TEXTO
//    • Toda la columna derecha vive en el <div> etiquetado
//      "COLUMNA DERECHA". Busca ese comentario abajo.
//    • `text-right`  → alinea el texto a la DERECHA
//    • `text-center` → alinea el texto al CENTRO
//    • `text-left`   → alinea el texto a la IZQUIERDA
//    • `items-end`   → los hijos se anclan al borde derecho
//    • `items-center`→ centrado horizontal
//    • `items-start` → anclado al borde izquierdo
//
//  📌 TAMAÑO DEL TEXTO
//    • Las clases de Tailwind van de texto-xs → texto-9xl
//    • Ejemplo: `text-5xl md:text-6xl lg:text-7xl`
//      (base 5xl | en tablets 6xl | en desktop 7xl)
//    • Para la línea "el futuro." busca el bloque <span italic>
//
//  📌 COLOR DEL TEXTO
//    • `text-[var(--brand-text)]`        → blanco/oscuro según tema
//    • `text-brand-accent`               → azul IEEE (#2563EB aprox)
//    • `text-[var(--brand-text-muted)]`  → gris suave
//    • Puedes usar cualquier color Tailwind: text-white, text-blue-400…
//
//  📌 ESPACIO ENTRE LÍNEAS (line-height)
//    • `leading-none`   → muy compacto (≈1)
//    • `leading-[0.95]` → aún más compacto (custom)
//    • `leading-tight`  → compacto (≈1.25)
//    • `leading-snug`   → cómodo (≈1.375)
//
//  📌 INTERLEADO/ESPACIADO ENTRE LETRAS (letter-spacing)
//    • `tracking-tighter` → muy junto
//    • `tracking-tight`   → junto
//    • `tracking-normal`  → normal
//    • `tracking-wide`    → espaciado
// ============================================================

const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 px-6 md:px-12 lg:px-24 min-h-[90vh] flex items-center overflow-hidden">

      {/* Fondo manejado globalmente en page.tsx */}

      {/* Contenido principal — relative z-10 para quedar encima del canvas de red neuronal */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* ── 2-column grid: Robot izquierda | Texto derecha ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">

          {/* ── COLUMNA IZQUIERDA: Robot 3D ── */}
          {/*
            👉 Tamaño del robot → cambia w-[...] y h-[...]
            👉 Moverlo a la izquierda (recortado) → aumenta el número de -ml-16 (ej: -ml-24)
            👉 Moverlo a la derecha → usa un valor menor de ml negativo o quítalo
          */}
          <div className="relative w-full h-[380px] md:h-[480px] lg:h-[620px] -ml-6 lg:-ml-16 overflow-hidden order-first">
            <Spline scene="https://prod.spline.design/bteTxASGaK5f18Hi/scene.splinecode" />
            {/* Etiqueta que cubre el badge "Built with Spline" */}
            <div className="absolute bottom-[16px] right-[16px] z-20 w-[150px] h-[42px] flex items-center justify-center rounded-full bg-brand-accent text-white text-xs font-bold tracking-widest select-none shadow-lg">
              IEEE CIS UNI
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════
              COLUMNA DERECHA — Título, descripción y botones
              ══════════════════════════════════════════════════════
            👉 POSICIÓN HORIZONTAL del bloque completo:
                 • Más cerca al borde derecho → aumenta `lg:pl-0` o elimina padding
                 • Más separado del robot     → sube `lg:pl-16`, `lg:pl-24`, etc.
            👉 ALINEACIÓN interna:
                 • `items-end`   y `text-right`   → todo pegado a la derecha  ✅ (actual)
                 • `items-start` y `text-left`    → todo pegado a la izquierda
                 • `items-center` y `text-center` → todo centrado
          */}
          <div className="flex flex-col items-end text-right w-full">
            {/*
              ┌─────────────────────────────────────────────────┐
              │  BADGE (etiqueta pequeña arriba del título)     │
              │  👉 Texto → edita el string dentro del <div>   │
              │  👉 Tamaño → cambia `text-sm` a `text-base`    │
              │  👉 Color de fondo → `bg-white/5` (opacidad)   │
              └─────────────────────────────────────────────────┘
            */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 text-[var(--brand-text-muted)] text-sm font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse flex-shrink-0" />
              Capítulo Estudiantil IEEE CIS UNI
            </div>

            {/*
              ┌──────────────────────────────────────────────────────────┐
              │  TÍTULO PRINCIPAL                                        │
              │  Estructura: 3 líneas                                    │
              │    1. "Inteligencia"     → blanco, normal                │
              │    2. "que transforma"   → blanco, normal                │
              │    3. "el futuro."       → azul (brand-accent), itálica  │
              │                                                          │
              │  👉 TAMAÑO global del título:                            │
              │     Cambia las 3 clases: text-5xl md:text-6xl lg:text-7xl│
              │     Valores: text-4xl / 5xl / 6xl / 7xl / 8xl / 9xl     │
              │                                                          │
              │  👉 TAMAÑO de una línea específica:                      │
              │     Agrega una clase al <span> de esa línea              │
              │     ej: <span className="block text-[120px] ...">        │
              │                                                          │
              │  👉 COLOR por línea:                                     │
              │     Línea blanca  → `text-[var(--brand-text)]`           │
              │     Línea azul    → `text-brand-accent`                  │
              │     Color custom  → `text-[#FF5733]`                     │
              │                                                          │
              │  👉 LÍNEA AZUL más grande (como en la imagen):           │
              │     Busca el <span "el futuro."> y añade lg:text-8xl     │
              │                                                          │
              │  👉 INTERLINEADO entre líneas: ajusta `leading-[0.95]`   │
              │     0.85 = muy compacto | 1.0 = normal | 1.2 = cómodo   │
              └──────────────────────────────────────────────────────────┘
            */}
            <h1 className="font-extrabold leading-[1] tracking-tight mb-8 text-5xl md:text-6xl lg:text-7xl">

              {/* Línea 1 — "Inteligencia" (blanca) */}
              {/* 👉 Color: cambia `text-[var(--brand-text)]` por otro color */}
              {/* 👉 Posición independiente: agrega mt-[Npx] o mb-[Npx] */}
              <span className="block text-[var(--brand-text)]">
                Inteligencia
              </span>

              {/* Línea 2 — "que transforma" (blanca) */}
              <span className="block text-[var(--brand-text)]">
                que transforma
              </span>

              {/* Línea 3 — "el futuro." (azul + itálica) */}
              {/* 👉 Para hacerla más grande que las otras: agrega `lg:text-8xl` aquí */}
              {/* 👉 Para quitar la itálica: elimina la clase `italic` */}
              {/* 👉 Color: `text-brand-accent` = azul IEEE */}
              <span className="block italic text-brand-accent lg:text-[130px]">
                el futuro.
              </span>
            </h1>

            {/*
              ┌──────────────────────────────────────────────────────────┐
              │  PÁRRAFO DESCRIPTIVO                                     │
              │  👉 Ancho máximo → `max-w-sm` (estrecho) | `max-w-lg`   │
              │  👉 Color → `text-[var(--brand-text-muted)]` (gris)      │
              │  👉 Tamaño → `text-base` normal | `text-lg` grande       │
              │  👉 Peso   → `font-light` delgado | `font-normal` normal  │
              └──────────────────────────────────────────────────────────┘
            */}
            <p className="text-base md:text-lg text-[var(--brand-text-muted)] max-w-xl leading-relaxed mb-10 font-light">
              Impulsamos el estudio, la investigación y la aplicación de la
              inteligencia artificial, redes neuronales y computación evolutiva
              para resolver los desafíos del mundo real.
            </p>

            {/*
              ┌──────────────────────────────────────────────────────────┐
              │  BOTONES                                                 │
              │  👉 Separación entre botones: cambia `gap-3` → `gap-5`  │
              │  👉 Texto del botón → edita dentro de cada <Button>     │
              └──────────────────────────────────────────────────────────┘
            */}
            <div className="flex flex-wrap gap-3 justify-end">
              {/* Botón primario — sólido azul */}
              <Button
                size="lg"
                className="rounded-full px-8 shadow-lg shadow-brand-accent/25 font-semibold"
                icon={<HiArrowRight />}
              >
                Explorar Proyectos
              </Button>

              {/* Botón secundario — semi-transparente con icono play */}
              <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/8 border border-white/10 text-[var(--brand-text)] text-lg font-semibold hover:bg-white/15 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <HiPlay size={10} className="ml-0.5" />
                </span>
                Conócenos
              </button>
            </div>

          </div>
          {/* ── FIN COLUMNA DERECHA ── */}

        </div>
      </div>
    </section>
  );
};

export default Hero;