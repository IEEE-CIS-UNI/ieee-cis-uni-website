import Image from "next/image";
import { HiClock, HiLocationMarker, HiUser } from "react-icons/hi";
import Button from "@/components/ui/Button";

interface EventTicketProps {
  date: string;
  title: string;
  time: string;
  location: string;
  speaker?: string;
  category: string;
  link: string;
  status?: string;
  imageUrl?: string | null;
  variant?: 'full' | 'compact';
}

const EventTicket = ({ date, title, time, location, speaker, category, link, status, imageUrl, variant = 'full' }: EventTicketProps) => {
  const dateParts = date.split(' ');
  const day = dateParts[0] || "00";
  const month = (dateParts[2] || "MES").substring(0, 3).toUpperCase();

  return (
    <div className="group relative flex flex-col md:flex-row bg-[var(--brand-card)] backdrop-blur-xl shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-[var(--brand-border)]">
      
      {/* Background Image for Compact Variant */}
      {imageUrl && variant === 'compact' && (
        <>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="100vw"
            className="z-0 object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[var(--brand-surface)] via-[var(--brand-surface)]/80 to-[var(--brand-surface)]/30 backdrop-blur-sm" />
        </>
      )}

      {/* Date Stub */}
      <div className="bg-brand-accent/20 flex md:flex-col items-center justify-center py-3 md:py-10 md:w-28 relative z-10 backdrop-blur-md border-b md:border-b-0 md:border-r border-[var(--brand-border)]/50">
        <div className="flex md:flex-col items-center gap-2 md:gap-0">
          <span className="text-brand-accent text-[10px] font-bold uppercase tracking-widest">{month}</span>
          <span className="text-[var(--brand-text)] text-3xl md:text-4xl font-black">{day}</span>
        </div>
      </div>

      {/* Perforated Line (Without fake cutouts since background is dynamic) */}
      <div className="relative">
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px border-l border-dashed border-[var(--brand-border)] z-10" />
        <div className="md:hidden w-full h-px border-t border-dashed border-[var(--brand-border)] relative" />
      </div>

      {/* Details Section */}
      <div className="flex-grow p-6 lg:py-8 lg:px-10 relative z-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <div className="flex flex-col items-center md:items-start gap-3 w-full">
            <div className="flex justify-between items-center w-full">
              <span className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent text-[9px] font-bold uppercase tracking-wider rounded">
                {category}
              </span>
              {status && (
                <span className={`text-[9px] font-bold uppercase tracking-widest ${status === 'Past' ? 'text-[var(--brand-text-muted)]' : 'text-green-500'}`}>
                  {status === 'Past' ? 'Finalizado' : 'Próximamente'}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[var(--brand-text-muted)] text-[10px] md:text-[11px]">
              <span className="flex items-center"><HiClock className="mr-1 text-brand-accent" />{time}</span>
              <span className="flex items-center"><HiLocationMarker className="mr-1 text-brand-accent" />{location}</span>
              {speaker && <span className="flex items-center"><HiUser className="mr-1 text-brand-accent" />{speaker}</span>}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
            <h4 className="text-lg lg:text-xl font-bold text-[var(--brand-text)] group-hover:text-brand-accent transition-colors leading-tight max-w-xl">
              {title}
            </h4>
            <div className="flex-shrink-0">
              <Button href={link} variant={status === 'Past' ? 'outline' : 'primary'} size="sm" className="w-fit">
                {status === 'Past' ? 'Ver Detalles' : 'Registrarme'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image Thumbnail for Full Variant */}
      {imageUrl && variant === 'full' && (
        <div className="hidden md:flex relative w-48 lg:w-64 flex-shrink-0 overflow-hidden border-l border-[var(--brand-border)]/50 bg-[var(--brand-surface)] items-center justify-center">
          {/* Blurred bg fill for portrait images */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-lg opacity-25"
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 0px, 256px"
            className="object-contain group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--brand-card)] to-transparent z-10" />
        </div>
      )}
    </div>
  );
};

export default EventTicket;
