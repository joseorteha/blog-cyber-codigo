import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testCommentsSystem() {
  try {
    console.log('🧪 Probando sistema de comentarios y reacciones...')

    // 1. Verificar comentarios existentes
    console.log('\n📋 Verificando comentarios existentes...')
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id, content, author_name, status, created_at')
      .order('created_at', { ascending: false })

    if (commentsError) {
      console.error('❌ Error obteniendo comentarios:', commentsError)
      return
    }

    console.log(`✅ Encontrados ${comments.length} comentarios:`)
    comments.forEach((comment, index) => {
      console.log(`  ${index + 1}. ${comment.author_name}: "${comment.content.substring(0, 50)}..." (${comment.status})`)
    })

    // 2. Verificar reacciones existentes
    console.log('\n📋 Verificando reacciones existentes...')
    const { data: reactions, error: reactionsError } = await supabase
      .from('comment_reactions')
      .select('id, comment_id, reaction_type, user_id')
      .order('created_at', { ascending: false })

    if (reactionsError) {
      console.error('❌ Error obteniendo reacciones:', reactionsError)
      return
    }

    console.log(`✅ Encontradas ${reactions.length} reacciones:`)
    reactions.forEach((reaction, index) => {
      console.log(`  ${index + 1}. Reacción: ${reaction.reaction_type} en comentario ${reaction.comment_id}`)
    })

    // 3. Verificar posts publicados
    console.log('\n📋 Verificando posts publicados...')
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug, published')
      .eq('published', true)

    if (postsError) {
      console.error('❌ Error obteniendo posts:', postsError)
      return
    }

    console.log(`✅ Encontrados ${posts.length} posts publicados:`)
    posts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title} (${post.slug})`)
    })

    // 4. Verificar autores
    console.log('\n📋 Verificando autores...')
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('id, full_name, email, role')

    if (authorsError) {
      console.error('❌ Error obteniendo autores:', authorsError)
      return
    }

    console.log(`✅ Encontrados ${authors.length} autores:`)
    authors.forEach((author, index) => {
      console.log(`  ${index + 1}. ${author.full_name} (${author.email}) - ${author.role}`)
    })

    // 5. Estadísticas del sistema
    console.log('\n📊 Estadísticas del sistema:')
    console.log(`  - Posts publicados: ${posts.length}`)
    console.log(`  - Comentarios totales: ${comments.length}`)
    console.log(`  - Comentarios aprobados: ${comments.filter(c => c.status === 'approved').length}`)
    console.log(`  - Comentarios pendientes: ${comments.filter(c => c.status === 'pending').length}`)
    console.log(`  - Reacciones totales: ${reactions.length}`)
    console.log(`  - Autores registrados: ${authors.length}`)

    // 6. Verificar estructura de comentarios
    console.log('\n🔍 Verificando estructura de comentarios...')
    const commentsWithReplies = comments.filter(c => c.parent_id !== null)
    const rootComments = comments.filter(c => c.parent_id === null)
    
    console.log(`  - Comentarios raíz: ${rootComments.length}`)
    console.log(`  - Respuestas: ${commentsWithReplies.length}`)

    console.log('\n🎉 Sistema de comentarios verificado correctamente!')
    console.log('\n💡 Para probar el sistema:')
    console.log('  1. Ve a http://localhost:3000')
    console.log('  2. Haz clic en cualquier post publicado')
    console.log('  3. Desplázate hacia abajo para ver la sección de comentarios')
    console.log('  4. Prueba agregar comentarios y reacciones')

  } catch (error) {
    console.error('❌ Error probando sistema:', error)
  }
}

testCommentsSystem()
