"use client";

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
            <a
              key={post.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-fade-in-up group relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-[var(--brand-border)] block bg-[var(--brand-surface)]"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Blurred bg fill for portrait images */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-110 blur-lg opacity-30"
                style={{ backgroundImage: `url('${post.image}')` }}
              />
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-brand-accent/80 transition-colors duration-300 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md scale-0 group-hover:scale-100 transition-transform duration-300">
                  <FaInstagram className="text-white text-3xl" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-card)] backdrop-blur-md border border-[var(--brand-border)] shadow-sm rounded-full text-[var(--brand-text)] font-bold tracking-widest uppercase text-xs hover:bg-[var(--brand-surface)] hover:text-brand-accent hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <FaInstagram size={18} /> Ver más en Instagram
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramShowcase;
