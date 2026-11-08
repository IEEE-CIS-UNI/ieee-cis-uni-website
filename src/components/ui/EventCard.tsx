import Image from "next/image";
import { HiClock, HiLocationMarker, HiUser } from "react-icons/hi";
import Button from "@/components/ui/Button";
import { normalizeUrl } from "@/lib/url";

interface EventCardProps {
  date: string;
  title: string;
  time: string;
  location: string;
  speaker?: string;
  category: string;
  /** Enlace de registro/detalle. Si falta, no se muestra el botón
   *  (aparece solo en cuanto se llene `link_registro` en Supabase). */
  link?: string | null;
  status?: string;
  imageUrl?: string | null;
}

const EventCard = ({ date, title, time, location, speaker, category, link: rawLink, status, imageUrl }: EventCardProps) => {
  const link = normalizeUrl(rawLink);
  const dateParts = date.split(' ');
  const day = dateParts[0] || "00";
  const month = (dateParts[2] || "MES").substring(0, 3).toUpperCase();

  return (
    <div className="group flex flex-col bg-[var(--brand-card)] backdrop-blur-xl shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl transition duration-500 border border-[var(--brand-border)] h-full">
      
      {/* Image Header */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--brand-surface)]">
        {imageUrl ? (
          <>
            {/* Fondo borroso para rellenar espacio en imágenes landscape */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-30"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            />
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#066bf3_1px,_transparent_1px)] bg-[size:20px_20px]" />
        )}
        
        {/* Category & Status Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <span className="min-w-0 max-w-[60%] truncate px-3 py-1 bg-[var(--brand-surface)]/90 backdrop-blur-md text-brand-accent-text text-[11px] font-black uppercase tracking-widest rounded-full shadow-sm">
            {category}
          </span>
          {status && (
            <span className={`px-3 py-1 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm ${status === 'Past' ? 'bg-gray-600 text-white' : 'bg-emerald-700 text-white'}`}>
              {status === 'Past' ? 'Finalizado' : 'Próximamente'}
            </span>
          )}
        </div>

        {/* Floating Date Badge */}
        <div className="absolute bottom-4 left-4 bg-[var(--brand-surface)]/90 backdrop-blur-md border border-[var(--brand-border)] rounded-xl px-4 py-2 flex flex-col items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
          <span className="text-brand-accent-text text-[11px] font-bold uppercase tracking-widest leading-none mb-1">{month}</span>
          <span className="text-[var(--brand-text)] text-2xl font-black leading-none">{day}</span>
        </div>
      </div>

      {/* Body Section */}
      <div className="flex flex-col flex-grow p-6 md:p-8 relative z-10 bg-gradient-to-b from-transparent to-[var(--brand-surface)]/30">
        <h4 className="text-xl font-bold text-[var(--brand-text)] group-hover:text-brand-accent-text transition-colors leading-tight mb-4 line-clamp-2">
          {title}
        </h4>
        
        <div className="flex flex-col gap-2 text-[var(--brand-text-muted)] text-xs mb-8 flex-grow">
          <span className="flex items-center"><HiClock className="mr-2 text-brand-accent-text text-lg" />{time}</span>
          <span className="flex items-center"><HiLocationMarker className="mr-2 text-brand-accent-text text-lg" />{location}</span>
          {speaker && <span className="flex items-center"><HiUser className="mr-2 text-brand-accent-text text-lg" />{speaker}</span>}
        </div>
        
        {link && (
          <div className="mt-auto">
            <Button href={link} variant={status === 'Past' ? 'outline' : 'primary'} className="w-full justify-center">
              {status === 'Past' ? 'Ver Detalles' : 'Registrarme'}
            </Button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default EventCard;
