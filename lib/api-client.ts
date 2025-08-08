import { Post, PostsResponse, CreatePostData, UpdatePostData } from './types'

// Base API URL
const API_BASE = '/api'

// Helper function for API calls with error handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error de red' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

// Posts API functions
export const postsApi = {
  // Get all posts with pagination and filters
  async getAll(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    published?: boolean
  }): Promise<PostsResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.published !== undefined) searchParams.set('published', params.published.toString())

    const queryString = searchParams.toString()
    return apiCall<PostsResponse>(`/posts${queryString ? `?${queryString}` : ''}`)
  },

  // Get single post by ID
  async getById(id: string): Promise<Post> {
    return apiCall<Post>(`/posts/${id}`)
  },

  // Create new post (admin only)
  async create(data: CreatePostData): Promise<Post> {
    return apiCall<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Update existing post (admin/author only)
  async update(id: string, data: Partial<UpdatePostData>): Promise<Post> {
    return apiCall<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Delete post (admin/author only)
  async delete(id: string): Promise<{ message: string; id: string }> {
    return apiCall(`/posts/${id}`, {
      method: 'DELETE',
    })
  },

  // Publish/unpublish post (admin only)
  async togglePublish(id: string, published: boolean): Promise<Post> {
    return apiCall<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ published }),
    })
  }
}

// Utility functions for the frontend
export const utils = {
  // Format date for display
  formatDate(dateString: string, locale = 'es-ES'): string {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },

  // Format relative time
  formatRelativeTime(dateString: string, locale = 'es-ES'): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const intervals = {
      año: 31536000,
      mes: 2592000,
      semana: 604800,
      día: 86400,
      hora: 3600,
      minuto: 60
    }

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds)
      if (interval >= 1) {
        return `hace ${interval} ${unit}${interval > 1 ? (unit === 'mes' ? 'es' : 's') : ''}`
      }
    }

    return 'hace un momento'
  },

  // Truncate text
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength).replace(/\s+\S*$/, '') + '...'
  },

  // Generate reading time estimate
  getReadingTime(content: string): string {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min de lectura`
  },

  // Validate slug format
  isValidSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug)
  },

  // Generate SEO-friendly slug
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  },

  // Get category display name
  getCategoryDisplayName(slug: string): string {
    const categoryNames: Record<string, string> = {
      'ia': 'Inteligencia Artificial',
      'smartphones': 'Smartphones',
      'desarrollo-web': 'Desarrollo Web',
      'startups': 'Startups',
      'ciberseguridad': 'Ciberseguridad'
    }
    return categoryNames[slug] || slug
  },

  // Get category color
  getCategoryColor(slug: string): string {
    const colors: Record<string, string> = {
      'ia': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'smartphones': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'desarrollo-web': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'startups': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'ciberseguridad': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[slug] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Error handling helper
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// React hook for loading states (can be used with React Query)
export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Cache helper for client-side caching
export const cache = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const { data, expiry } = JSON.parse(item)
      if (Date.now() > expiry) {
        localStorage.removeItem(key)
        return null
      }
      
      return data
    } catch {
      return null
    }
  },

  set<T>(key: string, data: T, ttlMinutes = 5): void {
    try {
      const expiry = Date.now() + (ttlMinutes * 60 * 1000)
      localStorage.setItem(key, JSON.stringify({ data, expiry }))
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch {
      // Silently fail
    }
  }
}
