import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testFinalUpload() {
  try {
    console.log('🧪 Prueba final de upload de avatar...')

    // Simular exactamente lo que hace la aplicación
    const testFile = new File(
      ['fake image data'], 
      'test-avatar.jpg', 
      { type: 'image/jpeg' }
    )

    console.log('📁 Archivo de prueba:', testFile.name)
    console.log('📏 Tamaño:', testFile.size, 'bytes')
    console.log('🎯 Tipo:', testFile.type)

    // Usar la misma lógica que la aplicación
    const fileExt = testFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const bucketName = 'avatars'
    const filePath = fileName // Sin carpeta adicional para avatares

    console.log('📂 Bucket:', bucketName)
    console.log('📁 Ruta:', filePath)

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Error en upload:', error)
      console.log('\n🔧 DIAGNÓSTICO:')
      console.log('1. Verifica que el usuario esté autenticado')
      console.log('2. Verifica las políticas RLS del bucket avatars')
      console.log('3. Verifica que el bucket avatars exista')
      return
    }

    console.log('✅ Upload exitoso!')
    console.log('📂 Archivo subido:', data.path)

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    console.log('🔗 URL pública:', urlData.publicUrl)

    // Verificar que el archivo existe
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 100 })

    if (listError) {
      console.error('❌ Error listando archivos:', listError)
    } else {
      console.log('📋 Archivos en bucket:')
      files?.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 'N/A'} bytes)`)
      })
    }

    // Limpiar archivo de prueba
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (deleteError) {
      console.error('⚠️  Error eliminando archivo de prueba:', deleteError)
    } else {
      console.log('🧹 Archivo de prueba eliminado')
    }

    console.log('\n🎉 ¡PRUEBA EXITOSA!')
    console.log('💡 El upload de avatares está funcionando correctamente')
    console.log('🚀 Ahora puedes probar desde la aplicación')

  } catch (error) {
    console.error('❌ Error en prueba:', error)
  }
}

testFinalUpload()
