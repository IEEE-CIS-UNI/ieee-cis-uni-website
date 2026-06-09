"use client";


import { motion } from "framer-motion";
import { HiCalendar } from "react-icons/hi";

const EventHero = () => {
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
                <span className="block text-white">Eventos que</span>
                <span className="block text-white">Inspiran</span>
                <span className="block italic text-brand-accent lg:text-[130px]">
                  el Futuro.
                </span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Desde workshops intensivos hasta conferencias magistrales. Únete a nuestros próximos encuentros y sé parte de la revolución tecnológica.
              </p>
            </motion.div>
          </div>

          {/* Standardized Tech Placeholder Content */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700" />
              
              {/* Tech Placeholder */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center group">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #066bf3 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                
                {/* Large Central Icon */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-accent/20 group-hover:scale-110 transition-transform duration-500">
                    <HiCalendar className="text-brand-accent text-5xl" />
                  </div>
                  <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Sección Eventos</span>
                </div>
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
