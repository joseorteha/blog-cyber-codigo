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

async function confirmUsers() {
  try {
    console.log('🔍 Buscando usuarios no confirmados...')
    
    // Obtener todos los usuarios
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error obteniendo usuarios:', error)
      return
    }
    
    const unconfirmedUsers = users.filter(user => !user.email_confirmed_at)
    
    if (unconfirmedUsers.length === 0) {
      console.log('✅ Todos los usuarios ya están confirmados')
      return
    }
    
    console.log(`📧 Encontrados ${unconfirmedUsers.length} usuarios no confirmados`)
    
    // Confirmar cada usuario
    for (const user of unconfirmedUsers) {
      console.log(`📧 Confirmando usuario: ${user.email}`)
      
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          email_confirm: true,
          email_confirmed_at: new Date().toISOString()
        }
      )
      
      if (confirmError) {
        console.error(`❌ Error confirmando ${user.email}:`, confirmError)
      } else {
        console.log(`✅ Usuario confirmado: ${user.email}`)
      }
    }
    
    console.log('🎉 Proceso completado')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
confirmUsers()
