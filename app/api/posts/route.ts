
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'
import { SearchQuerySchema, sanitizeSearchQuery } from '@/lib/validations'
import { PostsResponse } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache for 5 minutes

export async function GET(request: NextRequest): Promise<NextResponse<PostsResponse | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validate search parameters
    const validationResult = SearchQuerySchema.safeParse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
      published: searchParams.get('published') || undefined
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Parámetros de búsqueda inválidos' },
        { status: 400 }
      )
    }

    const { page, limit, category, search, published } = validationResult.data
    const supabase = await createSupabaseServerClient()
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:authors(*)
      `, { count: 'exact' })

    // Add filters
    if (published !== undefined) {
      query = query.eq('published', published === 'true')
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search)
      query = query.or(`title.ilike.%${sanitizedSearch}%,content.ilike.%${sanitizedSearch}%,excerpt.ilike.%${sanitizedSearch}%`)
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      posts: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Error al obtener los posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Import auth utilities for this function
    const { requireAdmin, isSlugUnique } = await import('@/lib/auth-utils')
    const { PostCreateSchema, generateSlug } = await import('@/lib/validations')
    
    // Verify admin permissions
    const authResult = await requireAdmin()
    if (authResult.error) {
      const status = authResult.user ? 403 : 401
      return NextResponse.json(
        { error: authResult.error },
        { status }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const validationResult = PostCreateSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return NextResponse.json(
        { error: 'Datos inválidos', details: errors },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data
    
    // Auto-generate slug if not provided or ensure uniqueness
    let finalSlug = validatedData.slug
    if (!finalSlug) {
      finalSlug = generateSlug(validatedData.title)
    }
    
    // Check slug uniqueness
    const slugIsUnique = await isSlugUnique(finalSlug)
    if (!slugIsUnique) {
      // Add timestamp to make it unique
      finalSlug = `${finalSlug}-${Date.now()}`
    }

    const supabase = await createSupabaseServerClient()
    
    // Convert category slug to category_id
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', validatedData.category)
      .single()
    
    if (categoryError || !categoryData) {
      return NextResponse.json(
        { error: 'Categoría no encontrada' },
        { status: 400 }
      )
    }
    
    // Create the post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title: validatedData.title,
          slug: finalSlug,
          excerpt: validatedData.excerpt,
          content: validatedData.content,
          image_url: validatedData.image_url || null,
          category_id: categoryData.id,
          published: validatedData.published,
          published_at: validatedData.published ? new Date().toISOString() : null,
          tags: validatedData.tags || [],
          author_id: authResult.user!.id
        }
      ])
      .select(`
        *,
        author:authors(*)
      `)
      .single()

    if (error) {
      console.error('Supabase error creating post:', error)
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Error al crear el post' },
      { status: 500 }
    )
  }
}
