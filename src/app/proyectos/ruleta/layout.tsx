import type { Metadata } from "next";

// La página de la ruleta es un Client Component y no puede exportar `metadata`,
// así que el título se define en este layout.
export const metadata: Metadata = {
  title: "Ruleta CIS",
  description: "Ruleta interactiva de IEEE CIS UNI para sortear turnos y áreas.",
};

export default function RuletaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
