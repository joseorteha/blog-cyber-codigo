import { createSupabaseClient } from './supabase'

/**
 * Incrementa el contador de vistas de un post
 */
export async function incrementViewCount(postId: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    // Incrementar view_count
    const { error } = await supabase
      .from('posts')
      .update({ 
        view_count: supabase.sql`view_count + 1` 
      })
      .eq('id', postId)

    if (error) {
      console.error('Error incrementing view count:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in incrementViewCount:', error)
    return false
  }
}

/**
 * Obtiene las estadísticas de un post
 */
export async function getPostStats(postId: string) {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        view_count,
        reading_time,
        created_at,
        published_at
      `)
      .eq('id', postId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error getting post stats:', error)
    return null
  }
}

/**
 * Obtiene las estadísticas generales del blog
 */
export async function getBlogStats() {
  try {
    const supabase = createSupabaseClient()
    
    // Total posts
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })

    // Published posts
    const { count: publishedPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)

    // Total views
    const { data: viewData } = await supabase
      .from('posts')
      .select('view_count')
      .eq('published', true)

    const totalViews = viewData?.reduce((sum: number, post: { view_count?: number }) => sum + (post.view_count || 0), 0) || 0

    // Total comments
    const { count: totalComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    return {
      totalPosts: totalPosts || 0,
      publishedPosts: publishedPosts || 0,
      totalViews,
      totalComments: totalComments || 0
    }
  } catch (error) {
    console.error('Error getting blog stats:', error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      totalViews: 0,
      totalComments: 0
    }
  }
}

/**
 * Calcula el tiempo de lectura estimado
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Formatea un número de vistas
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
