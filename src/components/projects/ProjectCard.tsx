import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiLightningBolt } from "react-icons/hi";
import BlurredBackdrop from "@/components/ui/BlurredBackdrop";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  category?: string;
  tags?: string[];
  /** Valor de `proyectos.estado` en Supabase (texto libre) */
  status?: string | null;
  link: string;
}

type Status = "Desarrollo" | "Completado" | "Beta";

// `estado` se escribe a mano en Supabase: se normaliza a uno de los 3 badges.
function toStatus(estado?: string | null): Status {
  const e = (estado ?? "").toLowerCase();
  if (e.includes("complet") || e.includes("finaliz")) return "Completado";
  if (e.includes("beta")) return "Beta";
  return "Desarrollo";
}

const ProjectCard = ({
  title,
  description,
  image,
  category = "Proyecto",
  tags = [],
  status: estado,
  link
}: ProjectCardProps) => {
  const status = toStatus(estado);
  const statusColors = {
    Desarrollo: "text-[var(--status-warning)] bg-[var(--status-warning)]/10 border-[var(--status-warning)]/20",
    Completado: "text-[var(--status-success)] bg-[var(--status-success)]/10 border-[var(--status-success)]/20",
    Beta: "text-brand-accent-text bg-brand-accent/10 border-brand-accent/20"
  };

  return (
    <Link href={link}>
      <div className="group relative flex flex-col h-full bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] rounded-3xl overflow-hidden transition duration-300 hover:border-brand-accent/30 hover:shadow-[0_0_40px_rgba(6,107,243,0.15)] cursor-pointer hover:-translate-y-2.5">
        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--brand-surface)]">
          {image ? (
            <>
              {/* Blurred background for non-portrait images */}
              <BlurredBackdrop src={image} className="scale-110 blur-xl opacity-25" />
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-accent/15 to-[var(--brand-surface)] group-hover:scale-110 transition-transform duration-300">
              <HiLightningBolt className="text-6xl text-brand-accent-text/40" />
            </div>
          )}
          
          {/* Tech Blueprint Overlay */}
          <div className="absolute inset-0 bg-[var(--brand-surface)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px] flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #066bf3 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="z-10 p-4 rounded-full bg-brand-accent text-white shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
              <HiArrowRight size={24} />
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter border backdrop-blur-md ${statusColors[status]}`}>
            {status}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-brand-accent-text">
              <HiLightningBolt size={18} />
            </span>
            <span className="text-[11px] font-bold text-[var(--brand-text-muted)] uppercase tracking-[0.2em]">
              {category}
            </span>
          </div>

          <h3 className="text-2xl font-black text-[var(--brand-text)] mb-3 tracking-tight group-hover:text-brand-accent-text transition-colors drop-shadow-sm">
            {title}
          </h3>
          
          <p className="text-[var(--brand-text-muted)] text-sm leading-relaxed mb-6 line-clamp-3">
            {description}
          </p>

          <div className="mt-auto">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, idx) => (
                <span key={idx} className="max-w-full truncate text-[11px] font-bold text-[var(--brand-text-muted)] bg-[var(--brand-surface)] px-2 py-1 rounded-md border border-[var(--brand-border)] uppercase shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-black text-[var(--brand-text)] uppercase tracking-widest group-hover:text-brand-accent-text transition-colors">
              Explorar Proyecto 
              <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
