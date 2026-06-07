"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaChrome } from "react-icons/fa";

const Institutional = () => {
  const bodies = [
    {
      name: "IEEE Global",
      description: "La organización profesional técnica más grande del mundo dedicada al avance de la tecnología para la humanidad.",
      logo: "/images/ieee_white_logo.png",
      links: { web: "#", instagram: "#", facebook: "#" }
    },
    {
      name: "CIS Society",
      description: "Computational Intelligence Society, enfocada en redes neuronales, sistemas borrosos y computación evolutiva.",
      logo: "/images/cis_white_logo.png",
      links: { web: "#", instagram: "#", facebook: "#" }
    },
    {
      name: "UNI",
      description: "La Universidad Nacional de Ingeniería, alma mater y cuna de la ingeniería y ciencia en el Perú.",
      logo: "/images/logo_uni_white.png",
      links: { web: "#", instagram: "#", facebook: "#" }
    }
  ];

  return (
    <section className="py-12 md:py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
            Respaldo Institucional
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Nuestra{" "}
            <em className="not-italic italic text-brand-accent text-5xl md:text-6xl font-extrabold">
              Red
            </em>
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 items-stretch relative">
          {/* Decorative Connection Line Background - Hidden on Mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent -z-10" />
          
          {bodies.map((body, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`p-6 md:p-10 rounded-2xl md:rounded-3xl bg-brand-background border border-white/5 flex flex-col items-center text-center group hover:border-brand-accent/30 transition-all ${
                index === 2 ? "col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="h-16 md:h-20 flex items-center justify-center mb-6 md:mb-8">
                <Image
                  src={body.logo}
                  alt={body.name}
                  width={150}
                  height={50}
                  className="w-auto h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">{body.name}</h4>
              <p className="text-white/60 text-[10px] md:text-sm leading-relaxed mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">
                {body.description}
              </p>
              <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 w-full flex justify-center gap-4 md:gap-6">
                <a href={body.links.web} className="text-white/30 hover:text-brand-accent transition-colors">
                  <FaChrome size={18} />
                </a>
                <a href={body.links.instagram} className="text-white/30 hover:text-brand-accent transition-colors">
                  <FaInstagram size={18} />
                </a>
                <a href={body.links.facebook} className="text-white/30 hover:text-brand-accent transition-colors">
                  <FaFacebook size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Institutional;
