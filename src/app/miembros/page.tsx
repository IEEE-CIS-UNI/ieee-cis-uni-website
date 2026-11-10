import MemberHero from "@/components/members/MemberHero";
import MemberDirectory from "@/components/members/MemberDirectory";
import BrandOrbs from "@/components/ui/BrandOrbs";
import { getAllMembers } from "@/lib/queries";

// Los datos se piden en el servidor y van en el HTML (ver src/lib/queries.ts).
// Se regenera como máximo cada 60 s; los componentes además consultan en segundo
// plano, así un cambio en Supabase se ve al recargar como antes.
export const revalidate = 60;

export const metadata = {
  title: "Miembros",
  description: "Conoce a la junta directiva y al equipo del capítulo estudiantil IEEE CIS UNI.",
};

export default async function MembersPage() {
  const members = await getAllMembers();

  return (
    <main className="relative">
      {/* Mismo fondo de marca que el resto de la web */}
      <BrandOrbs />

      <MemberHero />
      <MemberDirectory initialMembers={members} />
    </main>
  );
}
