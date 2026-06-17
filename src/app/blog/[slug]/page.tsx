"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BlogPost, Member } from "@/types/database";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { HiArrowLeft, HiCalendar, HiClock, HiBookOpen } from "react-icons/hi";
import Image from "next/image";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";

interface BlogPostWithAuthor extends BlogPost {
  author?: {
    nombre: string;
    image_url: string | null;
    rol: string;
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [post, setPost] = useState<BlogPostWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog')
          .select('*, author:miembros(nombre, image_url, rol)')
          .eq('slug', slug)
          .maybeSingle();

        if (isMounted) {
          if (error) {
            console.error('Error fetching post:', error);
          } else {
            setPost(data);
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

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

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--brand-background)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="text-4xl font-black text-[var(--brand-text)] mb-4 uppercase tracking-tighter">Post no encontrado</h1>
          <p className="text-[var(--brand-text-muted)] mb-8 max-w-md">El artículo que buscas no existe o ha sido movido.</p>
          <Button href="/blog" variant="outline">Volver al Blog</Button>
        </motion.div>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative overflow-hidden about-page-bg min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeuralNetworkBackground />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-[var(--brand-accent)]/5" />
        <div className="absolute inset-0 about-radial-gradient" />
      </div>

      <main className="relative z-10 min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Button href="/blog" variant="outline" size="sm" icon={<HiArrowLeft />}>
            Volver al Blog
          </Button>
        </motion.div>

        {/* Header Section */}
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <span className="text-[10px] font-black text-brand-accent bg-brand-accent/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-accent/20">
              {post.category}
            </span>
            <span className="text-[10px] font-black text-[var(--brand-text-muted)] bg-[var(--brand-surface)] px-4 py-1.5 rounded-full uppercase tracking-widest border border-[var(--brand-border)]">
              {post.level}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-[var(--brand-text)] mb-8 tracking-tighter uppercase leading-none drop-shadow-sm"
          >
            {post.titulo}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-[var(--brand-text-muted)] text-sm"
          >
            <div className="flex items-center gap-2">
              <HiCalendar className="text-brand-accent" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiClock className="text-brand-accent" />
              <span>{post.read_time || "5 min"} de lectura</span>
            </div>
          </motion.div>
        </header>

        {/* Featured Image / Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] backdrop-blur-md mb-16"
        >
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt={post.titulo}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--brand-surface)]">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-accent rounded-full blur-3xl opacity-20 animate-pulse" />
                <HiBookOpen className="text-[10rem] text-brand-accent relative z-10" />
              </div>
              <p className="text-[var(--brand-text-muted)] opacity-50 font-black uppercase tracking-[0.3em] text-xs mt-8">Knowledge Post</p>
            </div>
          )}
        </motion.div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-20">
          <div className="text-[var(--brand-text-muted)] leading-relaxed whitespace-pre-wrap font-medium">
            {post.contenido}
          </div>
        </article>

        {/* Author Card */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-[3rem] bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] flex flex-col md:flex-row items-center gap-8 shadow-sm"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-accent/30 shrink-0 bg-[var(--brand-background)]">
            {post.author?.image_url ? (
              <Image 
                src={post.author.image_url} 
                alt={post.author.nombre} 
                width={96} 
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-accent font-black text-2xl uppercase">
                {post.author?.nombre.charAt(0) || "C"}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-1">Escrito por</p>
            <h3 className="text-2xl font-black text-[var(--brand-text)] mb-2 uppercase tracking-tighter">
              {post.author?.nombre || "Equipo IEEE CIS UNI"}
            </h3>
            <p className="text-[var(--brand-text-muted)] text-sm">{post.author?.rol || "Contributor"}</p>
          </div>
          <div className="md:ml-auto">
            <Button variant="outline" size="sm" href="/miembros">Ver Comunidad</Button>
          </div>
        </motion.footer>
      </div>
      </main>
    </div>
  );
}
