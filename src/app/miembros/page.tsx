import MemberHero from "@/components/members/MemberHero";
import MemberDirectory from "@/components/members/MemberDirectory";

export default function MembersPage() {
  return (
    <main className="relative">
      {/*
       * FONDO ORBE FIJO — position: fixed con z-index -10
       * Los orbes permanecen quietos mientras el usuario hace scroll
       * hasta llegar al footer. Un único punto de control para toda la página.
       */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      >
        {/* Orbe azul IEEE — lado izquierdo */}
        <div className="hero-orb-a absolute top-1/3 -left-40 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[160px] opacity-100" />
        {/* Orbe violeta tecnológico — lado derecho (más intenso y grande) */}
        <div className="hero-orb-b absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-100" style={{ backgroundColor: "#7C3AED" }} />
        {/* Tercer orbe — azul tenue en la esquina inferior izquierda para balance */}
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-brand-accent rounded-full blur-[180px] opacity-50" />
      </div>

      <MemberHero />
      <MemberDirectory />
    </main>
  );
}
