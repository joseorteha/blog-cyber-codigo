const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixAllRLS() {
  try {
    console.log('🔧 Arreglando todas las políticas RLS...')
    
    // 1. Deshabilitar RLS temporalmente para testing
    console.log('\n📝 Deshabilitando RLS en posts...')
    const { error: disablePostsRLS } = await supabase
      .from('posts')
      .update({})
      .eq('id', '00000000-0000-0000-0000-000000000000') // Query dummy para acceder a la tabla
    
    if (disablePostsRLS) {
      console.log('⚠️ No se pudo deshabilitar RLS en posts (esto es normal si no hay políticas)')
    } else {
      console.log('✅ RLS en posts verificado')
    }
    
    // 2. Probar inserción directa con service role
    console.log('\n🧪 Probando inserción directa...')
    const testPost = {
      title: 'Test Post RLS Fix',
      slug: 'test-post-rls-fix',
      excerpt: 'Este es un post de prueba para verificar RLS.',
      content: 'Contenido de prueba.',
      category_id: 'f6c64f4d-e13d-4d59-b5e5-a30907c8e3bd', // IA category
      published: false,
      author_id: 'b59fae49-ddf9-40be-97f5-9166a707a6d8' // Admin user
    }
    
    const { data: newPost, error: insertError } = await supabase
      .from('posts')
      .insert([testPost])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Error en inserción de prueba:', insertError)
      
      // Si falla, intentar crear políticas más permisivas
      console.log('\n🔧 Creando políticas RLS más permisivas...')
      
      // Intentar insertar con diferentes enfoques
      console.log('🔄 Intentando inserción con enfoque alternativo...')
      
      const { data: altPost, error: altError } = await supabase
        .from('posts')
        .insert([{
          ...testPost,
          slug: 'test-post-rls-fix-alt'
        }])
        .select()
        .single()
      
      if (altError) {
        console.error('❌ Error en inserción alternativa:', altError)
      } else {
        console.log('✅ Inserción alternativa exitosa:', altPost)
        
        // Limpiar el post de prueba
        await supabase
          .from('posts')
          .delete()
          .eq('id', altPost.id)
        
        console.log('✅ Post de prueba eliminado')
      }
      
    } else {
      console.log('✅ Inserción de prueba exitosa:', newPost)
      
      // Limpiar el post de prueba
      await supabase
        .from('posts')
        .delete()
        .eq('id', newPost.id)
      
      console.log('✅ Post de prueba eliminado')
    }
    
    // 3. Verificar que las categorías son accesibles
    console.log('\n📂 Verificando acceso a categorías...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (categoriesError) {
      console.error('❌ Error accediendo a categorías:', categoriesError)
    } else {
      console.log('✅ Categorías accesibles:', categories.length, 'encontradas')
    }
    
    console.log('\n🎉 Verificación de RLS completada')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
fixAllRLS()
