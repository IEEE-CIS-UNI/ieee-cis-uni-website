"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { HiSearch, HiCode } from "react-icons/hi";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database";

const ProjectGrid = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('proyectos')
          .select('*')
          .order('created_at', { ascending: false });

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
        console.error('Error fetching projects:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      ignore = true;
    };
  }, []);

  // Compute unique categories (tags) dynamically
  const categories = useMemo(() => {
    const allTags = projects.flatMap(p => p.tags);
    const uniqueTags = Array.from(new Set(allTags.map(t => t.toUpperCase())));
    return ["TODOS", ...uniqueTags.sort()];
  }, [projects]);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === "TODOS" || project.tags.some(tag => tag.toUpperCase() === filter);
    const matchesSearch = project.titulo.toLowerCase().includes(search.toLowerCase()) || 
                          project.descripcion_corta.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-brand-background min-h-[60vh]">
      <div className="max-w-7xl mx-auto">
        {/* Toolbar: Search and Filters Stacked */}
        <div className="flex flex-col items-center mb-16 gap-8">
          {/* Search Bar - Centered */}
          <div className="relative w-full max-w-xl group">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o descripción..."
              className="w-full bg-brand-secondary/10 border border-white/5 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-accent/50 focus:bg-brand-secondary/20 transition-all text-center"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills - Below Search */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 sm:px-8 py-2.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border tracking-widest ${
                  filter === cat 
                  ? "bg-brand-accent border-brand-accent text-white" 
                  : "bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProjectCard 
                      title={project.titulo}
                      description={project.descripcion_corta}
                      image={project.image_url || ""}
                      tags={project.tags}
                      link={`/proyectos/${project.slug}`}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mx-auto mb-6">
                  <HiCode size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Sin proyectos</h3>
                <p className="text-white/40 max-w-xs mx-auto">No hay proyectos disponibles en esta categoría por el momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectGrid;
