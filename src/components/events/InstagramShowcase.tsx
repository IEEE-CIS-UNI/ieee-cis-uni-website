"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

const InstagramShowcase = () => {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";

  // Simulate recent posts (we can just reuse generic tech photos or team photos)
  const posts = [
    { id: 1, image: "/images/insta1.png", alt: "Publicación de Instagram 1" },
    { id: 2, image: "/images/insta2.1.png", alt: "Publicación de Instagram 2" },
    { id: 3, image: "/images/insta3.png", alt: "Publicación de Instagram 3" },
    { id: 4, image: "/images/insta4.png", alt: "Publicación de Instagram 4" },
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[var(--brand-text)] mb-4 tracking-tighter uppercase flex items-center justify-center gap-4">
            <FaInstagram className="text-brand-accent" /> Nuestro <span className="text-brand-accent">Instagram</span>
          </h2>
          <p className="text-[var(--brand-text-muted)] opacity-80 max-w-2xl mx-auto">
            Síguenos para enterarte de nuestras últimas novedades, fotos de eventos y detrás de cámaras de nuestra comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, idx) => (
            <motion.a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-[var(--brand-border)] block"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-accent/80 transition-colors duration-300 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md"
                >
                  <FaInstagram className="text-white text-3xl" />
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] shadow-sm rounded-full text-[var(--brand-text)] font-bold tracking-widest uppercase text-xs hover:bg-[var(--brand-surface)] hover:text-brand-accent transition-all"
          >
            <FaInstagram size={18} /> Ver más en Instagram
          </motion.a>
        </div>

      </div>
    </section>
  );
};

export default InstagramShowcase;
