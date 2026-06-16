"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/ui/BlogCard";
import Button from "@/components/ui/Button";
import { HiArrowRight, HiBookOpen } from "react-icons/hi";
import { motion, Variants } from "framer-motion";
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

  const headerLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const headerRightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotate: -2 },
    visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.7, type: "spring", bounce: 0.4 } }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">

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
              Blog & Noticias
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
              Artículos{" "}
              <em className="not-italic italic text-brand-accent text-5xl md:text-6xl lg:text-7xl font-extrabold">
                Recientes
              </em>
            </h3>
            <p className="text-[var(--brand-text)] opacity-75 text-lg">
              Mantente al día con las últimas tendencias y descubrimientos en el mundo de la Inteligencia Computacional.
            </p>
          </motion.div>
          <motion.div 
            variants={headerRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <Button href="/blog" variant="outline" icon={<HiArrowRight />}>
              Ir al blog
            </Button>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-full h-48 bg-[var(--brand-card)] backdrop-blur-md rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={cardVariants}>
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
              <div className="text-center py-20 border border-dashed border-[var(--brand-border)] rounded-[3rem] backdrop-blur-md">
                <div className="w-16 h-16 bg-[var(--brand-card)] rounded-2xl flex items-center justify-center text-[var(--brand-text-muted)] mx-auto mb-4 shadow-sm">
                  <HiBookOpen size={32} />
                </div>
                <p className="text-[var(--brand-text-muted)] opacity-70">Sin artículos publicados recientemente.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
