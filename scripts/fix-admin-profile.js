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

async function fixAdminProfile() {
  try {
    console.log('🔍 Verificando perfil de admin...')
    
    // Buscar usuario admin
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError)
      return
    }
    
    const adminUser = users.find(user => user.email === 'admin@technews.com')
    
    if (!adminUser) {
      console.log('❌ Usuario admin no encontrado')
      return
    }
    
    console.log(`✅ Usuario admin encontrado: ${adminUser.email}`)
    console.log(`🆔 ID: ${adminUser.id}`)
    console.log(`📧 Email confirmado: ${adminUser.email_confirmed_at ? 'Sí' : 'No'}`)
    
    // Verificar perfil de autor
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .select('*')
      .eq('id', adminUser.id)
      .single()
    
    if (authorError) {
      console.log('❌ Error obteniendo perfil de autor:', authorError.message)
      
      if (authorError.code === 'PGRST116') {
        console.log('📝 Creando perfil de autor para admin...')
        
        const { data: newAuthor, error: createError } = await supabase
          .from('authors')
          .insert({
            id: adminUser.id,
            email: adminUser.email,
            full_name: 'Administrador',
            role: 'admin',
            avatar_url: null
          })
          .select()
          .single()
        
        if (createError) {
          console.error('❌ Error creando perfil de autor:', createError)
          return
        }
        
        console.log('✅ Perfil de autor creado:', newAuthor)
      }
    } else {
      console.log('✅ Perfil de autor encontrado:', author)
      
      // Verificar si el rol es admin
      if (author.role !== 'admin') {
        console.log('🔄 Actualizando rol a admin...')
        
        const { error: updateError } = await supabase
          .from('authors')
          .update({ role: 'admin' })
          .eq('id', adminUser.id)
        
        if (updateError) {
          console.error('❌ Error actualizando rol:', updateError)
        } else {
          console.log('✅ Rol actualizado a admin')
        }
      }
    }
    
    // Confirmar email si no está confirmado
    if (!adminUser.email_confirmed_at) {
      console.log('📧 Confirmando email...')
      
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { 
          email_confirm: true,
          email_confirmed_at: new Date().toISOString()
        }
      )
      
      if (confirmError) {
        console.error('❌ Error confirmando email:', confirmError)
      } else {
        console.log('✅ Email confirmado')
      }
    }
    
    console.log('🎉 Proceso completado')
    console.log('\n📋 Información del admin:')
    console.log(`📧 Email: admin@technews.com`)
    console.log(`🔑 Contraseña: admin123456`)
    console.log(`👤 Rol: admin`)
    console.log(`🆔 ID: ${adminUser.id}`)
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
fixAdminProfile()
