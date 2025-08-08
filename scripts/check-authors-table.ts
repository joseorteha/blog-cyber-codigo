import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAuthorsTable() {
  try {
    console.log('🔍 Verificando estructura de la tabla authors...')

    // 1. Verificar si la tabla existe
    console.log('\n📋 Verificando existencia de la tabla...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'authors')

    if (tablesError) {
      console.error('❌ Error verificando tabla:', tablesError)
      return
    }

    if (!tables || tables.length === 0) {
      console.error('❌ La tabla authors no existe!')
      return
    }

    console.log('✅ Tabla authors existe')

    // 2. Verificar estructura de columnas
    console.log('\n📋 Verificando estructura de columnas...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', 'authors')
      .order('ordinal_position')

    if (columnsError) {
      console.error('❌ Error obteniendo columnas:', columnsError)
      return
    }

    console.log('📊 Columnas encontradas:')
    columns?.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })

    // 3. Verificar restricciones
    console.log('\n📋 Verificando restricciones...')
    const { data: constraints, error: constraintsError } = await supabase
      .from('information_schema.table_constraints')
      .select('constraint_name, constraint_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'authors')

    if (constraintsError) {
      console.error('❌ Error obteniendo restricciones:', constraintsError)
      return
    }

    console.log('🔒 Restricciones encontradas:')
    constraints?.forEach(constraint => {
      console.log(`  - ${constraint.constraint_name}: ${constraint.constraint_type}`)
    })

    // 4. Verificar políticas RLS
    console.log('\n📋 Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, permissive, roles, cmd, qual')
      .eq('schemaname', 'public')
      .eq('tablename', 'authors')

    if (policiesError) {
      console.error('❌ Error obteniendo políticas:', policiesError)
    } else {
      console.log('🛡️ Políticas RLS encontradas:')
      policies?.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} para roles ${policy.roles}`)
      })
    }

    // 5. Verificar datos existentes
    console.log('\n📋 Verificando datos existentes...')
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('id, email, full_name, avatar_url, role, created_at')
      .limit(5)

    if (authorsError) {
      console.error('❌ Error obteniendo autores:', authorsError)
      return
    }

    console.log('👥 Autores encontrados:')
    authors?.forEach(author => {
      console.log(`  - ${author.full_name} (${author.email}) - Role: ${author.role}`)
    })

    // 6. Verificar foreign key con auth.users
    console.log('\n📋 Verificando foreign key con auth.users...')
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()

    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError)
    } else {
      console.log(`👤 Usuarios en auth.users: ${users.users.length}`)
      
      // Verificar si hay usuarios sin registro en authors
      const authUserIds = users.users.map(u => u.id)
      const authorIds = authors?.map(a => a.id) || []
      
      const missingUsers = authUserIds.filter(id => !authorIds.includes(id))
      if (missingUsers.length > 0) {
        console.log('⚠️ Usuarios en auth.users sin registro en authors:')
        missingUsers.forEach(id => {
          const user = users.users.find(u => u.id === id)
          console.log(`  - ${user?.email || id}`)
        })
      }
    }

    // 7. Verificar si RLS está habilitado
    console.log('\n📋 Verificando Row Level Security...')
    const { data: rlsStatus, error: rlsError } = await supabase
      .from('information_schema.tables')
      .select('is_insertable_into')
      .eq('table_schema', 'public')
      .eq('table_name', 'authors')
      .single()

    if (rlsError) {
      console.error('❌ Error verificando RLS:', rlsError)
    } else {
      console.log(`🔐 RLS habilitado: ${rlsStatus?.is_insertable_into === 'YES' ? 'Sí' : 'No'}`)
    }

    console.log('\n🎉 Verificación completada!')
    console.log('\n💡 RECOMENDACIONES:')
    console.log('1. Asegúrate de que RLS esté habilitado en la tabla authors')
    console.log('2. Verifica que existan políticas RLS para INSERT, UPDATE, SELECT')
    console.log('3. Asegúrate de que los usuarios autenticados puedan actualizar su avatar_url')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

checkAuthorsTable()
