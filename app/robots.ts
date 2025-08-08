import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://technews.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/post/*',
          '/categoria/*',
          '/search',
          '/contacto'
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/_next/*',
          '/private/*'
        ],
      },
      // Specific rules for search engines
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/post/*',
          '/categoria/*',
          '/search',
          '/contacto'
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/auth/*'
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
