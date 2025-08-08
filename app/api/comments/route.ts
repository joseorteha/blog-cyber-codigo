import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation schema for comments
const CreateCommentSchema = z.object({
  post_id: z.string().uuid('ID de post inválido'),
  content: z.string()
    .min(1, 'El comentario no puede estar vacío')
    .max(2000, 'El comentario es demasiado largo'),
  parent_id: z.string().uuid().nullable().optional(),
  // For guest comments
  author_name: z.string().min(1).max(100).optional(),
  author_email: z.string().email().optional(),
  author_website: z.string().url().optional().or(z.literal(''))
})

const UpdateCommentSchema = z.object({
  content: z.string()
    .min(1, 'El comentario no puede estar vacío')
    .max(2000, 'El comentario es demasiado largo'),
  status: z.enum(['pending', 'approved', 'rejected', 'spam']).optional()
})

// GET /api/comments - Get comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('post_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'approved'

    if (!postId) {
      return NextResponse.json(
        { error: 'post_id es requerido' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()
    
    // Check if user is moderator to see all comments
    const authResult = await getAuthenticatedUser()
    const isModerator = authResult.author?.role === 'admin' || authResult.author?.role === 'moderator'
    
    let query = supabase
      .from('comments')
      .select(`
        id,
        content,
        author_name,
        author_email,
        author_website,
        parent_id,
        status,
        created_at,
        updated_at,
        author:authors(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    // Apply status filter based on permissions
    if (isModerator && status !== 'approved') {
      query = query.eq('status', status)
    } else {
      query = query.eq('status', 'approved')
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: comments, error, count } = await query
      .range(from, to)

    if (error) {
      console.error('Error fetching comments:', error)
      throw error
    }

    // Build comment tree (organize replies under parent comments)
    const commentTree = buildCommentTree(comments || [])

    return NextResponse.json({
      comments: commentTree,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in GET /api/comments:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = CreateCommentSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return NextResponse.json(
        { error: 'Datos inválidos', details: errors },
        { status: 400 }
      )
    }

    const { post_id, content, parent_id, author_name, author_email, author_website } = validationResult.data

    const supabase = await createSupabaseServerClient()
    
    // Get user info (optional for guest comments)
    const authResult = await getAuthenticatedUser()
    
    // Get client IP for moderation
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Prepare comment data
    const commentData: any = {
      post_id,
      content: sanitizeHtml(content), // Sanitize HTML content
      parent_id: parent_id || null,
      ip_address: ip,
      user_agent: userAgent,
      status: 'pending' // All comments start as pending
    }

    // Handle authenticated vs guest comments
    if (authResult.user && !authResult.error) {
      commentData.author_id = authResult.user.id
    } else {
      // Guest comment - require name and email
      if (!author_name || !author_email) {
        return NextResponse.json(
          { error: 'Nombre y email son requeridos para comentarios de invitados' },
          { status: 400 }
        )
      }
      commentData.author_name = author_name
      commentData.author_email = author_email
      commentData.author_website = author_website || null
    }

    // Verify post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, published')
      .eq('id', post_id)
      .single()

    if (postError || !post || !post.published) {
      return NextResponse.json(
        { error: 'Post no encontrado o no publicado' },
        { status: 404 }
      )
    }

    // Verify parent comment exists if provided
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parent_id)
        .eq('post_id', post_id)
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json(
          { error: 'Comentario padre no encontrado' },
          { status: 404 }
        )
      }
    }

    // Insert comment
    const { data: newComment, error: insertError } = await supabase
      .from('comments')
      .insert([commentData])
      .select(`
        id,
        content,
        author_name,
        parent_id,
        status,
        created_at,
        author:authors(
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (insertError) {
      console.error('Error creating comment:', insertError)
      throw insertError
    }

    return NextResponse.json({
      ...newComment,
      message: 'Comentario enviado. Será revisado antes de publicarse.'
    }, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/comments:', error)
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}

// Helper function to build comment tree
function buildCommentTree(comments: any[]): any[] {
  const commentMap = new Map()
  const rootComments: any[] = []

  // Create a map of comments by ID
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Build the tree structure
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)
    
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      // This is a reply, add it to parent's replies
      const parent = commentMap.get(comment.parent_id)
      parent.replies.push(commentWithReplies)
    } else {
      // This is a root comment
      rootComments.push(commentWithReplies)
    }
  })

  return rootComments
}

// Simple HTML sanitization (remove dangerous tags)
function sanitizeHtml(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
}
