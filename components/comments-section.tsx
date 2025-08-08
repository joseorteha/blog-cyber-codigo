'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageCircle, 
  Reply, 
  Trash2, 
  Edit, 
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Send
} from 'lucide-react'
import CommentReactions from './comment-reactions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

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
  author?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  replies: Comment[]
}

interface CommentsSectionProps {
  postId: string
  postSlug: string
}

export default function CommentsSection({ postId, postSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  
  // Form states
  const [newComment, setNewComment] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestWebsite, setGuestWebsite] = useState('')
  
  const { user, author } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?post_id=${postId}`)
      if (!response.ok) throw new Error('Error al cargar comentarios')
      
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los comentarios',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (parentId?: string) => {
    if (!newComment.trim()) return
    
    // Validate guest fields if not authenticated
    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa tu nombre y email',
        variant: 'destructive'
      })
      return
    }

    setSubmitting(true)
    try {
      const commentData: any = {
        post_id: postId,
        content: newComment.trim(),
        parent_id: parentId || null
      }

      // Add guest fields if not authenticated
      if (!user) {
        commentData.author_name = guestName.trim()
        commentData.author_email = guestEmail.trim()
        commentData.author_website = guestWebsite.trim() || null
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al enviar comentario')
      }

      const result = await response.json()
      
      toast({
        title: 'Comentario enviado',
        description: result.message || 'Tu comentario será revisado antes de publicarse'
      })

      // Reset form
      setNewComment('')
      setReplyingTo(null)
      if (!user) {
        setGuestName('')
        setGuestEmail('')
        setGuestWebsite('')
      }

      // Refresh comments
      fetchComments()
    } catch (error: any) {
      console.error('Error submitting comment:', error)
      toast({
        title: 'Error',
        description: error.message || 'Error al enviar comentario',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar comentario')
      }

      toast({
        title: 'Comentario eliminado',
        description: 'El comentario ha sido eliminado correctamente'
      })

      fetchComments()
    } catch (error: any) {
      console.error('Error deleting comment:', error)
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar comentario',
        variant: 'destructive'
      })
    } finally {
      setDeleteDialogOpen(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canEditComment = (comment: Comment) => {
    const isModerator = author?.role === 'admin' || author?.role === 'moderator'
    const isAuthor = comment.author?.id === user?.id
    return isModerator || isAuthor
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author?.avatar_url} />
                <AvatarFallback>
                  {(comment.author?.full_name || comment.author_name)?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {comment.author?.full_name || comment.author_name}
                  </span>
                  {comment.status !== 'approved' && (
                    <Badge variant={comment.status === 'pending' ? 'secondary' : 'destructive'}>
                      {comment.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                  {comment.updated_at !== comment.created_at && ' (editado)'}
                </span>
              </div>
            </div>
            
            {canEditComment(comment) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialogOpen(comment.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
            >
              <Reply className="h-4 w-4 mr-1" />
              Responder
            </Button>
            
            {/* Comment Reactions */}
            <CommentReactions 
              commentId={comment.id}
              onReactionChange={() => {
                // Refresh comments when reactions change
                fetchComments()
              }}
            />
          </div>
          
          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <Textarea
                placeholder="Escribe tu respuesta..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
              />
              
              {/* Guest fields for replies */}
              {!user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <Input
                    placeholder="Tu nombre *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                  <Input
                    placeholder="Tu email *"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubmitComment(comment.id)}
                  disabled={submitting}
                  size="sm"
                >
                  {submitting ? 'Enviando...' : 'Responder'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null)
                    setNewComment('')
                  }}
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Comentarios</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-2">Cargando comentarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comments header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* New comment form */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Deja un comentario</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Escribe tu comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          
          {/* Guest fields */}
          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Tu nombre *"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <Input
                placeholder="Tu email *"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
              <Input
                placeholder="Tu sitio web (opcional)"
                value={guestWebsite}
                onChange={(e) => setGuestWebsite(e.target.value)}
                className="md:col-span-2"
              />
            </div>
          )}
          
          <div className="flex justify-between items-center">
            {!user && (
              <p className="text-sm text-muted-foreground">
                Tu email no será publicado. Los campos marcados con * son obligatorios.
              </p>
            )}
            <Button
              onClick={() => handleSubmitComment()}
              disabled={submitting || !newComment.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Enviando...' : 'Comentar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No hay comentarios aún</h3>
            <p className="text-muted-foreground">
              Sé el primero en comentar este artículo
            </p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El comentario y todas sus respuestas serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogOpen && handleDeleteComment(deleteDialogOpen)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
