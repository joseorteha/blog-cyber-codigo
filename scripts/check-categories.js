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

async function checkCategories() {
  try {
    console.log('🔍 Verificando categorías disponibles...')
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('❌ Error obteniendo categorías:', error)
      return
    }
    
    console.log('✅ Categorías encontradas:', categories.length)
    categories.forEach(cat => {
      console.log(`  📂 ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`)
    })
    
    // Verificar si existe la categoría 'ia'
    const iaCategory = categories.find(cat => cat.slug === 'ia')
    if (iaCategory) {
      console.log('✅ Categoría "ia" encontrada:', iaCategory)
    } else {
      console.log('❌ Categoría "ia" NO encontrada')
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
checkCategories()
