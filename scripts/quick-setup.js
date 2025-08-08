const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Configuración Rápida - TechNews Blog')
console.log('=====================================\n')

// Verificar si existe .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('❌ No se encontró el archivo .env.local')
  console.log('📝 Por favor, crea el archivo .env.local con las siguientes variables:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima')
  console.log('SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role')
  console.log('NEXT_PUBLIC_SITE_URL=http://localhost:3000')
  console.log('')
  console.log('💡 Puedes obtener estas claves desde tu dashboard de Supabase')
  console.log('')
  process.exit(1)
}

console.log('✅ Archivo .env.local encontrado')

// Verificar conexión a Supabase
console.log('\n🔍 Verificando conexión a Supabase...')
try {
  const { createClient } = require('@supabase/supabase-js')
  require('dotenv').config({ path: '.env.local' })
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Variables de entorno faltantes')
  }
  
  const supabase = createClient(supabaseUrl, serviceRoleKey)
  
  // Verificar conexión
  const { data, error } = await supabase.from('authors').select('count').limit(1)
  
  if (error) {
    console.log('❌ Error conectando a Supabase:', error.message)
    console.log('💡 Asegúrate de que:')
    console.log('   1. Las claves de Supabase sean correctas')
    console.log('   2. El proyecto esté activo en Supabase')
    console.log('   3. Las tablas estén creadas (ejecuta lib/supabase-setup.sql)')
    process.exit(1)
  }
  
  console.log('✅ Conexión a Supabase exitosa')
  
} catch (error) {
  console.log('❌ Error:', error.message)
  process.exit(1)
}

// Ejecutar scripts en orden
console.log('\n📦 Ejecutando configuración...')

try {
  // 1. Confirmar usuarios existentes
  console.log('\n1️⃣ Confirmando usuarios...')
  execSync('npm run confirm-users', { stdio: 'inherit' })
  
  // 2. Crear usuario admin si no existe
  console.log('\n2️⃣ Creando usuario admin...')
  execSync('npm run create-admin', { stdio: 'inherit' })
  
  // 3. Sembrar datos de ejemplo
  console.log('\n3️⃣ Sembrando datos de ejemplo...')
  execSync('npm run seed', { stdio: 'inherit' })
  
  console.log('\n🎉 ¡Configuración completada exitosamente!')
  console.log('\n📋 Próximos pasos:')
  console.log('   1. Ejecuta: npm run dev')
  console.log('   2. Ve a: http://localhost:3000')
  console.log('   3. Inicia sesión con: admin@technews.com / admin123456')
  console.log('   4. Accede al panel admin en: http://localhost:3000/admin')
  
} catch (error) {
  console.log('❌ Error durante la configuración:', error.message)
  console.log('💡 Puedes ejecutar los comandos manualmente:')
  console.log('   npm run confirm-users')
  console.log('   npm run create-admin')
  console.log('   npm run seed')
}
