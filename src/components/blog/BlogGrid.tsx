"use client";

import { useState, useEffect, useMemo } from "react";
import BlogCard from "./BlogCard";
import { HiSearch, HiBookOpen } from "react-icons/hi";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/database";

interface BlogPostWithAuthor extends BlogPost {
  author?: {
    nombre: string;
  };
}

const BlogGrid = () => {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog')
          .select(`
            *,
            author:miembros(nombre)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!ignore) {
          if (error) throw error;
          if (data) setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category?.toUpperCase()).filter((c): c is string => !!c)));
    return ["TODOS", ...cats.sort()];
  }, [posts]);

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === "TODOS" || post.category?.toUpperCase() === filter;
    const matchesSearch = post.titulo.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative min-h-[60vh]">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Standardized Toolbar: Search and Filters Stacked */}
        <div className="flex flex-col items-center mb-16 gap-8">
          <div className="relative w-full max-w-xl group">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar artículos por tema o autor..."
              className="w-full bg-brand-secondary/10 border border-white/5 rounded-full py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-accent/50 focus:bg-brand-secondary/20 transition-all text-center"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-video bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
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
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mx-auto mb-6">
                  <HiBookOpen size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Sin artículos</h3>
                <p className="text-white/40 max-w-xs mx-auto">No se encontraron artículos en esta categoría por el momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
