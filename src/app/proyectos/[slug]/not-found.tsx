import Button from "@/components/ui/Button";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-[var(--brand-background)] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-[var(--brand-text)] mb-4 uppercase tracking-tighter">Proyecto no encontrado</h1>
      <p className="text-[var(--brand-text-muted)] mb-8 max-w-md">El proyecto que buscas no existe o ha sido movido. Verifica la URL e inténtalo de nuevo.</p>
      <Button href="/proyectos" variant="outline">Volver a Proyectos</Button>
    </div>
  );
}
