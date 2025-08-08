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

async function createAdminUser() {
  try {
    const email = process.argv[2] || 'admin@technews.com'
    const password = process.argv[3] || 'admin123456'
    const fullName = process.argv[4] || 'Administrador'
    
    console.log(`🔧 Creando usuario admin: ${email}`)
    
    // Crear usuario en Auth
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    })
    
    if (authError) {
      console.error('❌ Error creando usuario en Auth:', authError)
      return
    }
    
    console.log(`✅ Usuario creado en Auth: ${user.email}`)
    
    // Crear perfil de autor en la tabla authors
    const { error: authorError } = await supabase
      .from('authors')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: 'admin',
        avatar_url: null
      })
    
    if (authorError) {
      console.error('❌ Error creando perfil de autor:', authorError)
      return
    }
    
    console.log(`✅ Perfil de autor creado para: ${user.email}`)
    console.log('🎉 Usuario admin creado exitosamente!')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Contraseña: ${password}`)
    console.log(`👤 Rol: admin`)
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
createAdminUser()
