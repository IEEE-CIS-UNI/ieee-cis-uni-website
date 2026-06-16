"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { HiArrowLeft, HiOutlineExternalLink, HiCode, HiLightningBolt } from "react-icons/hi";
import Image from "next/image";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProject = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('proyectos')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (isMounted) {
          if (error) {
            console.error('Error fetching project:', error);
          } else {
            setProject(data);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--brand-background)] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" 
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--brand-background)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="text-4xl font-black text-[var(--brand-text)] mb-4 uppercase tracking-tighter">Proyecto no encontrado</h1>
          <p className="text-[var(--brand-text-muted)] mb-8 max-w-md">El proyecto que buscas no existe o ha sido movido. Verifica la URL e inténtalo de nuevo.</p>
          <Button href="/proyectos" variant="outline">Volver a Proyectos</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden about-page-bg min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-[var(--brand-accent)]/5" />
        <div className="absolute inset-0 about-radial-gradient" />
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24">
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
                <span key={tag} className="text-[10px] font-black text-brand-accent bg-brand-accent/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-accent/20">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-[var(--brand-text)] mb-8 tracking-tighter uppercase leading-none">
              {project.titulo}
            </h1>

            <div className="h-1 w-20 bg-brand-accent mb-10" />

            <p className="text-[var(--brand-text-muted)] text-lg leading-relaxed mb-12 whitespace-pre-wrap font-medium">
              {project.descripcion_larga || project.descripcion_corta}
            </p>

            <div className="flex flex-wrap gap-6 p-8 rounded-[2rem] bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)]">
              {project.github_link && (
                <Button href={project.github_link} variant="outline" icon={<HiCode />} className="flex-1 min-w-[200px] justify-center bg-[var(--brand-surface)]">
                  Ver Repositorio
                </Button>
              )}
              {project.demo_link && (
                <Button href={project.demo_link} icon={<HiOutlineExternalLink />} className="flex-1 min-w-[200px] justify-center">
                  Ver Demo Live
                </Button>
              )}
            </div>
          </motion.div>

          {/* Project Image/Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative group lg:sticky lg:top-32"
          >
            <div className="absolute -inset-10 bg-brand-accent/20 blur-[100px] rounded-full -z-10 group-hover:bg-brand-accent/30 transition-all duration-700" />
            
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)]">
              {project.image_url ? (
                <Image 
                  src={project.image_url} 
                  alt={project.titulo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] to-[var(--brand-background)]">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-accent rounded-full blur-3xl opacity-20 animate-pulse" />
                    <HiLightningBolt className="text-[10rem] text-brand-accent relative z-10" />
                  </div>
                  <p className="text-[var(--brand-text-muted)] font-black uppercase tracking-[0.3em] text-xs mt-8">Proyecto Tech</p>
                </div>
              )}
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-background)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
}
