"use client";

import { useState, useEffect } from "react";
import MemberCard from "@/components/ui/MemberCard";
import Button from "@/components/ui/Button";
import { HiArrowRight, HiChevronRight, HiUsers } from "react-icons/hi";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Member } from "@/types/database";

const Team = () => {
  const [boardMembers, setBoardMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchBoardMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('miembros')
          .select('*')
          .eq('categoria', 'BOARD')
          .order('orden', { ascending: true });

        if (!ignore) {
          if (error) throw error;
          if (data) setBoardMembers(data);
        }
      } catch (error) {
        console.error('Error fetching board members:', error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBoardMembers();

    return () => {
      ignore = true;
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">

      {/*
       * FONDO ORBE — "respiración" suave via CSS puro.
       * hero-orb-a: ciclo 8s  |  hero-orb-b: ciclo 11s (desfasado)
       * Orbe izquierdo: azul IEEE | Orbe derecho: violeta tecnológico
       */}
      <div className="hero-orb-a absolute top-1/3 -left-32 w-[500px] h-[500px] bg-brand-accent rounded-full blur-[130px] -z-10" />
      <div className="hero-orb-b absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-[120px] -z-10" style={{ backgroundColor: "#7C3AED" }} />

      {/* Contenido principal — relative z-10 para quedar encima de los orbes */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
            Nuestro Equipo
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Conoce a la Junta Directiva
          </h3>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            El corazón de IEEE CIS UNI está compuesto por estudiantes talentosos y apasionados que lideran el camino hacia la excelencia.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {boardMembers.map((member) => (
                <motion.div key={member.id} variants={itemVariants}>
                  <MemberCard
                    name={member.nombre}
                    role={member.rol}
                    image={member.image_url || "/images/placeholder-member.png"}
                    linkedin={member.linkedin || "#"}
                    github={member.github || "#"}
                    interests={member.interests || []}
                  />
                </motion.div>
              ))}
            </motion.div>

            {boardMembers.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] mb-16">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mx-auto mb-4">
                  <HiUsers size={32} />
                </div>
                <p className="text-white/40">Sin miembros de la directiva registrados actualmente.</p>
              </div>
            )}
          </>
        )}

        <div className="text-center">
          <p className="text-white/50 mb-6 italic px-4">
            ¿Quieres conocer al resto de nuestra increíble comunidad o ser el próximo miembro?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/miembros" variant="outline" icon={<HiChevronRight />}>
              Ver todos los miembros
            </Button>
            <Button
              onClick={() => window.dispatchEvent(new CustomEvent('open-join-modal'))}
              icon={<HiArrowRight />}
            >
              Quiero ser parte
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
