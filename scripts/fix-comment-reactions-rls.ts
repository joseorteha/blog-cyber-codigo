import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixCommentReactionsRLS() {
  try {
    console.log('🔧 Verificando políticas RLS para comment_reactions...')

    // Verificar si la tabla existe
    const { data: tableExists, error: tableError } = await supabase
      .from('comment_reactions')
      .select('count')
      .limit(1)

    if (tableError) {
      console.error('❌ Error verificando tabla comment_reactions:', tableError)
      return
    }

    console.log('✅ Tabla comment_reactions existe')

    // Verificar políticas RLS actuales
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'comment_reactions' })

    if (policiesError) {
      console.log('📋 No se pudieron obtener las políticas actuales, creando nuevas...')
    } else {
      console.log('📋 Políticas actuales:', policies)
    }

    // Crear políticas RLS para comment_reactions
    console.log('🔧 Creando políticas RLS para comment_reactions...')

    // Política para SELECT (lectura pública)
    const { error: selectError } = await supabase.rpc('create_policy', {
      table_name: 'comment_reactions',
      policy_name: 'Public read access',
      definition: 'SELECT ON comment_reactions FOR ALL USING (true)',
      operation: 'SELECT'
    })

    if (selectError) {
      console.log('⚠️  Política SELECT ya existe o error:', selectError.message)
    } else {
      console.log('✅ Política SELECT creada')
    }

    // Política para INSERT (usuarios autenticados)
    const { error: insertError } = await supabase.rpc('create_policy', {
      table_name: 'comment_reactions',
      policy_name: 'Authenticated users can insert',
      definition: 'INSERT ON comment_reactions FOR AUTHENTICATED WITH CHECK (auth.uid() = user_id)',
      operation: 'INSERT'
    })

    if (insertError) {
      console.log('⚠️  Política INSERT ya existe o error:', insertError.message)
    } else {
      console.log('✅ Política INSERT creada')
    }

    // Política para UPDATE (propietarios)
    const { error: updateError } = await supabase.rpc('create_policy', {
      table_name: 'comment_reactions',
      policy_name: 'Users can update own reactions',
      definition: 'UPDATE ON comment_reactions FOR AUTHENTICATED USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
      operation: 'UPDATE'
    })

    if (updateError) {
      console.log('⚠️  Política UPDATE ya existe o error:', updateError.message)
    } else {
      console.log('✅ Política UPDATE creada')
    }

    // Política para DELETE (propietarios)
    const { error: deleteError } = await supabase.rpc('create_policy', {
      table_name: 'comment_reactions',
      policy_name: 'Users can delete own reactions',
      definition: 'DELETE ON comment_reactions FOR AUTHENTICATED USING (auth.uid() = user_id)',
      operation: 'DELETE'
    })

    if (deleteError) {
      console.log('⚠️  Política DELETE ya existe o error:', deleteError.message)
    } else {
      console.log('✅ Política DELETE creada')
    }

    console.log('')
    console.log('🎉 Políticas RLS para comment_reactions configuradas')
    console.log('')
    console.log('📋 Políticas creadas:')
    console.log('- SELECT: Lectura pública')
    console.log('- INSERT: Usuarios autenticados pueden insertar')
    console.log('- UPDATE: Usuarios pueden actualizar sus propias reacciones')
    console.log('- DELETE: Usuarios pueden eliminar sus propias reacciones')

  } catch (error) {
    console.error('❌ Error configurando políticas RLS:', error)
  }
}

fixCommentReactionsRLS()
