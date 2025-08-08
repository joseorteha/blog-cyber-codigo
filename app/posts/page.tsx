import { createSupabaseServerClient } from '@/lib/supabase'
import PostCard from '@/components/post-card'
import { Badge } from '@/components/ui/badge'

export const revalidate = 60

export default async function PostsPage() {
  const supabase = await createSupabaseServerClient()
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            Todos los Artículos
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Todos los Artículos
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explora todos nuestros artículos sobre tecnología, IA, desarrollo web y más
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
              Pronto habrá contenido disponible.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
