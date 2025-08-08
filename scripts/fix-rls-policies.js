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

async function fixRLSPolicies() {
  try {
    console.log('🔧 Arreglando políticas RLS...')
    
    // Eliminar políticas existentes
    console.log('🗑️ Eliminando políticas existentes...')
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
        DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;
      `
    })
    
    // Crear nuevas políticas
    console.log('✅ Creando nuevas políticas...')
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
        CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
          EXISTS (
            SELECT 1 FROM public.authors 
            WHERE authors.id = auth.uid() AND authors.role = 'admin'
          )
        );
      `
    })
    
    console.log('✅ Políticas RLS arregladas')
    
    // Probar la consulta
    console.log('🧪 Probando consulta de categorías...')
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error en prueba:', error)
    } else {
      console.log('✅ Consulta exitosa:', categories.length, 'categorías encontradas')
    }
    
  } catch (error) {
    console.error('❌ Error arreglando políticas:', error)
  }
}

// Ejecutar el script
fixRLSPolicies()
