"use client";

import { motion } from "framer-motion";

const Stats = () => {
  const stats = [
    { label: "Años de Trayectoria", value: "5+" },
    { label: "Miembros Activos", value: "18+" },
    { label: "Proyectos Realizados", value: "4+" },
    { label: "Eventos Anuales", value: "20+" }
  ];

  return (
    <section className="py-12 md:py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <h3 className="text-5xl md:text-6xl font-black text-brand-accent mb-2">
                {stat.value}
              </h3>
              <p className="text-[var(--brand-text-muted)] opacity-70 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
