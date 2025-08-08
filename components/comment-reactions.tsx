'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  Laugh, 
  Angry,
  Smile
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Reaction {
  id: string
  reaction_type: 'like' | 'dislike' | 'love' | 'laugh' | 'angry'
  user_id: string
}

interface CommentReactionsProps {
  commentId: string
  initialReactions?: Reaction[]
  onReactionChange?: (reactions: Reaction[]) => void
}

const REACTION_TYPES = [
  { type: 'like', icon: ThumbsUp, label: 'Me gusta', color: 'text-green-400' },
  { type: 'dislike', icon: ThumbsDown, label: 'No me gusta', color: 'text-red-400' },
  { type: 'love', icon: Heart, label: 'Me encanta', color: 'text-pink-400' },
  { type: 'laugh', icon: Laugh, label: 'Divertido', color: 'text-yellow-400' },
  { type: 'angry', icon: Angry, label: 'Me molesta', color: 'text-orange-400' }
]

export default function CommentReactions({ 
  commentId, 
  initialReactions = [],
  onReactionChange 
}: CommentReactionsProps) {
  const { user } = useAuth()
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  const getUserReaction = () => {
    if (!user) return null
    return reactions.find(r => r.user_id === user.id)
  }

  const getReactionCount = (type: string) => {
    return reactions.filter(r => r.reaction_type === type).length
  }

  const handleReaction = async (reactionType: string) => {
    if (!user) {
      toast({
        title: 'Debes iniciar sesión',
        description: 'Necesitas estar logueado para reaccionar',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const currentReaction = getUserReaction()
      
      if (currentReaction?.reaction_type === reactionType) {
        // Remove reaction
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)

        if (error) throw error

        const newReactions = reactions.filter(r => r.id !== currentReaction.id)
        setReactions(newReactions)
        onReactionChange?.(newReactions)
      } else {
        // Add/Update reaction
        const reactionData = {
          comment_id: commentId,
          user_id: user.id,
          reaction_type: reactionType
        }

        if (currentReaction) {
          // Update existing reaction
          const { data, error } = await supabase
            .from('comment_reactions')
            .update({ reaction_type: reactionType })
            .eq('id', currentReaction.id)
            .select()
            .single()

          if (error) throw error

          const newReactions = reactions.map(r => 
            r.id === currentReaction.id ? data : r
          )
          setReactions(newReactions)
          onReactionChange?.(newReactions)
        } else {
          // Add new reaction - use upsert to handle conflicts
          const { data, error } = await supabase
            .from('comment_reactions')
            .upsert([reactionData], { 
              onConflict: 'comment_id,user_id',
              ignoreDuplicates: false 
            })
            .select()
            .single()

          if (error) throw error

          const newReactions = [...reactions, data]
          setReactions(newReactions)
          onReactionChange?.(newReactions)
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
      toast({
        title: 'Error',
        description: 'No se pudo procesar la reacción',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const currentUserReaction = getUserReaction()

  return (
    <div className="flex items-center space-x-1 mt-2">
      {REACTION_TYPES.map(({ type, icon: Icon, label, color }) => {
        const count = getReactionCount(type)
        const isActive = currentUserReaction?.reaction_type === type
        
        return (
          <Button
            key={type}
            size="sm"
            variant="ghost"
            onClick={() => handleReaction(type)}
            disabled={loading}
            className={`h-6 px-2 text-xs ${
              isActive 
                ? `${color} bg-opacity-20 hover:bg-opacity-30` 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Icon className="w-3 h-3 mr-1" />
            {count > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-1 h-4 px-1 text-xs bg-transparent"
              >
                {count}
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}
