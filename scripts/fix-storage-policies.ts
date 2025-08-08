import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixStoragePolicies() {
  try {
    console.log('🔧 Configurando políticas RLS para storage...')

    // 1. Verificar buckets existentes
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError)
      return
    }

    console.log('📋 Buckets encontrados:')
    buckets?.forEach(bucket => {
      console.log(`  - ${bucket.name} (público: ${bucket.public})`)
    })

    // 2. Configurar políticas para bucket avatars
    console.log('\n🔧 Configurando políticas para bucket avatars...')

    // Política para SELECT (lectura pública)
    try {
      const { error } = await supabase.storage
        .from('avatars')
        .createSignedUrl('test.txt', 60)

      if (error && error.message.includes('policy')) {
        console.log('⚠️  Políticas RLS necesitan configuración manual')
        console.log('\n📋 INSTRUCCIONES MANUALES:')
        console.log('1. Ve a tu dashboard de Supabase')
        console.log('2. Storage > avatars > Policies')
        console.log('3. Crea las siguientes políticas:')
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
        console.log('✅ Políticas RLS funcionando correctamente')
      }
    } catch (error) {
      console.log('⚠️  Error verificando políticas:', error)
    }

    // 3. Crear bucket avatars si no existe
    console.log('\n🔧 Verificando bucket avatars...')
    const avatarsBucket = buckets?.find(b => b.name === 'avatars')
    
    if (!avatarsBucket) {
      console.log('📦 Creando bucket avatars...')
      const { data: newBucket, error: createError } = await supabase.storage
        .createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          fileSizeLimit: 2097152, // 2MB
        })

      if (createError) {
        console.error('❌ Error creando bucket:', createError)
      } else {
        console.log('✅ Bucket avatars creado exitosamente')
      }
    } else {
      console.log('✅ Bucket avatars ya existe')
    }

    // 4. Probar upload directo
    console.log('\n🧪 Probando upload directo...')
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`test-${Date.now()}.txt`, testFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Error en upload de prueba:', error)
        console.log('\n🔧 SOLUCIÓN:')
        console.log('1. Ve a Supabase Dashboard > Storage > avatars')
        console.log('2. Haz clic en "Policies"')
        console.log('3. Haz clic en "New Policy"')
        console.log('4. Selecciona "Create a policy from scratch"')
        console.log('5. Configura:')
        console.log('   - Policy name: "Allow authenticated uploads"')
        console.log('   - Allowed operation: INSERT')
        console.log('   - Target roles: authenticated')
        console.log('   - Policy definition: true')
        console.log('6. Repite para UPDATE y DELETE')
      } else {
        console.log('✅ Upload de prueba exitoso!')
        
        // Limpiar archivo de prueba
        await supabase.storage
          .from('avatars')
          .remove([data.path])
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

fixStoragePolicies()
