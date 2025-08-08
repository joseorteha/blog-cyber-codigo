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

async function testConnection() {
  try {
    console.log('🔍 Probando conexión con Supabase...')
    
    // Test 1: Obtener categorías
    console.log('\n📂 Test 1: Obteniendo categorías...')
    const startTime1 = Date.now()
    
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    const endTime1 = Date.now()
    console.log(`⏱️ Tiempo de consulta: ${endTime1 - startTime1}ms`)
    
    if (categoriesError) {
      console.error('❌ Error obteniendo categorías:', categoriesError)
    } else {
      console.log('✅ Categorías obtenidas:', categories.length)
    }

    // Test 2: Obtener categoría específica
    console.log('\n📂 Test 2: Obteniendo categoría "ia"...')
    const startTime2 = Date.now()
    
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'ia')
      .single()
    
    const endTime2 = Date.now()
    console.log(`⏱️ Tiempo de consulta: ${endTime2 - startTime2}ms`)
    
    if (categoryError) {
      console.error('❌ Error obteniendo categoría "ia":', categoryError)
    } else {
      console.log('✅ Categoría "ia" obtenida:', category)
    }

    // Test 3: Crear post de prueba
    console.log('\n📝 Test 3: Creando post de prueba...')
    const startTime3 = Date.now()
    
    const testPost = {
      title: 'Post de Prueba de Conexión',
      slug: 'post-prueba-conexion',
      excerpt: 'Este es un post de prueba para verificar la conexión.',
      content: 'Contenido del post de prueba.',
      category_id: category?.id,
      published: false,
      author_id: 'b59fae49-ddf9-40be-97f5-9166a707a6d8'
    }

    const { data: newPost, error: createError } = await supabase
      .from('posts')
      .insert([testPost])
      .select()
      .single()
    
    const endTime3 = Date.now()
    console.log(`⏱️ Tiempo de inserción: ${endTime3 - startTime3}ms`)
    
    if (createError) {
      console.error('❌ Error creando post de prueba:', createError)
    } else {
      console.log('✅ Post de prueba creado:', newPost)
      
      // Eliminar el post de prueba
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', newPost.id)
      
      if (deleteError) {
        console.error('⚠️ Error eliminando post de prueba:', deleteError)
      } else {
        console.log('✅ Post de prueba eliminado')
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
testConnection()
