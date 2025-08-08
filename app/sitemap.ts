import { MetadataRoute } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServerClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://technews.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }
  ]

  // Category pages
  const categories = ['ia', 'smartphones', 'desarrollo-web', 'startups', 'ciberseguridad']
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/categoria/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Dynamic post pages
  let postPages: MetadataRoute.Sitemap = []
  
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (!error && posts) {
      postPages = posts.map(post => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
    }
  } catch (error) {
    console.error('Error generating sitemap for posts:', error)
  }

  return [...staticPages, ...categoryPages, ...postPages]
}
