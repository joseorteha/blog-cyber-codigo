import { z } from 'zod'

// Validation schemas for blog
export const PostCreateSchema = z.object({
  title: z.string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  
  slug: z.string()
    .min(1, 'El slug es requerido')
    .max(100, 'El slug no puede exceder 100 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  
  excerpt: z.string()
    .min(1, 'El resumen es requerido')
    .max(500, 'El resumen no puede exceder 500 caracteres'),
  
  content: z.string()
    .min(1, 'El contenido es requerido')
    .max(50000, 'El contenido es demasiado largo'),
  
  image_url: z.string()
    .url('La URL de la imagen debe ser válida')
    .optional()
    .or(z.literal('')),
  
  category: z.string()
    .min(1, 'La categoría es requerida')
    .refine((val) => ['ia', 'smartphones', 'desarrollo-web', 'startups', 'ciberseguridad'].includes(val), {
      message: 'Categoría no válida'
    }),
  
  published: z.boolean(),
  
  tags: z.array(z.string())
    .max(10, 'No puedes tener más de 10 tags')
    .optional()
    .default([])
})

export const PostUpdateSchema = PostCreateSchema.partial().extend({
  id: z.string().uuid('ID de post inválido')
})

export const AuthorUpdateSchema = z.object({
  full_name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .optional(),
  
  avatar_url: z.string()
    .url('La URL del avatar debe ser válida')
    .optional()
    .or(z.literal(''))
})

export const SearchQuerySchema = z.object({
  page: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, 'La página debe ser mayor a 0')
    .optional()
    .default('1'),
  
  limit: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 50, 'El límite debe estar entre 1 y 50')
    .optional()
    .default('10'),
  
  category: z.string()
    .refine((val) => ['ia', 'smartphones', 'desarrollo-web', 'startups', 'ciberseguridad'].includes(val), {
      message: 'Categoría no válida'
    })
    .optional(),
  
  search: z.string()
    .min(1, 'El término de búsqueda no puede estar vacío')
    .max(100, 'El término de búsqueda es demasiado largo')
    .optional(),
  
  published: z.string()
    .refine((val) => ['true', 'false'].includes(val), 'Estado de publicación inválido')
    .optional()
})

// Helper function to validate and sanitize search queries
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/['"]/g, "''") // Escape quotes for SQL safety
    .trim()
}

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Type exports for use in components
export type PostCreateInput = z.infer<typeof PostCreateSchema>
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>
export type AuthorUpdateInput = z.infer<typeof AuthorUpdateSchema>
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>
