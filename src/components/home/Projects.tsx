"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import { HiArrowRight, HiCode } from "react-icons/hi";
import { motion, Variants } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('proyectos')
          .select('*')
          .eq('highlighted', true)
          .limit(3);

        if (!ignore) {
          if (error) throw error;
          const hardcodedRuleta = {
            id: 'ruleta-cis-hardcoded',
            titulo: 'Ruleta CIS',
            descripcion_corta: 'Descubre qué área hosteará el próximo evento con nuestra ruleta interactiva.',
            image_url: '/images/pinguinocis.png',
            tags: ['INTERACTIVO', 'EVENTOS'],
            slug: 'ruleta'
          } as Project;

          if (data) setProjects([hardcodedRuleta, ...data]);
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchFeaturedProjects();

    return () => {
      ignore = true;
    };
  }, []);

  const headerLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const headerRightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden min-h-[60vh]">

      {/* Contenido principal — relative z-10 para quedar encima del fondo */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 overflow-hidden">
          <motion.div 
            variants={headerLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
          >
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
              Nuestro Portafolio
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Proyectos que{" "}
              <em className="not-italic italic text-brand-accent text-5xl md:text-6xl lg:text-7xl font-extrabold">
                Impactan
              </em>
            </h3>
            <p className="text-white/75 text-lg">
              Explora las soluciones innovadoras desarrolladas por nuestros miembros utilizando tecnologías de vanguardia en inteligencia computacional.
            </p>
          </motion.div>
          <motion.div 
            variants={headerRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <Button href="/proyectos" variant="outline" icon={<HiArrowRight />}>
              Ver todos los proyectos
            </Button>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 gap-4 lg:gap-8"
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={cardVariants}>
                  <ProjectCard
                    title={project.titulo}
                    description={project.descripcion_corta}
                    image={project.image_url || ""}
                    tags={project.tags}
                    link={`/proyectos/${project.slug}`}
                  />
                </motion.div>
              ))}
            </motion.div>

            {projects.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mx-auto mb-4">
                  <HiCode size={32} />
                </div>
                <p className="text-white/40">No hay proyectos destacados por el momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
