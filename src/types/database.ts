export type Member = {
  id: string;
  nombre: string;
  rol: string;
  categoria: string;
  image_url: string | null;
  linkedin: string | null;
  github: string | null;
  interests: string[];
  orden: number;
};

export type Project = {
  id: string;
  titulo: string;
  slug: string;
  descripcion_corta: string;
  descripcion_larga: string | null;
  image_url: string | null;
  tags: string[];
  estado: string;
  github_link: string | null;
  demo_link: string | null;
  highlighted: boolean;
  created_at: string;
};

export type Event = {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  hora: string | null;
  ubicacion: string;
  image_url: string | null;
  link_registro: string | null;
  is_past: boolean;
  categoria: string | null;
  ponente: string | null;
};

export type BlogPost = {
  id: string;
  titulo: string;
  slug: string;
  excerpt: string;
  contenido: string;
  image_url: string | null;
  author_id: string | null;
  read_time: string | null;
  category: string | null;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  published: boolean;
  created_at: string;
};
