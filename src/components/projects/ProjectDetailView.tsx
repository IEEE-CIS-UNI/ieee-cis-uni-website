"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { HiArrowLeft, HiOutlineExternalLink, HiCode, HiLightningBolt, HiUserGroup } from "react-icons/hi";
import { FaLinkedin } from "react-icons/fa";
import Image from "next/image";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";
import { Project } from "@/types/database";
import { normalizeUrl } from "@/lib/url";
import { ProjectAuthor } from "@/lib/authors";
import BrandOrbs from "@/components/ui/BrandOrbs";

interface ProjectDetailViewProps {
  project: Project;
  /** Equipo del proyecto, ya cruzado con la tabla `miembros` (ver src/lib/authors.ts) */
  authors?: ProjectAuthor[];
}

const ProjectDetailView = ({ project, authors = [] }: ProjectDetailViewProps) => {
  const githubLink = normalizeUrl(project.github_link);
  const demoLink = normalizeUrl(project.demo_link);

  return (
    <div className="relative overflow-hidden about-page-bg min-h-svh">
      {/* Mismo fondo de marca que el Inicio; la red neuronal va encima */}
      <BrandOrbs />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground />
        <div className="absolute inset-0 md:backdrop-blur-[2px] bg-[var(--brand-accent)]/5" />
        <div className="absolute inset-0 about-radial-gradient" />
      </div>

      <main className="relative z-10 min-h-svh pt-32 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button href="/proyectos" variant="outline" size="sm" className="mb-12" icon={<HiArrowLeft />}>
            Volver
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 mb-8">
              {(project.tags || []).map(tag => (
                <span key={tag} className="max-w-full break-words text-[11px] font-black text-brand-accent-text bg-brand-accent/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-accent/20">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[var(--brand-text)] mb-8 tracking-tighter uppercase leading-none break-words">
              {project.titulo}
            </h1>

            <div className="h-1 w-20 bg-brand-accent mb-10" />

            <p className="text-[var(--brand-text-muted)] text-base md:text-lg leading-relaxed mb-12 whitespace-pre-wrap font-medium">
              {project.descripcion_larga || project.descripcion_corta}
            </p>

            {(githubLink || demoLink) && (
              <div className="flex flex-wrap gap-4 md:gap-6 p-5 md:p-8 rounded-3xl md:rounded-[2rem] bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)]">
                {githubLink && (
                  <Button href={githubLink} variant="outline" icon={<HiCode />} className="flex-1 min-w-[200px] justify-center bg-[var(--brand-surface)]">
                    Ver Repositorio
                  </Button>
                )}
                {demoLink && (
                  <Button href={demoLink} icon={<HiOutlineExternalLink />} className="flex-1 min-w-[200px] justify-center">
                    Ver Demo Live
                  </Button>
                )}
              </div>
            )}

            {/* Equipo del proyecto — se llena desde la columna `autores` en Supabase */}
            {authors.length > 0 && (
              <section className="mt-10 md:mt-12" aria-labelledby="equipo-proyecto">
                <h2
                  id="equipo-proyecto"
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-brand-accent-text mb-5"
                >
                  <HiUserGroup className="text-base" />
                  Equipo del proyecto
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {authors.map((author, i) => (
                    <li
                      key={`${author.nombre}-${i}`}
                      className="flex items-center gap-3 p-3 pr-4 rounded-2xl bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)]"
                    >
                      <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden border border-brand-accent/30 bg-brand-accent/10 flex items-center justify-center">
                        {author.image_url ? (
                          <Image src={author.image_url} alt={author.nombre} fill sizes="44px" className="object-cover" />
                        ) : (
                          <span className="text-brand-accent-text font-black text-base uppercase">
                            {author.nombre.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-[var(--brand-text)] leading-tight truncate">{author.nombre}</p>
                        {author.rol && (
                          <p className="text-[11px] text-[var(--brand-text-muted)] leading-tight truncate mt-0.5">{author.rol}</p>
                        )}
                      </div>
                      {author.linkedin && (
                        <a
                          href={author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn de ${author.nombre}`}
                          className="p-1.5 -m-1.5 shrink-0 text-[var(--brand-text-muted)] hover:text-brand-accent-text transition-colors"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </motion.div>

          {/* Project Image/Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative group lg:sticky lg:top-32"
          >
            <div className="absolute -inset-10 bg-brand-accent/20 blur-[100px] rounded-full -z-10 group-hover:bg-brand-accent/30 transition duration-500" />

            {/* Con imagen, el recuadro toma la forma de la imagen (vertical u horizontal)
                con un tope de alto; sin imagen, se mantiene el recuadro 4:3 del placeholder.
                Antes era siempre 4:3 con object-cover, lo que recortaba las imágenes
                verticales (p. ej. la cabeza del robot de PractiCIS). */}
            <div
              className={`relative rounded-[2.5rem] overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] ${
                project.image_url ? "flex items-center justify-center min-h-[240px]" : "aspect-[4/3]"
              }`}
            >
              {project.image_url ? (
                <>
                  {/* Fondo difuminado de la misma imagen (igual que en las tarjetas) */}
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-30"
                    style={{ backgroundImage: `url('${project.image_url}')` }}
                  />
                  {/* width/height solo reservan espacio mientras carga; w-auto h-auto hace
                      que se use la proporción real de la imagen, limitada por max-h. */}
                  <Image
                    src={project.image_url}
                    alt={project.titulo}
                    width={1200}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="relative w-auto h-auto max-w-full max-h-[60vh] lg:max-h-[620px] object-contain p-4 md:p-6 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] to-[var(--brand-background)]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-accent rounded-full blur-3xl opacity-20 animate-pulse" />
                    <HiLightningBolt className="text-[10rem] text-brand-accent-text relative z-10" />
                  </div>
                  <p className="text-[var(--brand-text-muted)] font-black uppercase tracking-[0.3em] text-xs mt-8">Proyecto Tech</p>
                </div>
              )}

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-background)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Decorative Tech Elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-accent rounded-tr-xl opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-accent rounded-bl-xl opacity-50" />
          </motion.div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default ProjectDetailView;
