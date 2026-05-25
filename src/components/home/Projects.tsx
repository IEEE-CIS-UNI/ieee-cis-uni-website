"use client";

import { useState, useEffect } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";
import { HiArrowRight, HiCode } from "react-icons/hi";
import { motion } from "framer-motion";
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
          .limit(4);

        if (!ignore) {
          if (error) throw error;
          if (data) setProjects(data);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-[var(--brand-background)] overflow-hidden min-h-[60vh]">

      {/* ── Fondo dinámico: red neuronal interactiva ──────────────────────── */}
      <NeuralNetworkBackground />

      {/* Capa de difuminado general sobre el canvas para dar el efecto blur */}
      <div className="absolute inset-0 pointer-events-none backdrop-blur-[8px] bg-[var(--brand-background)]/10" />

      {/* Capa de degradado sobre el canvas para que el texto sea legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 40%, var(--brand-background) 80%)",
        }}
      />

      {/* Contenido principal — relative z-10 para quedar encima del fondo */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <motion.div variants={itemVariants} className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
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
          <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
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
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
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
      </motion.div>
    </section>
  );
};

export default Projects;
