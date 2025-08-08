import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createSimpleAvatars() {
  try {
    console.log('🎨 Creando avatares predeterminados simples...')

    // Avatares usando URLs directas de servicios populares
    const defaultAvatars = [
      {
        id: 1,
        name: 'Avatar Cyberpunk',
        url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=felix&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        description: 'Estilo cyberpunk con colores vibrantes'
      },
      {
        id: 2,
        name: 'Avatar Tech',
        url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pixel&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        description: 'Avatar tecnológico moderno'
      },
      {
        id: 3,
        name: 'Avatar Gaming',
        url: 'https://api.dicebear.com/7.x/big-ears/svg?seed=ringo&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        description: 'Perfecto para gamers'
      },
      {
        id: 4,
        name: 'Avatar Robot',
        url: 'https://api.dicebear.com/7.x/bottts/svg?seed=midnight&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        description: 'Estilo robot futurista'
      },
      {
        id: 5,
        name: 'Avatar Creative',
        url: 'https://api.dicebear.com/7.x/croodles/svg?seed=shadow&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        description: 'Avatar creativo y único'
      }
    ]

    // Crear tabla para avatares predeterminados si no existe
    console.log('\n📋 Verificando tabla default_avatars...')
    
    // Intentar insertar un registro de prueba para verificar si la tabla existe
    const { error: testError } = await supabase
      .from('default_avatars')
      .select('id')
      .limit(1)

    if (testError) {
      console.log('⚠️  La tabla default_avatars no existe o hay un error')
      console.log('💡 Creando tabla manualmente en Supabase Dashboard...')
      console.log('SQL para crear la tabla:')
      console.log(`
        CREATE TABLE public.default_avatars (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          url TEXT NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)
    } else {
      console.log('✅ Tabla default_avatars existe')
    }

    // Insertar avatares en la tabla
    console.log('\n📝 Insertando avatares en la base de datos...')
    
    for (const avatar of defaultAvatars) {
      const { error: insertError } = await supabase
        .from('default_avatars')
        .upsert({
          id: avatar.id,
          name: avatar.name,
          url: avatar.url,
          description: avatar.description
        }, { onConflict: 'id' })

      if (insertError) {
        console.error(`❌ Error insertando avatar ${avatar.id}:`, insertError)
      } else {
        console.log(`✅ Avatar ${avatar.id} insertado en BD`)
      }
    }

    console.log('\n🎉 ¡Avatares predeterminados creados exitosamente!')
    console.log('📊 Avatares disponibles:')
    defaultAvatars.forEach(avatar => {
      console.log(`  - ${avatar.name}: ${avatar.url}`)
    })

    console.log('\n💡 Ahora puedes usar el componente AvatarSelector')
    console.log('🚀 Los avatares se cargarán automáticamente desde las URLs')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

createSimpleAvatars()
