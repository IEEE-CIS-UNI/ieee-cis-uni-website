import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineClock, HiBookOpen } from "react-icons/hi";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  level: "Básico" | "Intermedio" | "Avanzado";
  slug: string;
}

const BlogCard = ({ title, excerpt, image, author, date, readTime, category, level, slug }: BlogCardProps) => {
  const levelColors = {
    Básico: "text-emerald-400 bg-emerald-400/10",
    Intermedio: "text-brand-accent bg-brand-accent/10",
    Avanzado: "text-red-400 bg-red-400/10"
  };

  return (
    <Link href={`/blog/${slug}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative flex flex-col h-full bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] rounded-3xl overflow-hidden transition-all duration-500 hover:border-brand-accent/30 hover:shadow-[0_0_40px_rgba(6,107,243,0.15)] cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative aspect-video overflow-hidden border-b border-[var(--brand-border)] bg-[var(--brand-surface)]">
          {image ? (
            <Image 
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[var(--brand-surface)] to-[var(--brand-background)] group-hover:scale-110 transition-transform duration-700">
              <HiBookOpen className="text-6xl text-brand-accent/40" />
            </div>
          )}
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[var(--brand-background)]/80 backdrop-blur-md text-[var(--brand-text)] text-[9px] font-black uppercase tracking-widest border border-[var(--brand-border)]">
              {category}
            </span>
            <span className={`px-3 py-1 rounded-full backdrop-blur-md text-[9px] font-black uppercase tracking-widest border border-[var(--brand-border)] ${levelColors[level]}`}>
              {level}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-[var(--brand-text-muted)] opacity-80 text-[10px] font-bold uppercase tracking-widest">
              <HiOutlineClock size={14} />
              {readTime}
            </div>
            <div className="w-1 h-1 rounded-full bg-[var(--brand-border)]" />
            <div className="text-[var(--brand-text-muted)] opacity-80 text-[10px] font-bold uppercase tracking-widest">
              {date}
            </div>
          </div>

          <h3 className="text-2xl font-black text-[var(--brand-text)] mb-3 group-hover:text-brand-accent transition-colors duration-300 leading-tight tracking-tight drop-shadow-sm">
            {title}
          </h3>
          
          <p className="text-[var(--brand-text-muted)] text-sm leading-relaxed mb-6 line-clamp-2">
            {excerpt}
          </p>

          <div className="flex items-center gap-3 pt-6 mt-auto border-t border-[var(--brand-border)]">
            <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-[12px] font-black text-brand-accent">
              {author.charAt(0)}
            </div>
            <span className="text-[11px] font-black text-[var(--brand-text)] opacity-80 uppercase tracking-widest">
              {author}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCard;
