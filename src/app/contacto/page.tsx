import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import BrandOrbs from "@/components/ui/BrandOrbs";

export const metadata = {
  title: "Contacto",
  description: "Ponte en contacto con el capítulo estudiantil IEEE CIS de la Universidad Nacional de Ingeniería. Estamos listos para colaborar y responder tus dudas.",
};

export default function ContactPage() {
  return (
    <div className="relative w-full min-h-svh overflow-hidden">
      {/* Fondo de Orbes fijo global (estilo Home) */}
      <BrandOrbs />

      <main className="relative z-10">
        <ContactHero />
        <ContactSection />
      </main>
    </div>
  );
}
