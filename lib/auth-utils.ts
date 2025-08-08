import { createSupabaseServerClient } from './supabase'
import { Author } from './types'

export interface AuthResult {
  user: any | null
  author: Author | null
  error?: string
}

/**
 * Verifica si el usuario está autenticado y obtiene su perfil de autor
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        user: null,
        author: null,
        error: 'Usuario no autenticado'
      }
    }

    // Obtener perfil del autor
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('*')
      .eq('id', user.id)
      .single()

    if (authorError) {
      return {
        user,
        author: null,
        error: 'Error al obtener perfil de usuario'
      }
    }

    return {
      user,
      author,
      error: undefined
    }
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error)
    return {
      user: null,
      author: null,
      error: 'Error interno del servidor'
    }
  }
}

/**
 * Verifica si el usuario tiene rol de administrador
 */
export async function requireAdmin(): Promise<AuthResult> {
  const authResult = await getAuthenticatedUser()
  
  if (authResult.error) {
    return authResult
  }

  if (!authResult.author || authResult.author.role !== 'admin') {
    return {
      user: authResult.user,
      author: authResult.author,
      error: 'Se requieren permisos de administrador'
    }
  }

  return authResult
}

/**
 * Verifica si el usuario puede editar un post específico
 * (debe ser el autor del post o un admin)
 */
export async function canEditPost(postId: string): Promise<AuthResult & { canEdit: boolean }> {
  const authResult = await getAuthenticatedUser()
  
  if (authResult.error) {
    return { ...authResult, canEdit: false }
  }

  // Los admins pueden editar cualquier post
  if (authResult.author?.role === 'admin') {
    return { ...authResult, canEdit: true }
  }

  try {
    const supabase = await createSupabaseServerClient()
    
    // Verificar si el usuario es el autor del post
    const { data: post, error } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .single()

    if (error || !post) {
      return {
        ...authResult,
        canEdit: false,
        error: 'Post no encontrado'
      }
    }

    const canEdit = post.author_id === authResult.user?.id
    
    return {
      ...authResult,
      canEdit,
      error: canEdit ? undefined : 'No tienes permisos para editar este post'
    }
  } catch (error) {
    console.error('Error in canEditPost:', error)
    return {
      ...authResult,
      canEdit: false,
      error: 'Error al verificar permisos'
    }
  }
}

/**
 * Verifica si un slug ya existe (para evitar duplicados)
 */
export async function isSlugUnique(slug: string, excludePostId?: string): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient()
    
    let query = supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)

    if (excludePostId) {
      query = query.neq('id', excludePostId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error checking slug uniqueness:', error)
      return false
    }

    return data.length === 0
  } catch (error) {
    console.error('Error in isSlugUnique:', error)
    return false
  }
}

/**
 * Middleware helper para APIs que requieren autenticación
 */
export function withAuth(handler: (authResult: AuthResult, ...args: any[]) => Promise<Response>) {
  return async (...args: any[]) => {
    const authResult = await getAuthenticatedUser()
    
    if (authResult.error) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return handler(authResult, ...args)
  }
}

/**
 * Middleware helper para APIs que requieren permisos de admin
 */
export function withAdmin(handler: (authResult: AuthResult, ...args: any[]) => Promise<Response>) {
  return async (...args: any[]) => {
    const authResult = await requireAdmin()
    
    if (authResult.error) {
      const status = authResult.user ? 403 : 401
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { 
          status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return handler(authResult, ...args)
  }
}
