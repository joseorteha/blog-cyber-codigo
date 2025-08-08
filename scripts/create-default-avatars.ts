import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Función para generar un avatar usando DiceBear API
async function generateAvatar(seed: string, style: string = 'adventurer') {
  const size = 200
  const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=${size}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error generando avatar')
    
    const svgText = await response.text()
    return svgText
  } catch (error) {
    console.error('Error generando avatar:', error)
    return null
  }
}

// Función para convertir SVG a Blob
function svgToBlob(svgText: string): Blob {
  return new Blob([svgText], { type: 'image/svg+xml' })
}

async function createDefaultAvatars() {
  try {
    console.log('🎨 Creando avatares predeterminados...')

    // Verificar bucket avatars
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError)
      return
    }

    const avatarsBucket = buckets?.find(b => b.name === 'avatars')
    if (!avatarsBucket) {
      console.log('📦 Creando bucket avatars...')
      const { error: createError } = await supabase.storage
        .createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg'],
          fileSizeLimit: 2097152, // 2MB
        })
      
      if (createError) {
        console.error('❌ Error creando bucket:', createError)
        return
      }
      console.log('✅ Bucket avatars creado')
    } else {
      console.log('✅ Bucket avatars ya existe')
    }

    // Generar 5 avatares diferentes
    const avatarSeeds = ['felix', 'pixel', 'ringo', 'midnight', 'shadow']
    const avatarStyles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles']
    
    const uploadedAvatars = []

    for (let i = 0; i < 5; i++) {
      const seed = avatarSeeds[i]
      const style = avatarStyles[i]
      
      console.log(`🎨 Generando avatar ${i + 1} (${style})...`)
      
      const svgText = await generateAvatar(seed, style)
      if (!svgText) {
        console.error(`❌ Error generando avatar ${i + 1}`)
        continue
      }

      const blob = svgToBlob(svgText)
      const fileName = `default-avatar-${i + 1}.svg`
      
      console.log(`📤 Subiendo ${fileName}...`)
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        console.error(`❌ Error subiendo avatar ${i + 1}:`, error)
        continue
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      uploadedAvatars.push({
        id: i + 1,
        name: `Avatar ${i + 1}`,
        url: urlData.publicUrl,
        fileName: fileName
      })

      console.log(`✅ Avatar ${i + 1} subido: ${urlData.publicUrl}`)
    }

    // Crear tabla para avatares predeterminados si no existe
    console.log('\n📋 Creando tabla default_avatars...')
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.default_avatars (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        file_name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    try {
      const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
      if (tableError) {
        console.log('⚠️  Tabla ya existe o error:', tableError.message)
      } else {
        console.log('✅ Tabla default_avatars creada')
      }
    } catch (error) {
      console.log('⚠️  Error creando tabla:', error)
    }

    // Insertar avatares en la tabla
    console.log('\n📝 Insertando avatares en la base de datos...')
    
    for (const avatar of uploadedAvatars) {
      const { error: insertError } = await supabase
        .from('default_avatars')
        .upsert({
          id: avatar.id,
          name: avatar.name,
          url: avatar.url,
          file_name: avatar.fileName
        }, { onConflict: 'id' })

      if (insertError) {
        console.error(`❌ Error insertando avatar ${avatar.id}:`, insertError)
      } else {
        console.log(`✅ Avatar ${avatar.id} insertado en BD`)
      }
    }

    console.log('\n🎉 ¡Avatares predeterminados creados exitosamente!')
    console.log('📊 Avatares disponibles:')
    uploadedAvatars.forEach(avatar => {
      console.log(`  - ${avatar.name}: ${avatar.url}`)
    })

    console.log('\n💡 Ahora puedes modificar el componente AvatarUpload para usar estos avatares')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

createDefaultAvatars()
