// Configuración de la API de noticias
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || 'demo'
const NEWS_API_BASE_URL = 'https://newsapi.org/v2'

export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

// Función para obtener noticias tecnológicas
export async function getTechNews(country: string = 'us', pageSize: number = 20): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=${country}&category=technology&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo noticias:', error)
    throw error
  }
}

// Función para buscar noticias por término
export async function searchTechNews(query: string, pageSize: number = 20): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=es&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error buscando noticias:', error)
    throw error
  }
}

// Función para obtener noticias de IA específicamente
export async function getAINews(pageSize: number = 20): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=artificial intelligence OR AI&language=es&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo noticias de IA:', error)
    throw error
  }
}

// Función para obtener noticias de startups
export async function getStartupNews(pageSize: number = 20): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=startup OR startups&language=es&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo noticias de startups:', error)
    throw error
  }
}

// Función para obtener noticias de ciberseguridad
export async function getCybersecurityNews(pageSize: number = 20): Promise<NewsResponse> {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=cybersecurity OR "cyber security" OR hacking&language=es&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`)
    }

    const data: NewsResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo noticias de ciberseguridad:', error)
    throw error
  }
}

// Función para formatear la fecha
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Función para truncar texto
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Función para obtener imagen por defecto
export function getDefaultImage(): string {
  return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
}
