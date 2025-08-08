
import { createSupabaseServerClient } from '@/lib/supabase'
import PostCard from '@/components/post-card'
import HeroSection from '@/components/hero-section'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const revalidate = 300 // Cache for 5 minutes
export const dynamic = 'force-static' // Enable static generation when possible

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  
  // Fetch latest posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  // Categories for carousel - moved to client component


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      

      
      {/* Latest Posts */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
              Últimas <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Noticias</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto px-4">
              Mantente al día con las últimas tendencias en tecnología, innovación y startups
            </p>
          </div>
          
          {posts && posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                >
                  <Link href="/posts" className="inline-flex items-center gap-2">
                    Ver Todos los Artículos
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No hay posts publicados todavía. ¡Pronto habrá contenido disponible!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
