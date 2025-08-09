import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function simpleCheckAuthors() {
  try {
    console.log('🔍 Verificación simple de la tabla authors...')

    // 1. Intentar obtener datos de la tabla
    console.log('\n📋 Probando acceso a la tabla authors...')
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .limit(5)

    if (authorsError) {
      console.error('❌ Error accediendo a authors:', authorsError)
      console.log('\n🔧 POSIBLES PROBLEMAS:')
      console.log('1. La tabla authors no existe')
      console.log('2. RLS está bloqueando el acceso')
      console.log('3. Falta configuración de políticas RLS')
      return
    }

    console.log('✅ Tabla authors accesible')
    console.log(`📊 Autores encontrados: ${authors?.length || 0}`)

    // 2. Verificar estructura
    if (authors && authors.length > 0) {
      const firstAuthor = authors[0]
      console.log('\n📊 Estructura del primer autor:')
      Object.keys(firstAuthor).forEach(key => {
        console.log(`  - ${key}: ${typeof firstAuthor[key]} (${firstAuthor[key]})`)
      })
    }

    // 3. Verificar si podemos actualizar avatar_url
    console.log('\n📋 Probando actualización de avatar_url...')
    const testAuthor = authors?.[0]
    
    if (testAuthor) {
      const { error: updateError } = await supabase
        .from('authors')
        .update({ avatar_url: 'test-url.jpg' })
        .eq('id', testAuthor.id)

      if (updateError) {
        console.error('❌ Error actualizando avatar_url:', updateError)
        console.log('\n🔧 PROBLEMA IDENTIFICADO:')
        console.log('Las políticas RLS están bloqueando la actualización de avatar_url')
        console.log('Esto explica por qué el upload de avatares falla')
      } else {
        console.log('✅ Actualización de avatar_url funcionando')
        
        // Revertir el cambio
        await supabase
          .from('authors')
          .update({ avatar_url: testAuthor.avatar_url })
          .eq('id', testAuthor.id)
      }
    }

    // 4. Verificar políticas RLS
    console.log('\n📋 Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'authors' })
      // .catch(() => ({ data: null, error: { message: 'Función no disponible' } })) // No supported method

    if (policiesError) {
      console.log('⚠️ No se pudieron obtener las políticas RLS')
      console.log('💡 Esto es normal, las políticas se configuran manualmente')
    } else {
      console.log('🛡️ Políticas RLS encontradas:', policies)
    }

    console.log('\n🎉 Verificación completada!')
    console.log('\n💡 DIAGNÓSTICO:')
    console.log('Si el upload de avatares falla, probablemente es por:')
    console.log('1. Políticas RLS que bloquean UPDATE en la tabla authors')
    console.log('2. Políticas RLS que bloquean INSERT en el bucket avatars')
    console.log('3. Usuario no autenticado correctamente')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

simpleCheckAuthors()
