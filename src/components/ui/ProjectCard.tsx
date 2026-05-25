import Image from "next/image";
import Link from "next/link";
import { HiArrowRight, HiLightningBolt } from "react-icons/hi";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

const ProjectCard = ({ title, description, image, tags, link }: ProjectCardProps) => {
  return (
    <Link href={link || "#"}>
      <div className="group relative bg-[var(--brand-card)] rounded-3xl border border-[var(--brand-border)] overflow-hidden hover:border-brand-accent/30 transition-all duration-500 cursor-pointer h-full">
        {/* Editorial Background Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] -z-10 group-hover:bg-brand-accent/10 transition-colors" />
        
        <div className="p-3 lg:p-8 flex flex-col h-full">
          {/* Mockup Frame */}
          <div className="relative aspect-video w-full mb-4 lg:mb-8 rounded-lg lg:rounded-xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-surface)]">
            {/* Mac-style Window Controls */}
            <div className="absolute top-0 left-0 right-0 h-4 lg:h-6 bg-[var(--brand-card)] border-b border-[var(--brand-border)] flex items-center px-2 lg:px-3 gap-1 lg:gap-1.5 z-20">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-red-500/50" />
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-yellow-500/50" />
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500/50" />
            </div>
            
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover pt-4 lg:pt-6 group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--brand-card)] to-[var(--brand-surface)] pt-4 lg:pt-6 group-hover:scale-105 transition-transform duration-700">
                <HiLightningBolt className="text-5xl text-brand-accent/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center lg:text-left flex flex-col flex-grow">
            <div className="hidden lg:flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span key={index} className="text-[10px] font-bold uppercase tracking-widest text-brand-accent/80 bg-brand-accent/10 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <h4 className="text-sm lg:text-2xl font-bold text-[var(--brand-text)] mb-1 lg:mb-3 group-hover:text-brand-accent transition-colors leading-tight">
              {title}
            </h4>
            <p className="block lg:hidden text-[9px] leading-tight text-[var(--brand-text-muted)] mb-3 line-clamp-2 px-2">
              {description}
            </p>
            <p className="hidden lg:block text-[var(--brand-text-muted)] text-sm leading-relaxed mb-6 flex-grow">
              {description}
            </p>
            
            <div className="inline-flex items-center text-[10px] lg:text-sm font-bold text-[var(--brand-text)] group-hover:text-brand-accent transition-colors mt-auto">
              Ver detalles
              <HiArrowRight className="ml-1 lg:ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
