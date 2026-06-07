"use client";

import { motion } from "framer-motion";

const Timeline = () => {
  const milestones = [
    {
      year: "Año 1",
      title: "Hito de Fundación",
      description: "Hito inicial que marca el comienzo de nuestras actividades en la Universidad Nacional de Ingeniería."
    },
    {
      year: "Año 2",
      title: "Expansión Técnica",
      description: "Crecimiento de nuestras áreas de investigación y desarrollo en inteligencia computacional."
    },
    {
      year: "Año 3",
      title: "Consolidación",
      description: "Fortalecimiento de la comunidad y reconocimiento dentro de la red estudiantil de la UNI."
    },
    {
      year: "Año 4",
      title: "Innovación Continua",
      description: "Desarrollo de proyectos de alto impacto y lanzamiento de nuevas iniciativas tecnológicas."
    }
  ];

  return (
    <section className="py-12 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
            Trayectoria
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Nuestros{" "}
            <em className="not-italic italic text-brand-accent text-5xl md:text-6xl font-extrabold">
              Hitos
            </em>
          </h3>
        </div>

        <div className="space-y-8 lg:space-y-32">
          {milestones.map((milestone, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 lg:gap-20"
            >
              {/* Year Column - Hidden on Mobile */}
              <div className={`hidden lg:flex order-1 w-full justify-center ${index % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}>
                <div className="font-black text-white/[0.05] lg:text-[10rem] leading-none select-none pointer-events-none">
                  {milestone.year}
                </div>
              </div>

              {/* Content Card Column */}
              <div className={`order-2 ${index % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}>
                <div className="relative z-10 w-full p-6 md:p-12 rounded-2xl md:rounded-3xl bg-brand-secondary/10 border border-white/5 backdrop-blur-sm group hover:border-brand-accent/30 transition-all duration-500">
                  <span className="text-brand-accent font-black text-base md:text-xl mb-2 md:mb-4 block">
                    {milestone.year}
                  </span>
                  <h4 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4 group-hover:text-brand-accent transition-colors">
                    {milestone.title}
                  </h4>
                  <p className="text-white/50 text-sm md:text-lg leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
