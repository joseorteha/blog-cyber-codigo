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

async function checkDatabase() {
  try {
    console.log('🔍 Verificando estructura de la base de datos...')
    
    // Verificar tabla authors
    console.log('\n📋 Verificando tabla authors...')
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .limit(5)
    
    if (authorsError) {
      console.error('❌ Error en tabla authors:', authorsError)
    } else {
      console.log('✅ Tabla authors OK')
      console.log('📊 Autores encontrados:', authors?.length || 0)
      if (authors && authors.length > 0) {
        console.log('👤 Primer autor:', authors[0])
      }
    }

    // Verificar tabla posts
    console.log('\n📋 Verificando tabla posts...')
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .limit(5)
    
    if (postsError) {
      console.error('❌ Error en tabla posts:', postsError)
    } else {
      console.log('✅ Tabla posts OK')
      console.log('📊 Posts encontrados:', posts?.length || 0)
      if (posts && posts.length > 0) {
        console.log('📝 Primer post:', posts[0])
      }
    }

    // Verificar estructura de posts
    console.log('\n🔧 Verificando estructura de posts...')
    const { data: postStructure, error: structureError } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, content, image_url, category, published, tags, author_id, created_at, updated_at')
      .limit(1)
    
    if (structureError) {
      console.error('❌ Error verificando estructura:', structureError)
    } else {
      console.log('✅ Estructura de posts OK')
    }

    // Intentar crear un post de prueba
    console.log('\n🧪 Probando creación de post...')
    
    // Primero obtener el category_id para 'ia'
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'ia')
      .single()

    if (categoryError) {
      console.error('❌ Error obteniendo categoría:', categoryError)
      return
    }

    const testPost = {
      title: 'Post de Prueba',
      slug: 'post-de-prueba',
      excerpt: 'Este es un post de prueba para verificar la funcionalidad.',
      content: 'Contenido del post de prueba.',
      category_id: categoryData.id,
      published: false,
      author_id: 'b59fae49-ddf9-40be-97f5-9166a707a6d8' // ID del admin
    }

    const { data: newPost, error: createError } = await supabase
      .from('posts')
      .insert([testPost])
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creando post de prueba:', createError)
    } else {
      console.log('✅ Post de prueba creado exitosamente:', newPost)
      
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
checkDatabase()
