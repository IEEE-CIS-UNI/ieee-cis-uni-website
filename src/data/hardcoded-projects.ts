import { Project } from "@/types/database";

// "Ruleta CIS" no vive en Supabase (es una herramienta interna, no un proyecto real),
// pero se muestra junto a los proyectos en Home y en /proyectos.
export const RULETA_PROJECT = {
  id: 'ruleta-cis-hardcoded',
  titulo: 'Ruleta CIS',
  descripcion_corta: 'Descubre qué área hosteará el próximo evento con nuestra ruleta interactiva.',
  image_url: '/images/pinguinocis.png',
  tags: ['INTERACTIVO', 'EVENTOS'],
  slug: 'ruleta'
} as Project;
