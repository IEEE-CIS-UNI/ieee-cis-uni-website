import Button from "@/components/ui/Button";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-[var(--brand-background)] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-[var(--brand-text)] mb-4 uppercase tracking-tighter">Post no encontrado</h1>
      <p className="text-[var(--brand-text-muted)] mb-8 max-w-md">El artículo que buscas no existe o ha sido movido.</p>
      <Button href="/blog" variant="outline">Volver al Blog</Button>
    </div>
  );
}
