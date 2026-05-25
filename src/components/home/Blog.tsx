"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/ui/BlogCard";
import Button from "@/components/ui/Button";
import NeuralNetworkBackground from "@/components/ui/NeuralNetworkBackground";
import { HiArrowRight, HiBookOpen } from "react-icons/hi";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/database";

interface BlogPostWithAuthor extends BlogPost {
  author?: {
    nombre: string;
  };
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchRecentPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select(`
            *,
            author:miembros(nombre)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(2);

        if (!ignore) {
          if (error) throw error;
          if (data) setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchRecentPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-[var(--brand-surface)] overflow-hidden">
      
      {/* ── Fondo dinámico: red neuronal interactiva ──────────────────────── */}
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

      {/* Contenido principal — relative z-10 para quedar encima del fondo */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
              Blog & Noticias
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Artículos{" "}
              <em className="not-italic italic text-brand-accent text-5xl md:text-6xl lg:text-7xl font-extrabold">
                Recientes
              </em>
            </h3>
            <p className="text-white/75 text-lg">
              Mantente al día con las últimas tendencias y descubrimientos en el mundo de la Inteligencia Computacional.
            </p>
          </div>
          <div className="flex justify-center lg:justify-start">
            <Button href="/blog" variant="outline" icon={<HiArrowRight />}>
              Ir al blog completo
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-full h-48 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div 
              className="flex flex-col gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <BlogCard 
                    title={post.titulo}
                    excerpt={post.excerpt}
                    image={post.image_url || ""}
                    author={post.author?.nombre || "IEEE CIS UNI"}
                    date={formatDate(post.created_at)}
                    readTime={post.read_time || "5 min read"}
                    category={post.category || "GENERAL"}
                    level={post.level}
                    slug={post.slug}
                  />
                </motion.div>
              ))}
            </motion.div>

            {posts.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mx-auto mb-4">
                  <HiBookOpen size={32} />
                </div>
                <p className="text-white/40">Sin artículos publicados recientemente.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
