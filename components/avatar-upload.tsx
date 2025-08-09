'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { uploadImage, validateImage } from '@/lib/upload-utils'
import { createSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/components/providers'
import { Camera, X, Loader2 } from 'lucide-react'
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

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userName: string
  onAvatarChange: (url: string) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarUpload({ 
  currentAvatarUrl, 
  userName, 
  onAvatarChange,
  size = 'md'
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const supabase = createSupabaseClient()

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar archivo
    const validationError = validateImage(file)
    if (validationError) {
      toast({
        title: 'Error',
        description: validationError,
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    try {
      if (!user) throw new Error('Usuario no autenticado')
      const result = await uploadImage(file, 'avatars', user.id)
      
      if (result.error) {
        throw new Error(result.error)
      }

      // Actualizar avatar en la base de datos
      const { error: updateError } = await supabase
        .from('authors')
        .update({ avatar_url: result.url })
        .eq('id', user?.id)

      if (updateError) {
        throw new Error('Error al actualizar el avatar')
      }

      onAvatarChange(result.url)
      
      toast({
        title: 'Avatar actualizado',
        description: 'Tu foto de perfil se ha actualizado correctamente'
      })

    } catch (error: unknown) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al subir la imagen',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    try {
      const { error } = await supabase
        .from('authors')
        .update({ avatar_url: null })
        .eq('id', user?.id)

      if (error) {
        throw new Error('Error al eliminar el avatar')
      }

      onAvatarChange('')
      setShowRemoveDialog(false)
      
      toast({
        title: 'Avatar eliminado',
        description: 'Tu foto de perfil se ha eliminado'
      })

    } catch (error: unknown) {
      console.error('Error removing avatar:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar el avatar',
        variant: 'destructive'
      })
    } finally {
      setIsUploading(false)
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
        
        {/* Overlay para subir */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Cambiar Foto
            </>
          )}
        </Button>

        {currentAvatarUrl && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRemoveDialog(true)}
            disabled={isUploading}
            className="border-red-500/30 text-red-300 hover:bg-red-500/10"
          >
            <X className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        )}
      </div>

      {/* Input oculto para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Dialog para confirmar eliminación */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="bg-black/95 border-purple-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Eliminar foto de perfil
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              ¿Estás seguro de que quieres eliminar tu foto de perfil? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAvatar}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
