import { createSupabaseClient } from './supabase'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

/**
 * Sube una imagen a Supabase Storage
 */
export async function uploadImage(
  file: File,
  folder: string = 'avatars',
  userId?: string
): Promise<UploadResult> {
  try {
    const supabase = createSupabaseClient()
    
    // Validar archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen')
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      throw new Error('El archivo es demasiado grande. Máximo 5MB')
    }
    
    // Generar nombre único
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Determinar el bucket correcto basado en el folder
    const bucketName = folder === 'avatars' ? 'avatars' : 'blog-images'
    
    // Para avatares, la ruta debe incluir el ID de usuario para cumplir con RLS
    if (folder === 'avatars' && !userId) {
      throw new Error('Se requiere el ID de usuario para subir un avatar.')
    }
    const filePath = folder === 'avatars' ? `${userId}/${fileName}` : `${folder}/${fileName}`
    
    // Subir archivo
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Error uploading image:', error)
      throw new Error('Error al subir la imagen')
    }
    
    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)
    
    return {
      url: urlData.publicUrl,
      path: filePath
    }
    
  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      url: '',
      path: '',
      error: error.message || 'Error al subir imagen'
    }
  }
}

/**
 * Elimina una imagen de Supabase Storage
 */
export async function deleteImage(path: string, bucket: string = 'blog-images'): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      console.error('Error deleting image:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}

/**
 * Valida una imagen antes de subir
 */
export function validateImage(file: File): string | null {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  if (!allowedTypes.includes(file.type)) {
    return 'Solo se permiten archivos JPG, PNG, WebP o GIF'
  }
  
  if (file.size > maxSize) {
    return 'El archivo es demasiado grande. Máximo 5MB'
  }
  
  return null
}
