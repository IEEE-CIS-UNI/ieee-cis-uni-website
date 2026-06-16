"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiCalendar } from "react-icons/hi";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const EventHero = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchHeroImages = async () => {
      try {
        // Fetch files from the "hero-eventos" bucket
        const { data, error } = await supabase
          .storage
          .from('hero-eventos')
          .list('', {
            limit: 10,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) throw error;

        if (data && data.length > 0 && !ignore) {
          // Filter out any non-image files if necessary, or just map to public URLs
          const urls = data
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .map(file => {
              const { data: { publicUrl } } = supabase
                .storage
                .from('hero-eventos')
                .getPublicUrl(file.name);
              return publicUrl;
            });
            
          if (urls.length > 0) {
            setImages(urls);
          }
        }
      } catch (err) {
        console.error("Error fetching hero images:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchHeroImages();

    return () => {
      ignore = true;
    };
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 px-6 md:px-12 lg:px-24 min-h-[80vh] flex items-center">
      {/* Fondo manejado globalmente en page.tsx */}
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-accent font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
                Comunidad en Acción
              </span>
              <h1 className="font-extrabold leading-[1] tracking-tight mb-8 text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-[var(--brand-text)] drop-shadow-sm">Eventos que</span>
                <span className="block text-[var(--brand-text)] drop-shadow-sm">Inspiran</span>
                <span className="block italic text-brand-accent lg:text-[130px]">
                  el Futuro.
                </span>
              </h1>
              <p className="text-xl text-[var(--brand-text-muted)] opacity-90 leading-relaxed mb-8">
                Desde workshops intensivos hasta conferencias magistrales. Únete a nuestros próximos encuentros y sé parte de la revolución tecnológica.
              </p>
            </motion.div>
          </div>

          {/* Carousel / Placeholder Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700" />
              
              {/* Tech Placeholder or Carousel */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] backdrop-blur-md flex items-center justify-center group">
                
                {images.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[currentIndex]}
                        alt={`Hero image ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                      />
                      {/* Overlay to ensure text readability if needed, or just a nice tech tint */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-background)]/80 to-transparent mix-blend-multiply opacity-50" />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <>
                    {/* Decorative Pattern Background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #066bf3 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    
                    {/* Large Central Icon for when no images are in the bucket */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-accent/20 group-hover:scale-110 transition-transform duration-500">
                        <HiCalendar className="text-brand-accent text-5xl" />
                      </div>
                      <span className="text-[var(--brand-text-muted)] opacity-70 text-xs font-bold uppercase tracking-widest">
                        {loading ? 'Cargando...' : 'Sección Eventos'}
                      </span>
                    </div>
                  </>
                )}
                
              </div>

              {/* Decorative Tech Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-accent rounded-tr-xl" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-brand-accent rounded-bl-xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventHero;
