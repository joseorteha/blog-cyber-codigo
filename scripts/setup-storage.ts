import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  try {
    console.log('🔧 Configurando Supabase Storage...')

    // Crear bucket para imágenes del blog
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('blog-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880, // 5MB
      })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket blog-images ya existe')
      } else {
        throw bucketError
      }
    } else {
      console.log('✅ Bucket blog-images creado exitosamente')
    }

    // Crear bucket para avatares
    const { data: avatarsData, error: avatarsError } = await supabase.storage
      .createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 2097152, // 2MB
      })

    if (avatarsError) {
      if (avatarsError.message.includes('already exists')) {
        console.log('✅ Bucket avatars ya existe')
      } else {
        throw avatarsError
      }
    } else {
      console.log('✅ Bucket avatars creado exitosamente')
    }

    // Configurar políticas de acceso para el bucket
    const { error: policyError } = await supabase.storage
      .from('blog-images')
      .createSignedUrl('test.txt', 60)

    if (policyError && !policyError.message.includes('not found')) {
      console.log('⚠️  Nota: Las políticas de Storage se configuran manualmente en el dashboard de Supabase')
    }

    console.log('✅ Configuración de Storage completada')
    console.log('')
    console.log('📋 Pasos adicionales en Supabase Dashboard:')
    console.log('1. Ve a Storage > blog-images')
    console.log('2. En Policies, agrega las siguientes políticas:')
    console.log('')
    console.log('   SELECT (para lectura pública):')
    console.log('   - Policy name: "Public read access"')
    console.log('   - Target roles: "public"')
    console.log('   - Using expression: true')
    console.log('')
    console.log('   INSERT (para usuarios autenticados):')
    console.log('   - Policy name: "Authenticated users can upload"')
    console.log('   - Target roles: "authenticated"')
    console.log('   - Using expression: auth.role() = \'authenticated\'')
    console.log('')
    console.log('   UPDATE (para propietarios):')
    console.log('   - Policy name: "Users can update own files"')
    console.log('   - Target roles: "authenticated"')
    console.log('   - Using expression: auth.uid()::text = (storage.foldername(name))[1]')
    console.log('')
    console.log('   DELETE (para propietarios):')
    console.log('   - Policy name: "Users can delete own files"')
    console.log('   - Target roles: "authenticated"')
    console.log('   - Using expression: auth.uid()::text = (storage.foldername(name))[1]')

  } catch (error) {
    console.error('❌ Error configurando Storage:', error)
    process.exit(1)
  }
}

setupStorage()
