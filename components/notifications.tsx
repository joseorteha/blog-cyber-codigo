'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Check, X, MessageCircle, Star, User, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: string
  type: 'comment' | 'reply' | 'mention' | 'post_published' | 'post_featured'
  title: string
  message: string
  entity_type?: 'post' | 'comment' | 'user'
  entity_id?: string
  read_at?: string
  created_at: string
}

export default function Notifications() {
  const { user, author } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.filter((n: { read_at: string | null }) => !n.read_at).length || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) throw error

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user?.id)
        .is('read_at', null)

      if (error) throw error

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      )
      setUnreadCount(0)

      toast({
        title: 'Notificaciones marcadas como leídas',
        description: 'Todas las notificaciones han sido marcadas como leídas'
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron marcar las notificaciones como leídas',
        variant: 'destructive'
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4" />
      case 'reply':
        return <MessageCircle className="w-4 h-4" />
      case 'mention':
        return <User className="w-4 h-4" />
      case 'post_published':
        return <Eye className="w-4 h-4" />
      case 'post_featured':
        return <Star className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'comment':
      case 'reply':
        return 'text-blue-400'
      case 'mention':
        return 'text-purple-400'
      case 'post_published':
        return 'text-green-400'
      case 'post_featured':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black/95 border-purple-500/20" align="end" forceMount>
        <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
          <h3 className="font-semibold text-white">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={markAllAsRead}
              className="text-xs text-purple-300 hover:text-purple-200"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Cargando...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 border-b border-purple-500/10 hover:bg-purple-500/10 cursor-pointer ${
                  !notification.read_at ? 'bg-purple-500/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!notification.read_at && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-purple-500/20">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-purple-300 hover:text-purple-200"
            >
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
