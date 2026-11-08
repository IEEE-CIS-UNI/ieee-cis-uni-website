import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { SITE_URL } from '@/lib/site'

// Se regenera cada hora con datos frescos de Supabase. Sin esto quedaba fijo
// desde el build (con slugs viejos) hasta el siguiente deploy.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  // Static routes
  const staticRoutes = [
    '',
    '/nosotros',
    '/miembros',
    '/proyectos',
    '/proyectos/ruleta',
    '/eventos',
    '/blog',
    '/contacto',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes from Supabase
  try {
    const [projectsRes, blogRes] = await Promise.all([
      supabase.from('proyectos').select('slug, created_at'),
      supabase.from('blog').select('slug, created_at').eq('published', true)
    ])

    const projectRoutes = (projectsRes.data || []).map((p) => ({
      url: `${baseUrl}/proyectos/${p.slug}`,
      lastModified: new Date(p.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    const blogRoutes = (blogRes.data || []).map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: new Date(b.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...projectRoutes, ...blogRoutes]
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
    return staticRoutes
  }
}
