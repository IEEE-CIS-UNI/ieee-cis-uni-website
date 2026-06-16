"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiUserGroup } from "react-icons/hi";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const AboutHero = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      // NOTA: Ajusta 'aboutus' y 'about' si tu bucket o carpeta tienen otros nombres
      const bucketName = 'aboutus';
      const folderPath = 'about';

      const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
        limit: 10,
        sortBy: { column: 'name', order: 'asc' }
      });

      if (error) {
        console.error("Error fetching images from Supabase:", error);
        return;
      }

      if (data) {
        // Filtrar placeholders ocultos u otras carpetas
        const validFiles = data.filter((file) => file.name !== '.emptyFolderPlaceholder' && file.name !== folderPath);
        
        const urls = validFiles.map((file) => {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${folderPath}/${file.name}`);
          return publicUrlData.publicUrl;
        });

        setImages(urls);
      }
    };

    fetchImages();
  }, []);

  // Cambiar imagen automáticamente cada 4 segundos
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-20 px-6 md:px-12 lg:px-24 min-h-[80vh] flex items-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] z-0 pointer-events-none" />
      
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
                Nuestra Identidad
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
                Impulsando la{" "}
                <em className="not-italic italic text-brand-accent text-6xl md:text-8xl font-extrabold">
                  Excelencia
                </em>{" "}
                e Innovación
              </h1>
              <p className="text-xl text-[var(--brand-text-muted)] opacity-90 leading-relaxed mb-8">
                Somos una comunidad de investigadores y apasionados por la inteligencia computacional que buscan dejar una huella en el mundo tecnológico desde la UNI.
              </p>
            </motion.div>
          </div>

          {/* Image Content with Tech Frame */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              {/* Outer Glow - Softer and more atmospheric */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700" />
              
              {/* Carrusel de Imágenes */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-card)] backdrop-blur-md flex items-center justify-center group">
                {images.length > 0 ? (
                  <AnimatePresence>
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -100, scale: 1.05 }}
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.25, 1, 0.5, 1] // Curva de animación premium (suave al final)
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={images[currentIndex]}
                        alt={`Carrusel nosotros ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        priority={currentIndex === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <>
                    {/* Decorative Pattern Background (fallback) */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #066bf3 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    
                    {/* Large Central Icon (fallback) */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-accent/20 group-hover:scale-110 transition-transform duration-500">
                        <HiUserGroup className="text-brand-accent text-5xl" />
                      </div>
                      <span className="text-[var(--brand-text-muted)] opacity-70 text-xs font-bold uppercase tracking-widest">
                        Cargando fotos...
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

export default AboutHero;
