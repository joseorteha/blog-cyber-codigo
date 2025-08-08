
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import PostCard from '@/components/post-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { Post } from '@/lib/supabase'

function SearchResults() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const supabase = createSupabaseClient()

  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setHasSearched(true)

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:authors(*)
        `)
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error searching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      searchPosts(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchPosts(query)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Buscar <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Artículos</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Encuentra el contenido tecnológico que estás buscando
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por título, contenido o extracto..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 h-12 text-lg"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Buscando artículos...</p>
          </div>
        )}

        {!loading && hasSearched && (
          <>
            {posts.length > 0 ? (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold">
                    {posts.length} resultado{posts.length !== 1 ? 's' : ''} para "{initialQuery || query}"
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
                <p className="text-muted-foreground">
                  No encontramos artículos que coincidan con tu búsqueda "{initialQuery || query}".
                  Intenta con diferentes palabras clave.
                </p>
              </div>
            )}
          </>
        )}

        {!hasSearched && !initialQuery && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Busca contenido tecnológico</h3>
            <p className="text-muted-foreground">
              Ingresa palabras clave para encontrar artículos sobre IA, smartphones, desarrollo web, startups y más.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando búsqueda...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
