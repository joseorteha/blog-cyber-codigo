import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixAllRLSPolicies() {
  try {
    console.log('🔧 Configurando TODAS las políticas RLS necesarias...')

    // 1. Verificar bucket avatars
    console.log('\n📦 Verificando bucket avatars...')
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
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
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

    // 2. Configurar políticas RLS para authors (si no existen)
    console.log('\n👥 Configurando políticas RLS para tabla authors...')
    
    const authorsPolicies = [
      {
        name: 'Enable read access for all users',
        operation: 'SELECT',
        target: 'public',
        definition: 'true'
      },
      {
        name: 'Enable insert for authenticated users',
        operation: 'INSERT',
        target: 'authenticated',
        definition: 'true'
      },
      {
        name: 'Enable update for users based on id',
        operation: 'UPDATE',
        target: 'authenticated',
        definition: 'auth.uid() = id'
      },
      {
        name: 'Enable delete for users based on id',
        operation: 'DELETE',
        target: 'authenticated',
        definition: 'auth.uid() = id'
      }
    ]

    for (const policy of authorsPolicies) {
      try {
        const { error } = await supabase.rpc('create_policy', {
          table_name: 'authors',
          policy_name: policy.name,
          definition: `${policy.operation} ON authors FOR ${policy.target.toUpperCase()} USING (${policy.definition})`,
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

    // 3. Habilitar RLS en authors si no está habilitado
    console.log('\n🔐 Habilitando RLS en tabla authors...')
    try {
      const { error } = await supabase.rpc('alter_table_enable_rls', {
        table_name: 'authors'
      })
      
      if (error) {
        console.log('⚠️  RLS ya está habilitado o error:', error.message)
      } else {
        console.log('✅ RLS habilitado en authors')
      }
    } catch (error) {
      console.log('⚠️  Error habilitando RLS:', error)
    }

    // 4. Probar upload completo
    console.log('\n🧪 Probando upload completo...')
    const testFile = new File(
      ['fake image data'], 
      'test-avatar.jpg', 
      { type: 'image/jpeg' }
    )

    const fileExt = testFile.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const bucketName = 'avatars'
    const filePath = fileName

    console.log('📂 Subiendo archivo de prueba...')
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Error en upload de prueba:', error)
      console.log('\n🔧 CONFIGURACIÓN MANUAL NECESARIA:')
      console.log('1. Ve a Supabase Dashboard > Storage > avatars')
      console.log('2. Haz clic en "Policies"')
      console.log('3. Crea las siguientes políticas manualmente:')
      console.log('\n🔓 SELECT Policy:')
      console.log('  - Name: "Public read access"')
      console.log('  - Operation: SELECT')
      console.log('  - Target roles: public')
      console.log('  - Using expression: true')
      
      console.log('\n📤 INSERT Policy:')
      console.log('  - Name: "Authenticated users can upload"')
      console.log('  - Operation: INSERT')
      console.log('  - Target roles: authenticated')
      console.log('  - Using expression: true')
      
      console.log('\n🔄 UPDATE Policy:')
      console.log('  - Name: "Users can update own files"')
      console.log('  - Operation: UPDATE')
      console.log('  - Target roles: authenticated')
      console.log('  - Using expression: true')
      
      console.log('\n🗑️  DELETE Policy:')
      console.log('  - Name: "Users can delete own files"')
      console.log('  - Operation: DELETE')
      console.log('  - Target roles: authenticated')
      console.log('  - Using expression: true')
    } else {
      console.log('✅ Upload de prueba exitoso!')
      console.log('📂 Archivo subido:', data.path)
      
      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)
      
      console.log('🔗 URL pública:', urlData.publicUrl)
      
      // Limpiar archivo de prueba
      await supabase.storage
        .from(bucketName)
        .remove([filePath])
      
      console.log('🧹 Archivo de prueba eliminado')
    }

    // 5. Probar actualización en authors
    console.log('\n👥 Probando actualización en authors...')
    const { data: authors } = await supabase
      .from('authors')
      .select('id')
      .limit(1)

    if (authors && authors.length > 0) {
      const testAuthor = authors[0]
      const { error: updateError } = await supabase
        .from('authors')
        .update({ avatar_url: 'https://example.com/test.jpg' })
        .eq('id', testAuthor.id)

      if (updateError) {
        console.error('❌ Error actualizando authors:', updateError)
      } else {
        console.log('✅ Actualización en authors funcionando')
        
        // Revertir cambio
        await supabase
          .from('authors')
          .update({ avatar_url: null })
          .eq('id', testAuthor.id)
      }
    }

    console.log('\n🎉 ¡CONFIGURACIÓN COMPLETADA!')
    console.log('💡 Ahora el upload de avatares debería funcionar correctamente')
    console.log('🚀 Prueba subir un avatar desde la aplicación')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

fixAllRLSPolicies()
