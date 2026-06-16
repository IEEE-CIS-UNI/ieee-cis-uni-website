"use client";

import { motion } from "framer-motion";
import { HiOutlineGlobe, HiOutlineCalendar, HiOutlineLightningBolt, HiExternalLink } from "react-icons/hi";
import Image from "next/image";

const globalLinks = [
  {
    title: "Conferencias Globales",
    description: "Participa en los congresos mundiales de Inteligencia Computacional organizados por IEEE CIS. Presenta papers, asiste a charlas magistrales y conecta con los mejores investigadores del planeta.",
    icon: <HiOutlineCalendar className="text-4xl text-brand-accent" />,
    url: "https://cis.ieee.org/conferences",
    bgGradient: "from-brand-accent/20 to-transparent",
  },
  {
    title: "Actividades y Recursos",
    description: "Explora competiciones, becas de viaje, premios, webinars y escuelas de verano que ofrece IEEE CIS a nivel internacional para potenciar tu carrera en la IA.",
    icon: <HiOutlineLightningBolt className="text-4xl text-brand-accent" />,
    url: "https://cis.ieee.org/activities",
    bgGradient: "from-brand-secondary/20 to-transparent",
  }
];

const GlobalCIS = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-4 rounded-full bg-brand-accent/10 mb-6 border border-brand-accent/20"
          >
            <HiOutlineGlobe className="text-3xl text-brand-accent" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-[var(--brand-text)] mb-6 uppercase tracking-tighter"
          >
            IEEE CIS Global
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--brand-text-muted)] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Somos parte de la Sociedad de Inteligencia Computacional de IEEE a nivel mundial. Conoce las inmensas oportunidades que la red global tiene preparadas para ti.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {globalLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 2) }}
              className="group relative bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] rounded-3xl p-8 lg:p-12 overflow-hidden hover:border-brand-accent/30 transition-all duration-500 hover:-translate-y-2 shadow-sm hover:shadow-[0_20px_40px_rgba(6,107,243,0.1)] flex flex-col h-full"
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${link.bgGradient} rounded-full blur-[80px] opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-[var(--brand-surface)] border border-[var(--brand-border)] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {link.icon}
                </div>
                
                <h3 className="text-2xl font-black text-[var(--brand-text)] mb-4 tracking-tight group-hover:text-brand-accent transition-colors">
                  {link.title}
                </h3>
                
                <p className="text-[var(--brand-text-muted)] leading-relaxed mb-8 flex-grow">
                  {link.description}
                </p>
                
                <div className="flex items-center text-sm font-bold text-brand-accent uppercase tracking-widest mt-auto">
                  <span>Visitar sitio oficial</span>
                  <HiExternalLink className="ml-2 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Banner de Calendario de Conferencias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <a
            href="https://cis.ieee.org/conferences/conference-calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full rounded-3xl overflow-hidden border border-[var(--brand-border)] bg-[var(--brand-card)] group shadow-sm hover:shadow-[0_20px_40px_rgba(6,107,243,0.15)] hover:border-brand-accent/40 transition-all duration-500"
          >
            <Image
              src="/images/travel.png"
              alt="Calendario de Conferencias IEEE CIS"
              width={2400}
              height={800}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay interactivo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6 md:p-10">
              <div className="flex items-center text-white font-black uppercase tracking-widest text-sm md:text-base translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-md">
                Ver Calendario de Conferencias
                <HiExternalLink className="ml-2 text-xl" />
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalCIS;
