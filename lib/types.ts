// Blog-specific types for TechNews
export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url?: string
  author_id: string
  category: string
  published: boolean
  published_at?: string
  created_at: string
  updated_at: string
  tags?: string[]
  author?: Author
}

export interface Author {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  bio?: string
  website?: string
  twitter?: string
  github?: string
  role: 'admin' | 'moderator' | 'user'
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface CreatePostData {
  title: string
  slug: string
  excerpt: string
  content: string
  image_url?: string
  category: string
  published: boolean
  tags?: string[]
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string
}

export interface PostsResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  page?: string
  limit?: string
  category?: string
  search?: string
  published?: string
}

// Blog categories constants
export const BLOG_CATEGORIES = [
  'ia',
  'smartphones', 
  'desarrollo-web',
  'startups',
  'ciberseguridad'
] as const

export type BlogCategory = typeof BLOG_CATEGORIES[number]

// Date range for filters
export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}