import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestComments() {
  try {
    console.log('🔧 Creando comentarios de prueba...')

    // Obtener el primer post publicado
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, slug')
      .eq('published', true)
      .limit(1)

    if (postsError || !posts.length) {
      console.error('❌ No se encontraron posts publicados')
      return
    }

    const post = posts[0]
    console.log(`📝 Usando post: ${post.slug}`)

    // Obtener el primer autor
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('id')
      .limit(1)

    if (authorsError || !authors.length) {
      console.error('❌ No se encontraron autores')
      return
    }

    const authorId = authors[0].id

    // Comentarios de prueba
    const testComments = [
      {
        post_id: post.id,
        author_id: authorId,
        content: '¡Excelente artículo! Me encantó la explicación sobre ChatGPT-5. Definitivamente es un avance significativo en la IA conversacional.',
        status: 'approved',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días atrás
      },
      {
        post_id: post.id,
        author_name: 'María García',
        author_email: 'maria.garcia@example.com',
        content: 'Muy interesante el tema de la personalización del comportamiento. ¿Crees que esto podría cambiar la forma en que interactuamos con la tecnología?',
        status: 'approved',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día atrás
      },
      {
        post_id: post.id,
        author_name: 'Carlos López',
        author_email: 'carlos.lopez@example.com',
        content: 'La parte de las aplicaciones prácticas en educación me parece muy prometedora. Sería genial ver cómo se implementa en las aulas.',
        status: 'approved',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 horas atrás
      },
      {
        post_id: post.id,
        author_id: authorId,
        content: 'Gracias por el comentario, María. Sí, definitivamente la personalización cambiará la interacción. Cada usuario podrá tener su propio asistente "a medida".',
        status: 'approved',
        parent_id: null, // Se actualizará después
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 horas atrás
      },
      {
        post_id: post.id,
        author_name: 'Ana Martínez',
        author_email: 'ana.martinez@example.com',
        content: 'Me preocupa un poco el tema de la privacidad y seguridad. ¿Cómo garantizan que no se abuse de estas capacidades?',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
      }
    ]

    // Insertar comentarios
    const { data: insertedComments, error: insertError } = await supabase
      .from('comments')
      .insert(testComments)
      .select('id, content, author_id, author_name, parent_id')

    if (insertError) {
      console.error('❌ Error insertando comentarios:', insertError)
      return
    }

    console.log(`✅ Se crearon ${insertedComments.length} comentarios de prueba`)

    // Crear una respuesta (reply) al segundo comentario
    if (insertedComments.length >= 4) {
      const secondComment = insertedComments[1] // El comentario de María
      const replyComment = insertedComments[3] // El comentario de respuesta

      const { error: updateError } = await supabase
        .from('comments')
        .update({ parent_id: secondComment.id })
        .eq('id', replyComment.id)

      if (updateError) {
        console.error('❌ Error actualizando reply:', updateError)
      } else {
        console.log('✅ Reply configurado correctamente')
      }
    }

    // Crear algunas reacciones de prueba
    const reactionTypes = ['like', 'love', 'laugh']
    const commentsToReact = insertedComments.slice(0, 3) // Reaccionar a los primeros 3 comentarios

    for (const comment of commentsToReact) {
      const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)]
      
      const { error: reactionError } = await supabase
        .from('comment_reactions')
        .insert({
          comment_id: comment.id,
          user_id: authorId,
          reaction_type: reactionType
        })

      if (reactionError) {
        console.error(`❌ Error creando reacción para comentario ${comment.id}:`, reactionError)
      }
    }

    console.log('✅ Reacciones de prueba creadas')
    console.log('')
    console.log('📋 Comentarios creados:')
    console.log('- 1 comentario aprobado del autor')
    console.log('- 1 comentario aprobado de invitado (María)')
    console.log('- 1 comentario aprobado de invitado (Carlos)')
    console.log('- 1 respuesta aprobada del autor')
    console.log('- 1 comentario pendiente de invitado (Ana)')
    console.log('- Reacciones de prueba agregadas')
    console.log('')
    console.log('🎉 ¡Comentarios de prueba creados exitosamente!')
    console.log('💡 Ahora puedes ver los comentarios en cualquier post publicado')

  } catch (error) {
    console.error('❌ Error creando comentarios de prueba:', error)
  }
}

createTestComments()
