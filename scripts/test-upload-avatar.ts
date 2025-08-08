import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Función de upload simplificada para testing
async function uploadImage(file: File, folder: string = 'avatars') {
  try {
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
    
    // Para avatares, subir directamente al bucket sin folder adicional
    const filePath = folder === 'avatars' ? fileName : `${folder}/${fileName}`
    
    console.log('📂 Subiendo a bucket:', bucketName)
    console.log('📁 Ruta del archivo:', filePath)
    
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
      path: filePath,
      error: undefined
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

async function testAvatarUpload() {
  try {
    console.log('🧪 Probando upload de avatar...')

    // Crear un archivo de prueba (simulado)
    const testFile = new File(
      ['test image content'], 
      'test-avatar.jpg', 
      { type: 'image/jpeg' }
    )

    console.log('📁 Archivo de prueba creado:', testFile.name)
    console.log('📏 Tamaño:', testFile.size, 'bytes')
    console.log('🎯 Tipo:', testFile.type)

    // Intentar subir el archivo
    console.log('🚀 Intentando subir archivo...')
    const result = await uploadImage(testFile, 'avatars')

    if (result.error) {
      console.error('❌ Error en upload:', result.error)
      return
    }

    console.log('✅ Upload exitoso!')
    console.log('📂 Ruta:', result.path)
    console.log('🔗 URL:', result.url)

    // Verificar que el archivo existe en el bucket
    const { data: files, error: listError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 100 })

    if (listError) {
      console.error('❌ Error listando archivos:', listError)
      return
    }

    console.log('📋 Archivos en bucket avatars:')
    files?.forEach(file => {
      console.log(`  - ${file.name} (${file.metadata?.size || 'N/A'} bytes)`)
    })

    console.log('🎉 Prueba completada exitosamente!')

  } catch (error) {
    console.error('❌ Error en prueba:', error)
  }
}

testAvatarUpload()
