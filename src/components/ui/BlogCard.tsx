import Image from "next/image";
import Link from "next/link";
import { HiClock, HiCalendar, HiArrowRight, HiUser, HiChartBar, HiBookOpen } from "react-icons/hi";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  category: string;
  author: string;
  level?: string;
  slug?: string;
}

const BlogCard = ({ title, excerpt, date, readTime, image, category, author, level, slug }: BlogCardProps) => {
  const destination = slug ? `/blog/${slug}` : "#";

  return (
    <Link href={destination}>
      <div className="group flex flex-col lg:flex-row bg-[var(--brand-card)] rounded-3xl overflow-hidden border border-[var(--brand-border)] hover:border-brand-accent/30 transition-all duration-500 cursor-pointer">
        {/* Image Section */}
        <div className="lg:w-2/5 relative aspect-video lg:aspect-auto overflow-hidden bg-[var(--brand-surface)]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--brand-card)] to-[var(--brand-surface)] group-hover:scale-110 transition-transform duration-700">
              <HiBookOpen className="text-6xl text-brand-accent/30" />
            </div>
          )}
          <div className="absolute top-6 left-6">
            <span className="px-4 py-1.5 bg-brand-accent text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-white/20 backdrop-blur-md">
              {category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center relative">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[var(--brand-text-muted)] text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="flex items-center gap-2">
              <HiCalendar className="text-brand-accent" size={16} />
              {date}
            </span>
            <span className="flex items-center gap-2">
              <HiClock className="text-brand-accent" size={16} />
              {readTime}
            </span>
            <span className="flex items-center gap-2">
              <HiUser className="text-brand-accent" size={16} />
              {author}
            </span>
            {level && (
              <span className="flex items-center gap-2">
                <HiChartBar className="text-brand-accent" size={16} />
                {level}
              </span>
            )}
          </div>
          
          <h4 className="text-3xl lg:text-4xl font-black text-[var(--brand-text)] mb-6 group-hover:text-brand-accent transition-colors leading-[1.1] tracking-tighter uppercase">
            {title}
          </h4>
          
          <p className="text-[var(--brand-text-muted)] text-base leading-relaxed mb-10 line-clamp-2 font-medium">
            {excerpt}
          </p>
          
          <div className="mt-auto">
            <div className="inline-flex items-center font-black text-xs uppercase tracking-[0.3em] text-[var(--brand-text)] group-hover:text-brand-accent transition-colors">
              Explorar artículo
              <div className="ml-4 w-10 h-10 rounded-full border border-[var(--brand-border)] flex items-center justify-center group-hover:border-brand-accent group-hover:bg-brand-accent/10 transition-all">
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
