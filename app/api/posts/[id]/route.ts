
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { canEditPost, isSlugUnique } from '@/lib/auth-utils'
import { PostUpdateSchema, generateSlug } from '@/lib/validations'
import { Post } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Cache individual posts for 1 minute

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse<Post | { error: string }>> {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID de post inválido' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:authors(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Post no encontrado' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Error al obtener el post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID de post inválido' },
        { status: 400 }
      )
    }

    // Check if user can edit this post
    const authResult = await canEditPost(id)
    if (authResult.error || !authResult.canEdit) {
      const status = authResult.user ? 403 : 401
      return NextResponse.json(
        { error: authResult.error || 'Sin permisos para editar este post' },
        { status }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = PostUpdateSchema.safeParse({ ...body, id })
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return NextResponse.json(
        { error: 'Datos inválidos', details: errors },
        { status: 400 }
      )
    }

    const { id: _, ...updateData } = validationResult.data
    
    // Check slug uniqueness if slug is being updated
    if (updateData.slug) {
      const slugIsUnique = await isSlugUnique(updateData.slug, id)
      if (!slugIsUnique) {
        return NextResponse.json(
          { error: 'El slug ya está en uso' },
          { status: 409 }
        )
      }
    }

    const supabase = await createSupabaseServerClient()
    
    // Prepare update data
    const finalUpdateData: any = {
      ...updateData,
      updated_at: new Date().toISOString()
    }
    
    // Handle published_at field
    if (updateData.published !== undefined) {
      finalUpdateData.published_at = updateData.published ? new Date().toISOString() : null
    }

    // Update the post
    const { data, error } = await supabase
      .from('posts')
      .update(finalUpdateData)
      .eq('id', id)
      .select(`
        *,
        author:authors(*)
      `)
      .single()

    if (error) {
      console.error('Supabase error updating post:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'ID de post inválido' },
        { status: 400 }
      )
    }

    // Check if user can edit this post (same permission needed for deletion)
    const authResult = await canEditPost(id)
    if (authResult.error || !authResult.canEdit) {
      const status = authResult.user ? 403 : 401
      return NextResponse.json(
        { error: authResult.error || 'Sin permisos para eliminar este post' },
        { status }
      )
    }

    const supabase = await createSupabaseServerClient()
    
    // Delete the post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error deleting post:', error)
      throw error
    }

    return NextResponse.json({ 
      message: 'Post eliminado correctamente',
      id 
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el post' },
      { status: 500 }
    )
  }
}
