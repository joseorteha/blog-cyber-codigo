
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import PostCard from '@/components/post-card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

interface Params {
  params: Promise<{ slug: string }>
}

const categoryMap: Record<string, string> = {
  'ia': 'Inteligencia Artificial',
  'smartphones': 'Smartphones',
  'desarrollo-web': 'Desarrollo Web',
  'startups': 'Startups',
  'ciberseguridad': 'Ciberseguridad'
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const categoryName = categoryMap[slug]
  
  if (!categoryName) {
    return {
      title: 'Categoría no encontrada | TechNews',
    }
  }

  return {
    title: `${categoryName} | TechNews`,
    description: `Últimas noticias y artículos sobre ${categoryName.toLowerCase()}`,
  }
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params
  const categoryName = categoryMap[slug]
  
  if (!categoryName) {
    notFound()
  }

  const supabase = await createSupabaseServerClient()
  
  // First get the category ID from the slug
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  if (categoryError || !categoryData) {
    console.error('Error fetching category:', categoryError)
    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Categoría no encontrada</h1>
          <p className="text-gray-400">La categoría solicitada no existe.</p>
        </div>
      </div>
    )
  }

  // Then get posts for that category
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('published', true)
    .eq('category_id', categoryData.id)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching category posts:', error)
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            {categoryName}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Noticias de <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">{categoryName}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Mantente al día con las últimas tendencias y noticias en {categoryName.toLowerCase()}
          </p>
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2 text-white">No hay artículos disponibles</h3>
            <p className="text-gray-400">
              Pronto habrá contenido disponible en esta categoría.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
