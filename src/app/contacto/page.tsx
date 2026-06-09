import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";

export const metadata = {
  title: "Contacto | IEEE CIS UNI",
  description: "Ponte en contacto con el capítulo estudiantil IEEE CIS de la Universidad Nacional de Ingeniería. Estamos listos para colaborar y responder tus dudas.",
};

export default function ContactPage() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fondo de Orbes fijo global (estilo Home) */}
      <div className="hero-orb-a fixed top-1/4 -left-20 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[160px] opacity-50 -z-20 pointer-events-none" />
      <div className="hero-orb-b fixed bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 -z-20 pointer-events-none" style={{ backgroundColor: "#7C3AED" }} />

      <main className="relative z-10">
        <ContactHero />
        <ContactSection />
      </main>
    </div>
  );
}
