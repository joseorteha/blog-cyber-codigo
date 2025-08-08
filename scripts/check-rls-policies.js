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

async function checkRLSPolicies() {
  try {
    console.log('🔍 Verificando políticas RLS...')
    
    // Verificar políticas de posts
    console.log('\n📝 Políticas de la tabla posts:')
    const { data: postsPolicies, error: postsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
          FROM pg_policies 
          WHERE tablename = 'posts'
          ORDER BY policyname;
        `
      })
    
    if (postsError) {
      console.error('❌ Error obteniendo políticas de posts:', postsError)
    } else {
      console.log('✅ Políticas de posts:', postsPolicies)
    }
    
    // Verificar políticas de categories
    console.log('\n📂 Políticas de la tabla categories:')
    const { data: categoriesPolicies, error: categoriesError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            schemaname,
            tablename,
            policyname,
            permissive,
            roles,
            cmd,
            qual,
            with_check
          FROM pg_policies 
          WHERE tablename = 'categories'
          ORDER BY policyname;
        `
      })
    
    if (categoriesError) {
      console.error('❌ Error obteniendo políticas de categories:', categoriesError)
    } else {
      console.log('✅ Políticas de categories:', categoriesPolicies)
    }
    
    // Verificar si RLS está habilitado
    console.log('\n🔒 Estado de RLS:')
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT 
            schemaname,
            tablename,
            rowsecurity
          FROM pg_tables 
          WHERE tablename IN ('posts', 'categories')
          ORDER BY tablename;
        `
      })
    
    if (rlsError) {
      console.error('❌ Error verificando RLS:', rlsError)
    } else {
      console.log('✅ Estado de RLS:', rlsStatus)
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
checkRLSPolicies()
