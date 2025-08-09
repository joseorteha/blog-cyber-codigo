import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAvatarUpload() {
  try {
    console.log('🧪 Probando funcionalidad de avatar upload...')

    // 1. Verificar bucket avatars
    console.log('\n📋 Verificando bucket avatars...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError)
      return
    }

    const avatarsBucket = buckets.find(b => b.name === 'avatars')
    if (avatarsBucket) {
      console.log('✅ Bucket avatars existe')
      console.log(`  - Nombre: ${avatarsBucket.name}`)
      console.log(`  - Público: ${avatarsBucket.public}`)
      console.log(`  - Tamaño máximo: ${avatarsBucket.file_size_limit} bytes`)
    } else {
      console.log('❌ Bucket avatars no encontrado')
    }

    // 2. Verificar políticas RLS del bucket
    console.log('\n📋 Verificando políticas del bucket...')
    try {
      const { data: policies, error: policiesError } = await supabase
        .storage
        .from('avatars')
        .list('', { limit: 1 })

      if (policiesError) {
        console.log('⚠️  Error accediendo al bucket (posible problema de políticas):', policiesError.message)
      } else {
        console.log('✅ Acceso al bucket funcionando')
      }
    } catch (error) {
      console.log('⚠️  Error verificando políticas:', error)
    }

    // 3. Verificar autores con avatares
    console.log('\n📋 Verificando autores con avatares...')
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('id, full_name, email, avatar_url')

    if (authorsError) {
      console.error('❌ Error obteniendo autores:', authorsError)
      return
    }

    console.log(`✅ Encontrados ${authors.length} autores:`)
    authors.forEach((author, index) => {
      console.log(`  ${index + 1}. ${author.full_name} (${author.email})`)
      console.log(`     Avatar: ${author.avatar_url || 'No tiene avatar'}`)
    })

    // 4. Verificar archivos en el bucket
    console.log('\n📋 Verificando archivos en bucket avatars...')
    try {
      const { data: files, error: filesError } = await supabase.storage
        .from('avatars')
        .list('')

      if (filesError) {
        console.log('⚠️  Error listando archivos:', filesError.message)
      } else {
        console.log(`✅ Encontrados ${files.length} archivos en bucket avatars:`)
        files.forEach((file, index) => {
          console.log(`  ${index + 1}. ${file.name} (${file.metadata?.size || 'N/A'} bytes)`)
        })
      }
    } catch (error) {
      console.log('⚠️  Error accediendo a archivos:', error)
    }

    console.log('\n🎉 Prueba de avatar upload completada!')
    console.log('\n💡 Para probar la subida de avatares:')
    console.log('  1. Ve a http://localhost:3000/perfil')
    console.log('  2. Haz clic en el botón de cámara sobre tu avatar')
    console.log('  3. Selecciona una imagen')
    console.log('  4. La imagen debería subirse correctamente')

  } catch (error) {
    console.error('❌ Error probando avatar upload:', error)
  }
}

testAvatarUpload()
