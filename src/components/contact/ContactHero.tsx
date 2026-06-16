"use client";


import { motion } from "framer-motion";

const ContactHero = () => {
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
                Contáctanos
              </span>
              <h1 className="font-extrabold leading-[1] tracking-tight mb-8 text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-[var(--brand-text)] lg:text-[60px]">Establezcamos la</span>
                <span className="block italic text-brand-accent lg:text-[120px]">
                  Conexión.
                </span>
              </h1>
              <p className="text-xl text-[var(--brand-text-muted)] leading-relaxed mb-8">
                ¿Tienes una idea, quieres colaborar o simplemente saludar? Envíanos un mensaje y nuestro equipo se pondrá en contacto contigo a la brevedad.
              </p>
            </motion.div>
          </div>

          {/* Image Content with Tech Frame - Styled Map */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative group"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-10 bg-brand-accent/15 rounded-full blur-[100px] group-hover:bg-brand-accent/25 transition-colors duration-700" />

              {/* Frame Container - Color Map */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-2xl bg-[var(--brand-surface)] backdrop-blur-md">
                <iframe
                  src="https://maps.google.com/maps?q=FIEE%20UNI&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="contact-map border-0 w-full h-full"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Subtle Blue Overlay for branding */}
                <div className="absolute inset-0 bg-brand-accent/10 pointer-events-none mix-blend-overlay" />
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

export default ContactHero;
