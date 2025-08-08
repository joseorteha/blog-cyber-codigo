const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
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

async function applyRLSFix() {
  try {
    console.log('🔧 Aplicando fix de políticas RLS...')
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, '../lib/fix-rls-posts.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📄 Contenido del SQL:')
    console.log(sqlContent)
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`\n🔄 Ejecutando ${commands.length} comandos SQL...`)
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      if (command.trim()) {
        console.log(`\n📝 Comando ${i + 1}: ${command.substring(0, 50)}...`)
        
        try {
          const { data, error } = await supabase
            .rpc('exec_sql', { sql: command })
          
          if (error) {
            console.error(`❌ Error en comando ${i + 1}:`, error)
          } else {
            console.log(`✅ Comando ${i + 1} ejecutado exitosamente`)
          }
        } catch (err) {
          console.error(`❌ Error ejecutando comando ${i + 1}:`, err.message)
        }
      }
    }
    
    console.log('\n🎉 Fix de RLS aplicado')
    
    // Probar inserción después del fix
    console.log('\n🧪 Probando inserción después del fix...')
    const testPost = {
      title: 'Test Post After RLS Fix',
      slug: 'test-post-after-rls-fix',
      excerpt: 'Este es un post de prueba después del fix de RLS.',
      content: 'Contenido de prueba después del fix.',
      category_id: 'f6c64f4d-e13d-4d59-b5e5-a30907c8e3bd',
      published: false,
      author_id: 'b59fae49-ddf9-40be-97f5-9166a707a6d8'
    }
    
    const { data: newPost, error: insertError } = await supabase
      .from('posts')
      .insert([testPost])
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Error en inserción de prueba:', insertError)
    } else {
      console.log('✅ Inserción de prueba exitosa:', newPost)
      
      // Limpiar el post de prueba
      await supabase
        .from('posts')
        .delete()
        .eq('id', newPost.id)
      
      console.log('✅ Post de prueba eliminado')
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar el script
applyRLSFix()
