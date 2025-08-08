'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { createSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/components/providers'
import { Check, Loader2, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AvatarSelectorProps {
  currentAvatarUrl?: string | null
  userName: string
  onAvatarChange: (url: string) => void
  size?: 'sm' | 'md' | 'lg'
}

// Avatares predeterminados hardcodeados
const DEFAULT_AVATARS = [
  {
    id: 1,
    name: 'Cyberpunk',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=felix&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    description: 'Estilo cyberpunk con colores vibrantes'
  },
  {
    id: 2,
    name: 'Tech',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    description: 'Avatar tecnológico moderno'
  },
  {
    id: 3,
    name: 'Gaming',
    url: 'https://api.dicebear.com/7.x/big-ears/svg?seed=ringo&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    description: 'Perfecto para gamers'
  },
  {
    id: 4,
    name: 'Robot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=midnight&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    description: 'Estilo robot futurista'
  },
  {
    id: 5,
    name: 'Creative',
    url: 'https://api.dicebear.com/7.x/croodles/svg?seed=shadow&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
    description: 'Avatar creativo y único'
  }
]

export default function AvatarSelectorSimple({ 
  currentAvatarUrl, 
  userName, 
  onAvatarChange,
  size = 'md'
}: AvatarSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const supabase = createSupabaseClient()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Debes estar autenticado para cambiar tu avatar',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      // Actualizar avatar en la base de datos
      const { error: updateError } = await supabase
        .from('authors')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Error al actualizar el avatar')
      }

      onAvatarChange(avatarUrl)
      setIsDialogOpen(false)
      
      toast({
        title: 'Avatar actualizado',
        description: 'Tu foto de perfil se ha actualizado correctamente'
      })

    } catch (error: any) {
      console.error('Error updating avatar:', error)
      toast({
        title: 'Error',
        description: error.message || 'Error al actualizar el avatar',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'Debes estar autenticado para cambiar tu avatar',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('authors')
        .update({ avatar_url: null })
        .eq('id', user.id)

      if (error) {
        throw new Error('Error al eliminar el avatar')
      }

      onAvatarChange('')
      
      toast({
        title: 'Avatar eliminado',
        description: 'Tu foto de perfil se ha eliminado'
      })

    } catch (error: any) {
      console.error('Error removing avatar:', error)
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar el avatar',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-purple-500/30`}>
          <AvatarImage 
            src={currentAvatarUrl || ''} 
            alt={userName} 
          />
          <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white text-2xl">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex space-x-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Elegir Avatar
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-purple-500/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Seleccionar Avatar</DialogTitle>
              <DialogDescription className="text-gray-400">
                Elige una de las opciones disponibles
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 py-4">
              {DEFAULT_AVATARS.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`relative cursor-pointer rounded-lg p-2 transition-all hover:bg-purple-500/10 ${
                    currentAvatarUrl === avatar.url ? 'bg-purple-500/20 border border-purple-500/50' : 'border border-transparent'
                  }`}
                  onClick={() => handleAvatarSelect(avatar.url)}
                >
                  <Avatar className="w-16 h-16 mx-auto">
                    <AvatarImage src={avatar.url} alt={avatar.name} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                      {avatar.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-center text-gray-400 mt-2">{avatar.name}</p>
                  {currentAvatarUrl === avatar.url && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {currentAvatarUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemoveAvatar}
            disabled={isLoading}
            className="border-red-500/30 text-red-300 hover:bg-red-500/10"
          >
            Eliminar
          </Button>
        )}
      </div>
    </div>
  )
}
