'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageCircle, 
  Check, 
  X, 
  Flag,
  Eye,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  author_name: string
  author_email?: string
  author_website?: string
  parent_id: string | null
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  created_at: string
  updated_at: string
  post_id: string
  ip_address?: string
  user_agent?: string
  author?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  post?: {
    id: string
    title: string
    slug: string
  }
}

export default function CommentsAdminPage() {
  const { user, author, loading } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    spam: 0
  })
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  // Redirect if not admin/moderator
  useEffect(() => {
    if (!loading && (!user || !['admin', 'moderator'].includes(author?.role || ''))) {
      router.push('/')
    }
  }, [user, author, loading, router])

  // Fetch comments and stats
  useEffect(() => {
    if (user && ['admin', 'moderator'].includes(author?.role || '')) {
      fetchComments(activeTab)
      fetchStats()
    }
  }, [user, author, activeTab])

  const fetchComments = async (status: string = 'pending') => {
    try {
      setCommentsLoading(true)
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:authors(
            id,
            full_name,
            avatar_url
          ),
          post:posts(
            id,
            title,
            slug
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los comentarios.',
        variant: 'destructive'
      })
    } finally {
      setCommentsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('status')

      if (error) throw error

      const statusCounts = (data || []).reduce((acc: Record<string, number>, comment: { status: string }) => {
        acc[comment.status] = (acc[comment.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      setStats({
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
        spam: statusCounts.spam || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleCommentAction = async (commentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar comentario')
      }

      toast({
        title: 'Comentario actualizado',
        description: `Estado cambiado a ${getStatusLabel(newStatus)}`
      })

      // Refresh comments and stats
      fetchComments(activeTab)
      fetchStats()
    } catch (error: unknown) {
      console.error('Error updating comment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar comentario'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      spam: 'Spam'
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      spam: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || commentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando panel de moderación...</p>
        </div>
      </div>
    )
  }

  if (!user || !['admin', 'moderator'].includes(author?.role || '')) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Moderación de Comentarios</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona y modera los comentarios del blog
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <MessageCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spam</CardTitle>
              <Flag className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.spam}</div>
            </CardContent>
          </Card>
        </div>

        {/* Comments List */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">
                  Pendientes ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Aprobados ({stats.approved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rechazados ({stats.rejected})
                </TabsTrigger>
                <TabsTrigger value="spam">
                  Spam ({stats.spam})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No hay comentarios {getStatusLabel(activeTab).toLowerCase()}
                  </h3>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.author?.avatar_url} />
                          <AvatarFallback>
                            {(comment.author?.full_name || comment.author_name)?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {comment.author?.full_name || comment.author_name}
                            </span>
                            <Badge className={getStatusColor(comment.status)}>
                              {getStatusLabel(comment.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(comment.created_at)}
                            </span>
                            {comment.author_email && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {comment.author_email}
                              </span>
                            )}
                            {comment.ip_address && (
                              <span className="text-xs font-mono">
                                IP: {comment.ip_address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {comment.post && (
                        <Link 
                          href={`/post/${comment.post.slug}`}
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          <Eye className="h-3 w-3" />
                          Ver post
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>

                    {comment.post && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Comentario en: <span className="font-medium">{comment.post.title}</span>
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {comment.status !== 'approved' && (
                        <Button
                          onClick={() => handleCommentAction(comment.id, 'approved')}
                          size="sm"
                          variant="default"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                      )}
                      
                      {comment.status !== 'rejected' && (
                        <Button
                          onClick={() => handleCommentAction(comment.id, 'rejected')}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      )}
                      
                      {comment.status !== 'spam' && (
                        <Button
                          onClick={() => handleCommentAction(comment.id, 'spam')}
                          size="sm"
                          variant="outline"
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Marcar como Spam
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
