import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createStoragePolicies() {
  try {
    console.log('🔧 Creando políticas RLS para storage...')

    // Políticas para el bucket avatars
    const policies = [
      {
        name: 'Public read access for avatars',
        operation: 'SELECT',
        target: 'public',
        definition: 'true'
      },
      {
        name: 'Authenticated users can upload avatars',
        operation: 'INSERT',
        target: 'authenticated',
        definition: 'true'
      },
      {
        name: 'Users can update own avatars',
        operation: 'UPDATE',
        target: 'authenticated',
        definition: 'true'
      },
      {
        name: 'Users can delete own avatars',
        operation: 'DELETE',
        target: 'authenticated',
        definition: 'true'
      }
    ]

    console.log('📋 Configurando políticas para bucket avatars...')

    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('create_policy', {
          table_name: 'avatars',
          policy_name: policy.name,
          definition: `${policy.operation} ON avatars FOR ${policy.target.toUpperCase()} USING (${policy.definition})`,
          operation: policy.operation
        })

        if (error) {
          console.log(`⚠️  Política ${policy.name} ya existe o error:`, error.message)
        } else {
          console.log(`✅ Política ${policy.name} creada`)
        }
      } catch (error) {
        console.log(`⚠️  Error creando política ${policy.name}:`, error)
      }
    }

    // Probar upload con imagen real
    console.log('\n🧪 Probando upload con imagen...')
    
    // Crear una imagen de prueba (1x1 pixel PNG)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xCF, 0x00, 0x00,
      0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ])

    const testImage = new File([pngData], 'test.png', { type: 'image/png' })

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`test-${Date.now()}.png`, testImage, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Error en upload de prueba:', error)
        console.log('\n🔧 CONFIGURACIÓN MANUAL NECESARIA:')
        console.log('1. Ve a Supabase Dashboard > Storage > avatars')
        console.log('2. Haz clic en "Policies"')
        console.log('3. Haz clic en "New Policy"')
        console.log('4. Selecciona "Create a policy from scratch"')
        console.log('5. Configura para cada operación:')
        console.log('   - SELECT: Target roles = public, Policy definition = true')
        console.log('   - INSERT: Target roles = authenticated, Policy definition = true')
        console.log('   - UPDATE: Target roles = authenticated, Policy definition = true')
        console.log('   - DELETE: Target roles = authenticated, Policy definition = true')
      } else {
        console.log('✅ Upload de prueba exitoso!')
        console.log('📂 Archivo subido:', data.path)
        
        // Limpiar archivo de prueba
        await supabase.storage
          .from('avatars')
          .remove([data.path])
        
        console.log('🧹 Archivo de prueba eliminado')
      }
    } catch (error) {
      console.error('❌ Error en prueba:', error)
    }

    console.log('\n🎉 Configuración completada!')
    console.log('💡 Ahora prueba subir un avatar desde la aplicación')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

createStoragePolicies()
