import { Metadata } from 'next'
import { Post, Author } from './types'

interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultDescription: string
  defaultImage: string
  twitterHandle: string
  locale: string
}

const seoConfig: SEOConfig = {
  siteName: 'TechNews - Blog de Noticias Tecnológicas',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://technews.com',
  defaultDescription: 'Las últimas noticias y tendencias en tecnología, IA, smartphones, desarrollo web y startups.',
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@technews',
  locale: 'es_ES'
}

export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: {
      default: seoConfig.siteName,
      template: `%s | ${seoConfig.siteName}`
    },
    description: seoConfig.defaultDescription,
    keywords: [
      'tecnología',
      'noticias tech',
      'inteligencia artificial',
      'smartphones',
      'desarrollo web',
      'startups',
      'ciberseguridad',
      'innovación',
      'gadgets',
      'software'
    ],
    authors: [{ name: 'TechNews Team' }],
    creator: 'TechNews',
    publisher: 'TechNews',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: seoConfig.locale,
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      title: seoConfig.siteName,
      description: seoConfig.defaultDescription,
      images: [
        {
          url: seoConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: seoConfig.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title: seoConfig.siteName,
      description: seoConfig.defaultDescription,
      images: [seoConfig.defaultImage],
    },
    alternates: {
      canonical: seoConfig.siteUrl,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  }
}

export function generatePostMetadata(post: Post, author?: Author): Metadata {
  const postUrl = `${seoConfig.siteUrl}/post/${post.slug}`
  const imageUrl = post.image_url || seoConfig.defaultImage
  
  // Calculate reading time
  const wordCount = post.content.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [
      ...post.tags || [],
      post.category,
      'tecnología',
      'noticias tech'
    ],
    authors: author ? [{ 
      name: author.full_name || author.email,
      url: author.avatar_url 
    }] : undefined,
    // publishedTime: post.published_at || post.created_at, // Not supported in Next.js metadata
    // modifiedTime: post.updated_at, // Not supported in Next.js metadata
    openGraph: {
      type: 'article',
      locale: seoConfig.locale,
      url: postUrl,
      siteName: seoConfig.siteName,
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: author ? [author.full_name || author.email] : undefined,
      tags: post.tags,
      section: getCategoryDisplayName(post.category),
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    other: {
      'article:reading_time': readingTime.toString(),
      'article:word_count': wordCount.toString(),
    },
  }
}

export function generateCategoryMetadata(categorySlug: string): Metadata {
  const categoryName = getCategoryDisplayName(categorySlug)
  const categoryUrl = `${seoConfig.siteUrl}/categoria/${categorySlug}`
  const description = getCategoryDescription(categorySlug)

  return {
    title: `${categoryName} - Noticias de Tecnología`,
    description,
    keywords: [
      categorySlug,
      categoryName.toLowerCase(),
      'tecnología',
      'noticias',
      'artículos'
    ],
    openGraph: {
      type: 'website',
      locale: seoConfig.locale,
      url: categoryUrl,
      siteName: seoConfig.siteName,
      title: `${categoryName} - ${seoConfig.siteName}`,
      description,
      images: [
        {
          url: seoConfig.defaultImage,
          width: 1200,
          height: 630,
          alt: `${categoryName} - ${seoConfig.siteName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      title: `${categoryName} - ${seoConfig.siteName}`,
      description,
      images: [seoConfig.defaultImage],
    },
    alternates: {
      canonical: categoryUrl,
    },
  }
}

export function generateSearchMetadata(query?: string): Metadata {
  const searchUrl = `${seoConfig.siteUrl}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`
  const title = query ? `Resultados para "${query}"` : 'Buscar en TechNews'
  const description = query 
    ? `Resultados de búsqueda para "${query}" en ${seoConfig.siteName}`
    : `Busca artículos sobre tecnología, IA, smartphones y más en ${seoConfig.siteName}`

  return {
    title,
    description,
    robots: {
      index: false, // Don't index search results
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: seoConfig.locale,
      url: searchUrl,
      siteName: seoConfig.siteName,
      title: `${title} - ${seoConfig.siteName}`,
      description,
    },
    twitter: {
      card: 'summary',
      site: seoConfig.twitterHandle,
      title: `${title} - ${seoConfig.siteName}`,
      description,
    },
    alternates: {
      canonical: searchUrl,
    },
  }
}

// Helper functions
function getCategoryDisplayName(slug: string): string {
  const categoryNames: Record<string, string> = {
    'ia': 'Inteligencia Artificial',
    'smartphones': 'Smartphones',
    'desarrollo-web': 'Desarrollo Web',
    'startups': 'Startups',
    'ciberseguridad': 'Ciberseguridad'
  }
  return categoryNames[slug] || slug
}

function getCategoryDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    'ia': 'Últimas noticias sobre inteligencia artificial, machine learning, deep learning y avances en IA.',
    'smartphones': 'Novedades en dispositivos móviles, reviews de smartphones, apps y tecnología móvil.',
    'desarrollo-web': 'Tendencias en desarrollo web, frameworks, herramientas y tecnologías para desarrolladores.',
    'startups': 'Noticias del ecosistema emprendedor, inversiones, startups tecnológicas y innovación.',
    'ciberseguridad': 'Seguridad informática, ciberataques, privacidad digital y protección de datos.'
  }
  return descriptions[slug] || `Noticias y artículos sobre ${getCategoryDisplayName(slug).toLowerCase()}.`
}

// Structured data generators
export function generatePostStructuredData(post: Post, author?: Author) {
  const postUrl = `${seoConfig.siteUrl}/post/${post.slug}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url || seoConfig.defaultImage,
    url: postUrl,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: author ? {
      '@type': 'Person',
      name: author.full_name || author.email,
      image: author.avatar_url,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: getCategoryDisplayName(post.category),
    keywords: post.tags?.join(', '),
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: `${seoConfig.siteUrl}/logo.png`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
