import MemberHero from "@/components/members/MemberHero";
import MemberDirectory from "@/components/members/MemberDirectory";
import BrandOrbs from "@/components/ui/BrandOrbs";

export const metadata = {
  title: "Miembros",
  description: "Conoce a la junta directiva y al equipo del capítulo estudiantil IEEE CIS UNI.",
};

export default function MembersPage() {
  return (
    <main className="relative">
      {/* Mismo fondo de marca que el resto de la web */}
      <BrandOrbs />

      <MemberHero />
      <MemberDirectory />
    </main>
  );
}
