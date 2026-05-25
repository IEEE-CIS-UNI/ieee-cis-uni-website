"use client";

/**
 * About — Sección "Sobre Nosotros"
 * ─────────────────────────────────────────────────────────────────────────────
 * Cambios respecto a la versión anterior:
 *
 * 1. ORTOGRAFÍA CORREGIDA
 *    "capitulo" → "capítulo"  |  "Ingenieria" → "Ingeniería"
 *
 * 2. JERARQUÍA VISUAL EN EL TÍTULO
 *    La palabra "Innovación" usa <em> con font-serif + italic + text-brand-accent
 *    para destacarla visualmente (mismo truco que "el futuro" en el Hero).
 *
 * 3. MEJOR LEGIBILIDAD
 *    El párrafo descriptivo pasa de text-[var(--brand-text-muted)]
 *    a text-white/75 para mejor contraste en fondo oscuro.
 *
 * 4. FONDO INTERACTIVO DE RED NEURONAL
 *    <NeuralNetworkBackground> se monta como capa absoluta con pointer-events:none.
 *    El canvas escucha los eventos mousemove de la sección y atrae nodos al cursor.
 *    La sección tiene position:relative + overflow:hidden para contener el canvas.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Button from "@/components/ui/Button";
import ValueItem from "@/components/ui/ValueItem";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";
import { HiUsers, HiBookOpen, HiLightBulb, HiGlobeAlt, HiChevronRight } from "react-icons/hi";

const About = () => {
  const values = [
    {
      title: "Comunidad",
      description: "Unimos estudiantes apasionados por la inteligencia computacional.",
      icon: HiUsers,
    },
    {
      title: "Aprendizaje",
      description: "Impulsamos el aprendizaje continuo a través de talleres, charlas y seminarios.",
      icon: HiBookOpen,
    },
    {
      title: "Innovación",
      description: "Desarrollamos proyectos que generen impacto en la sociedad.",
      icon: HiLightBulb,
    },
    {
      title: "Impacto",
      description: "Contribuimos al avance tecnológico y al desarrollo del país.",
      icon: HiGlobeAlt,
    },
  ];

  return (
    /*
     * position:relative + overflow:hidden → necesarios para contener
     * el canvas de NeuralNetworkBackground dentro de la sección.
     */
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-[var(--brand-surface)] overflow-hidden">

      {/* ── Fondo dinámico: red neuronal interactiva ────────────────────────
           El canvas ocupa toda la sección (absolute inset-0).
           pointer-events:none en el propio canvas garantiza que no
           bloquee ningún click ni interacción del usuario.
      ─────────────────────────────────────────────────────────────────── */}
      <NeuralNetworkBackground />

      {/* Capa de difuminado general sobre el canvas para dar el efecto blur */}
      <div className="absolute inset-0 pointer-events-none backdrop-blur-[8px] bg-[var(--brand-surface)]/10" />

      {/* Capa de degradado sobre el canvas para que el texto sea legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, transparent 40%, var(--brand-surface) 80%)",
        }}
      />

      {/* ── Contenido principal ── */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Columna izquierda: texto fijo (sticky) ── */}
          <div className="lg:sticky lg:top-32 text-center lg:text-left">

            {/* Eyebrow label */}
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
              Sobre Nosotros
            </h2>

            {/*
             * Título principal con jerarquía visual
             * ─ "Innovación" → italic text-brand-accent text-5xl md:text-6xl
             *   Mismo estilo que "el futuro." en Hero.tsx:
             *   Poppins italic (no serif) + azul + más grande que el resto
             */}
            <h3 className="text-4xl md:text-5xl font-bold text-[var(--brand-text)] mb-6 leading-tight">
              Compromiso con la Excelencia e{" "}
              <em className="not-italic italic text-brand-accent text-5xl md:text-6xl lg:text-7xl font-extrabold">
                Innovación
              </em>
            </h3>

            {/*
             * Párrafo descriptivo
             * ─ text-white/75 en lugar de text-[var(--brand-text-muted)]
             *   para mejor legibilidad y contraste con el fondo oscuro.
             * ─ Ortografía corregida: "capítulo" e "Ingeniería"
             */}
            <p className="text-white/75 text-lg leading-relaxed mb-8 mx-auto lg:mx-0 max-w-xl">
              El capítulo IEEE Computational Intelligence Society de la
              Universidad Nacional de Ingeniería (IEEE CIS UNI) tiene como
              misión fomentar el conocimiento, la investigación y la innovación
              en las áreas de inteligencia computacional, redes neuronales y
              computación evolutiva.
            </p>

            {/*
             * Botón CTA "Saber más"
             * ─ Variant outline con el borde reforzado (ver Button.tsx)
             * ─ Flecha animada al hover gracias al grupo del Button
             */}
            <div className="flex justify-center lg:justify-start">
              <Button href="/nosotros" variant="outline" icon={<HiChevronRight />}>
                Saber más
              </Button>
            </div>
          </div>

          {/* ── Columna derecha: pilares de valor ── */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {values.map((value, index) => (
              <ValueItem
                key={index}
                title={value.title}
                description={value.description}
                icon={value.icon}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
