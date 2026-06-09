"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiMail, HiLocationMarker, HiPaperAirplane, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { sendContactEmail } from "@/app/actions/contact";

const ContactSection = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Ocurrió un error al enviar el mensaje.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Error de conexión. Inténtalo de nuevo.");
    }
  };

  // Variantes para la columna izquierda (viene de la izquierda)
  const leftContainerVariants = {
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 50, damping: 20, staggerChildren: 0.1 }
    }
  };

  // Variantes para la columna derecha (viene de la derecha)
  const rightContainerVariants = {
    hidden: { opacity: 0, x: 100 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 50, damping: 20, staggerChildren: 0.1 }
    }
  };

  // Variantes para los elementos internos (aparecen sutilmente hacia arriba)
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } }
  };

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative min-h-[60vh] overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          
          {/* Left Side: Contact Form */}
          <motion.div 
            variants={leftContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
              Envíanos un <span className="text-brand-accent">Mensaje</span>
            </motion.h2>
            
            {status === "success" ? (
              <motion.div 
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-xl border border-white/20 p-12 rounded-[3rem] text-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiCheckCircle className="text-brand-accent text-5xl" />
                </div>
                <h3 className="text-white text-3xl font-black mb-4 tracking-tighter">¡MENSAJE ENVIADO!</h3>
                <p className="text-white/80 mb-10 text-lg leading-relaxed">
                  Gracias por contactarnos. Tu consulta ha sido procesada y nuestro equipo te responderá pronto.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all shadow-lg"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest ml-4">Nombre Completo</label>
                    <input 
                      name="nombre"
                      type="text" 
                      required
                      placeholder="Tu nombre"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl py-4 px-6 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:-translate-y-1 focus:shadow-2xl transition-all duration-300"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest ml-4">Correo Electrónico</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl py-4 px-6 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:-translate-y-1 focus:shadow-2xl transition-all duration-300"
                    />
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest ml-4">Asunto</label>
                  <input 
                    name="asunto"
                    type="text" 
                    required
                    placeholder="¿En qué podemos ayudarte?"
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl py-4 px-6 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:-translate-y-1 focus:shadow-2xl transition-all duration-300"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest ml-4">Tu Mensaje</label>
                  <textarea 
                    name="mensaje"
                    rows={5}
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.1)] rounded-2xl py-4 px-6 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:-translate-y-1 focus:shadow-2xl transition-all duration-300 resize-none"
                  />
                </motion.div>

                {status === "error" && (
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-2 text-red-400 text-sm ml-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20 backdrop-blur-md"
                  >
                    <HiExclamationCircle />
                    {errorMessage}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <button 
                    disabled={status === "sending"}
                    className="group relative w-full py-5 mt-4 bg-brand-accent rounded-2xl text-white font-black uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-brand-accent/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgba(6,107,243,0.3)] hover:shadow-[0_8px_40px_rgba(6,107,243,0.5)] hover:-translate-y-1 duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === "sending" ? "Enviando..." : "Enviar Mensaje"}
                      {status !== "sending" && <HiPaperAirplane className="rotate-90 transition-transform group-hover:translate-x-2" />}
                    </span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </motion.div>
              </form>
            )}
          </motion.div>

          {/* Right Side: Contact Info & Hubs */}
          <motion.div 
            variants={rightContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-center space-y-12"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">
                Información de <span className="text-brand-accent">Contacto</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {/* Email Card */}
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-brand-accent group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,107,243,0.5)] transition-all duration-300">
                    <HiMail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">Email Principal</p>
                    <p className="text-white font-bold text-lg">ieee.cis@uni.edu.pe</p>
                  </div>
                </div>

                {/* Location Card */}
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_20px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-brand-accent group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,107,243,0.5)] transition-all duration-300">
                    <HiLocationMarker size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">Ubicación</p>
                    <p className="text-white font-bold text-lg">Universidad Nacional de Ingeniería</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Channels */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-black text-white/50 mb-6 uppercase tracking-[0.3em]">Síguenos en</h3>
              <div className="flex gap-4">
                {[
                  { icon: <FaLinkedin />, name: "LinkedIn", link: process.env.NEXT_PUBLIC_LINKEDIN_URL },
                  { icon: <FaInstagram />, name: "Instagram", link: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
                  { icon: <FaFacebook />, name: "Facebook", link: process.env.NEXT_PUBLIC_FACEBOOK_URL }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href={social.link || "#"}
                    className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 text-2xl"
                    title={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
