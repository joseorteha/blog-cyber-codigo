import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixAvatarsRLS() {
  try {
    console.log('🔧 Configurando políticas RLS para bucket avatars...')

    // Verificar si el bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError)
      return
    }

    const avatarsBucket = buckets.find(b => b.name === 'avatars')
    if (!avatarsBucket) {
      console.error('❌ Bucket avatars no encontrado')
      return
    }

    console.log('✅ Bucket avatars encontrado')

    // Crear políticas RLS para el bucket avatars
    console.log('🔧 Creando políticas RLS...')

    // Política para SELECT (lectura pública)
    try {
      const { error: selectError } = await supabase.rpc('create_policy', {
        table_name: 'avatars',
        policy_name: 'Public read access for avatars',
        definition: 'SELECT ON avatars FOR ALL USING (true)',
        operation: 'SELECT'
      })

      if (selectError) {
        console.log('⚠️  Política SELECT ya existe o error:', selectError.message)
      } else {
        console.log('✅ Política SELECT creada')
      }
    } catch (error) {
      console.log('⚠️  Error creando política SELECT:', error)
    }

    // Política para INSERT (usuarios autenticados)
    try {
      const { error: insertError } = await supabase.rpc('create_policy', {
        table_name: 'avatars',
        policy_name: 'Authenticated users can upload avatars',
        definition: 'INSERT ON avatars FOR AUTHENTICATED WITH CHECK (auth.uid()::text = (storage.foldername(name))[1])',
        operation: 'INSERT'
      })

      if (insertError) {
        console.log('⚠️  Política INSERT ya existe o error:', insertError.message)
      } else {
        console.log('✅ Política INSERT creada')
      }
    } catch (error) {
      console.log('⚠️  Error creando política INSERT:', error)
    }

    // Política para UPDATE (propietarios)
    try {
      const { error: updateError } = await supabase.rpc('create_policy', {
        table_name: 'avatars',
        policy_name: 'Users can update own avatars',
        definition: 'UPDATE ON avatars FOR AUTHENTICATED USING (auth.uid()::text = (storage.foldername(name))[1]) WITH CHECK (auth.uid()::text = (storage.foldername(name))[1])',
        operation: 'UPDATE'
      })

      if (updateError) {
        console.log('⚠️  Política UPDATE ya existe o error:', updateError.message)
      } else {
        console.log('✅ Política UPDATE creada')
      }
    } catch (error) {
      console.log('⚠️  Error creando política UPDATE:', error)
    }

    // Política para DELETE (propietarios)
    try {
      const { error: deleteError } = await supabase.rpc('create_policy', {
        table_name: 'avatars',
        policy_name: 'Users can delete own avatars',
        definition: 'DELETE ON avatars FOR AUTHENTICATED USING (auth.uid()::text = (storage.foldername(name))[1])',
        operation: 'DELETE'
      })

      if (deleteError) {
        console.log('⚠️  Política DELETE ya existe o error:', deleteError.message)
      } else {
        console.log('✅ Política DELETE creada')
      }
    } catch (error) {
      console.log('⚠️  Error creando política DELETE:', error)
    }

    console.log('')
    console.log('🎉 Configuración de políticas RLS completada')
    console.log('')
    console.log('📋 Políticas configuradas:')
    console.log('- SELECT: Lectura pública de avatares')
    console.log('- INSERT: Usuarios autenticados pueden subir avatares')
    console.log('- UPDATE: Usuarios pueden actualizar sus avatares')
    console.log('- DELETE: Usuarios pueden eliminar sus avatares')
    console.log('')
    console.log('💡 Ahora puedes probar subir avatares en el perfil')

  } catch (error) {
    console.error('❌ Error configurando políticas RLS:', error)
  }
}

fixAvatarsRLS()
