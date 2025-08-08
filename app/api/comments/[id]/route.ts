import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getAuthenticatedUser, requireAdmin } from '@/lib/auth-utils'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

interface Params {
  params: Promise<{ id: string }>
}

const UpdateCommentSchema = z.object({
  content: z.string()
    .min(1, 'El comentario no puede estar vacío')
    .max(2000, 'El comentario es demasiado largo')
    .optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'spam']).optional()
})

// GET /api/comments/[id] - Get single comment
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID de comentario inválido' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()
    const authResult = await getAuthenticatedUser()
    
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
        post_id,
        author:authors(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)

    // Only show approved comments to non-moderators
    const isModerator = authResult.author?.role === 'admin' || authResult.author?.role === 'moderator'
    const isAuthor = authResult.user?.id
    
    if (!isModerator) {
      query = query.or(`status.eq.approved,author_id.eq.${isAuthor}`)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Comentario no encontrado' },
          { status: 404 }
        )
      }
      console.error('Error fetching comment:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Error al obtener comentario' },
      { status: 500 }
    )
  }
}

// PUT /api/comments/[id] - Update comment
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID de comentario inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = UpdateCommentSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return NextResponse.json(
        { error: 'Datos inválidos', details: errors },
        { status: 400 }
      )
    }

    const updateData = validationResult.data
    const supabase = await createSupabaseServerClient()
    
    // Get comment to check permissions
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('author_id, status')
      .eq('id', id)
      .single()

    if (fetchError || !comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    const authResult = await getAuthenticatedUser()
    const isModerator = authResult.author?.role === 'admin' || authResult.author?.role === 'moderator'
    const isAuthor = comment.author_id === authResult.user?.id

    // Check permissions
    if (updateData.status && !isModerator) {
      return NextResponse.json(
        { error: 'Solo los moderadores pueden cambiar el estado' },
        { status: 403 }
      )
    }

    if (updateData.content && !isAuthor && !isModerator) {
      return NextResponse.json(
        { error: 'Solo el autor o moderadores pueden editar el contenido' },
        { status: 403 }
      )
    }

    // Prepare update data
    const finalUpdateData: any = {
      updated_at: new Date().toISOString()
    }

    if (updateData.content) {
      finalUpdateData.content = sanitizeHtml(updateData.content)
      // If author edits content, reset to pending for re-moderation
      if (isAuthor && !isModerator) {
        finalUpdateData.status = 'pending'
      }
    }

    if (updateData.status && isModerator) {
      finalUpdateData.status = updateData.status
    }

    // Update comment
    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .update(finalUpdateData)
      .eq('id', id)
      .select(`
        id,
        content,
        author_name,
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
      .single()

    if (updateError) {
      console.error('Error updating comment:', updateError)
      throw updateError
    }

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error('Error in PUT /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Error al actualizar comentario' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments/[id] - Delete comment
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID de comentario inválido' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()
    
    // Get comment to check permissions
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError || !comment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    const authResult = await getAuthenticatedUser()
    const isModerator = authResult.author?.role === 'admin' || authResult.author?.role === 'moderator'
    const isAuthor = comment.author_id === authResult.user?.id

    // Check permissions - only author or moderators can delete
    if (!isAuthor && !isModerator) {
      return NextResponse.json(
        { error: 'Sin permisos para eliminar este comentario' },
        { status: 403 }
      )
    }

    // Delete comment (this will also delete replies due to CASCADE)
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting comment:', deleteError)
      throw deleteError
    }

    return NextResponse.json({ 
      message: 'Comentario eliminado correctamente',
      id 
    })
  } catch (error) {
    console.error('Error in DELETE /api/comments/[id]:', error)
    return NextResponse.json(
      { error: 'Error al eliminar comentario' },
      { status: 500 }
    )
  }
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
