import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/database";
import BlogPostView from "@/components/blog/BlogPostView";

interface BlogPostWithAuthor extends BlogPost {
  author?: {
    nombre: string;
    image_url: string | null;
    rol: string;
  };
}

// Revalida cada 5 minutos: los posts nuevos en Supabase aparecen sin
// necesidad de un redeploy completo (ISR).
export const revalidate = 300;

async function getPost(slug: string): Promise<BlogPostWithAuthor | null> {
  const { data, error } = await supabase
    .from('blog')
    .select('*, author:miembros(nombre, image_url, rol)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  return data;
}

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('blog')
    .select('slug')
    .eq('published', true);

  if (error || !data) return [];

  return data.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post no encontrado" };
  }

  return {
    title: post.titulo,
    description: post.excerpt,
    openGraph: {
      title: post.titulo,
      description: post.excerpt,
      type: "article",
      images: post.image_url ? [{ url: post.image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostView post={post} />;
}
