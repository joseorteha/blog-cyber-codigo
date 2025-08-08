
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { PenTool, Eye, Users, FileText, Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Post } from '@/lib/types'
import BlogStats from '@/components/blog-stats'

export default function AdminPage() {
  const { user, author, loading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  })
  const [postsLoading, setPostsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  // Debug info
  console.log('Admin Page Debug:', { user, author, loading })

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || author?.role !== 'admin')) {
      console.log('Redirecting: No user or not admin')
      router.push('/')
    }
  }, [user, author, loading, router])

  // Fetch posts and stats
  useEffect(() => {
    if (user && author?.role === 'admin') {
      console.log('Fetching posts for admin')
      fetchPosts()
    }
  }, [user, author])

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts...')
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:authors(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
        throw error
      }

      console.log('Posts fetched:', data)
      setPosts(data || [])
      
      // Calculate stats
      const published = data?.filter((post: Post) => post.published).length || 0
      const drafts = data?.filter((post: Post) => !post.published).length || 0
      
      setStats({
        totalPosts: data?.length || 0,
        publishedPosts: published,
        draftPosts: drafts,
        totalViews: 0 // Would need analytics integration
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los posts.',
        variant: 'destructive'
      })
    } finally {
      setPostsLoading(false)
    }
  }

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el post "${title}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      toast({
        title: 'Post eliminado',
        description: `El post "${title}" ha sido eliminado exitosamente.`
      })

      fetchPosts() // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el post.',
        variant: 'destructive'
      })
    }
  }

  const togglePostStatus = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', postId)

      if (error) throw error

      toast({
        title: currentStatus ? 'Post despublicado' : 'Post publicado',
        description: `El post ha sido ${currentStatus ? 'despublicado' : 'publicado'} exitosamente.`
      })

      fetchPosts() // Refresh the list
    } catch (error) {
      console.error('Error updating post status:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del post.',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No autenticado</h2>
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para acceder al panel de administración.</p>
          <Button asChild>
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (author?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">No tienes permisos de administrador.</p>
          <p className="text-sm text-muted-foreground">Tu rol actual: {author?.role || 'Sin rol'}</p>
          <Button asChild className="mt-4">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona tu blog y contenido
            </p>
            <p className="text-sm text-muted-foreground">
              Usuario: {user.email} | Rol: {author?.role}
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/nuevo-post" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <BlogStats />

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Todos los Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {postsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando posts...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{post.title}</h3>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Publicado" : "Borrador"}
                        </Badge>
                        <Badge variant="outline">
                          {post.category || "Sin categoría"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          Creado: {new Date(post.created_at).toLocaleDateString('es-ES')}
                        </span>
                        {post.published_at && (
                          <span>
                            Publicado: {new Date(post.published_at).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {post.published && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/post/${post.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/editar/${post.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      
                      <Button 
                        variant={post.published ? "secondary" : "default"}
                        size="sm"
                        onClick={() => togglePostStatus(post.id, post.published)}
                      >
                        {post.published ? "Despublicar" : "Publicar"}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id, post.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {posts.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay posts creados</h3>
                    <p className="text-muted-foreground mb-4">
                      Comienza creando tu primer post para el blog.
                    </p>
                    <Button asChild>
                      <Link href="/admin/nuevo-post">
                        Crear Primer Post
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
