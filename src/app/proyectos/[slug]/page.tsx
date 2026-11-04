import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
import { resolveAuthors, ProjectAuthor } from "@/lib/authors";

// Revalida cada 5 minutos: los proyectos nuevos en Supabase aparecen sin
// necesidad de un redeploy completo (ISR).
export const revalidate = 300;

async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

// Equipo del proyecto: los nombres de `proyectos.autores` que coinciden con la
// tabla `miembros` se muestran con su foto y LinkedIn.
async function getAuthors(project: Project): Promise<ProjectAuthor[]> {
  if (!project.autores?.length) return [];

  const { data, error } = await supabase
    .from('miembros')
    .select('nombre, image_url, linkedin');

  if (error) {
    console.error('Error fetching members for project authors:', error);
  }

  return resolveAuthors(project.autores, data ?? []);
}

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('proyectos')
    .select('slug');

  if (error || !data) return [];

  return data.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Proyecto no encontrado" };
  }

  const description = project.descripcion_larga || project.descripcion_corta;

  return {
    title: project.titulo,
    description,
    openGraph: {
      title: project.titulo,
      description,
      type: "article",
      images: project.image_url ? [{ url: project.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.titulo,
      description,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const authors = await getAuthors(project);

  return <ProjectDetailView project={project} authors={authors} />;
}
