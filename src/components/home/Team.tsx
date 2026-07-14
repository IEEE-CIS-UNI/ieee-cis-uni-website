"use client";

import { useState, useEffect } from "react";
import MemberCard from "@/components/ui/MemberCard";
import Button from "@/components/ui/Button";
import { HiArrowRight, HiChevronRight, HiUsers } from "react-icons/hi";
import { motion, Variants } from "framer-motion";
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

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const ctaVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">

      {/* Contenido principal — relative z-10 para quedar encima de los orbes */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          variants={headerVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">
            Nuestro Equipo
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-[var(--brand-text)] mb-6 leading-tight drop-shadow-sm">
            Conoce a la Junta Directiva
          </h3>
          <p className="text-[var(--brand-text-muted)] text-lg max-w-2xl mx-auto">
            El corazón de IEEE CIS UNI está compuesto por estudiantes talentosos y apasionados que lideran el camino hacia la excelencia.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[var(--brand-card)] rounded-3xl animate-pulse backdrop-blur-md" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16"
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {boardMembers.map((member) => (
                <motion.div key={member.id} variants={cardVariants}>
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
              <div className="text-center py-20 border border-dashed border-[var(--brand-border)] rounded-[3rem] mb-16 backdrop-blur-md">
                <div className="w-16 h-16 bg-[var(--brand-card)] rounded-2xl flex items-center justify-center text-[var(--brand-text-muted)] mx-auto mb-4 shadow-sm">
                  <HiUsers size={32} />
                </div>
                <p className="text-[var(--brand-text-muted)] opacity-70">Sin miembros de la directiva registrados actualmente.</p>
              </div>
            )}
          </>
        )}

        <motion.div 
          variants={ctaVariants} 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[var(--brand-text-muted)] mb-6 italic px-4">
            ¿Quieres conocer al resto de nuestra increíble comunidad o ser el próximo miembro?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/miembros" variant="outline" icon={<HiChevronRight />}>
              Ver todos los miembros
            </Button>
            <Button
              href="/contacto"
              icon={<HiArrowRight />}
            >
              Quiero ser parte
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
