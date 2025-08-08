#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

console.log(`
🚀 TechNews Blog - Script de Configuración Automatizada
================================================

Este script te ayudará a configurar tu blog de tecnología paso a paso.
`)

async function main() {
  try {
    console.log('📋 Verificando requisitos...')
    
    // Check Node.js version
    const nodeVersion = process.version
    const requiredVersion = 18
    const currentVersion = parseInt(nodeVersion.split('.')[0].substring(1))
    
    if (currentVersion < requiredVersion) {
      throw new Error(`Node.js ${requiredVersion}+ requerido. Versión actual: ${nodeVersion}`)
    }
    
    console.log(`✅ Node.js ${nodeVersion}`)
    
    // Check if package.json exists
    try {
      await fs.access('package.json')
      console.log('✅ package.json encontrado')
    } catch {
      throw new Error('❌ package.json no encontrado. ¿Estás en el directorio correcto?')
    }
    
    // Install dependencies
    console.log('\n📦 Instalando dependencias...')
    try {
      execSync('npm install', { stdio: 'inherit' })
      console.log('✅ Dependencias instaladas')
    } catch (error) {
      throw new Error('❌ Error instalando dependencias')
    }
    
    // Create .env.local if it doesn't exist
    console.log('\n🔧 Configurando variables de entorno...')
    
    const envPath = '.env.local'
    const envExample = `.env.example`
    
    try {
      await fs.access(envPath)
      console.log('✅ .env.local ya existe')
    } catch {
      try {
        await fs.access(envExample)
        const envExampleContent = await fs.readFile(envExample, 'utf8')
        await fs.writeFile(envPath, envExampleContent)
        console.log('✅ .env.local creado desde .env.example')
      } catch {
        // Create basic .env.local
        const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# SEO (Optional)
GOOGLE_SITE_VERIFICATION=
YANDEX_VERIFICATION=
`
        await fs.writeFile(envPath, envContent)
        console.log('✅ .env.local creado con plantilla básica')
      }
    }
    
    console.log(`
⚠️  IMPORTANTE: Configura las siguientes variables en .env.local:

1. NEXT_PUBLIC_SUPABASE_URL - URL de tu proyecto Supabase
2. NEXT_PUBLIC_SUPABASE_ANON_KEY - Clave anónima de Supabase  
3. SUPABASE_SERVICE_ROLE_KEY - Clave de servicio de Supabase

📚 Guía para obtener las claves:
   1. Ve a https://supabase.com
   2. Crea un nuevo proyecto
   3. Ve a Settings > API
   4. Copia las claves necesarias
`)
    
    // Create necessary directories
    console.log('\n📁 Creando directorios necesarios...')
    
    const directories = [
      'public/images',
      'docs',
      'scripts',
      'tests'
    ]
    
    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true })
        console.log(`✅ Directorio creado: ${dir}`)
      } catch (error) {
        console.log(`ℹ️  Directorio ya existe: ${dir}`)
      }
    }
    
    // Create docs structure
    console.log('\n📝 Creando documentación básica...')
    
    const docsFiles = [
      {
        path: 'docs/installation.md',
        content: `# Guía de Instalación

## Prerrequisitos
- Node.js 18+
- Cuenta en Supabase

## Instalación
1. Clonar repositorio
2. npm install
3. Configurar .env.local
4. npm run dev

Ver README.md para más detalles.
`
      },
      {
        path: 'docs/api.md',
        content: `# Documentación API

## Endpoints

### Posts
- GET /api/posts - Listar posts
- POST /api/posts - Crear post
- GET /api/posts/[id] - Obtener post
- PUT /api/posts/[id] - Actualizar post
- DELETE /api/posts/[id] - Eliminar post

### Comentarios
- GET /api/comments - Listar comentarios
- POST /api/comments - Crear comentario
- PUT /api/comments/[id] - Actualizar comentario
- DELETE /api/comments/[id] - Eliminar comentario
`
      }
    ]
    
    for (const file of docsFiles) {
      try {
        await fs.writeFile(file.path, file.content)
        console.log(`✅ Documentación creada: ${file.path}`)
      } catch (error) {
        console.log(`ℹ️  Archivo ya existe: ${file.path}`)
      }
    }
    
    // Create package.json scripts if missing
    console.log('\n⚡ Verificando scripts npm...')
    
    const packageJsonPath = 'package.json'
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
    
    const requiredScripts = {
      'dev': 'next dev',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint',
      'type-check': 'tsc --noEmit',
      'seed': 'tsx scripts/seed-blog-posts.ts'
    }
    
    let scriptsAdded = false
    for (const [name, command] of Object.entries(requiredScripts)) {
      if (!packageJson.scripts[name]) {
        packageJson.scripts[name] = command
        scriptsAdded = true
        console.log(`✅ Script añadido: ${name}`)
      }
    }
    
    if (scriptsAdded) {
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
      console.log('✅ package.json actualizado')
    } else {
      console.log('✅ Todos los scripts requeridos ya existen')
    }
    
    console.log(`
🎉 ¡Configuración completada!

📋 Próximos pasos:

1. 🔑 Configura tus claves de Supabase en .env.local
2. 🗄️  Ejecuta los scripts SQL en tu proyecto Supabase:
   - lib/supabase-setup.sql
   - lib/comment-schema.sql 
   - lib/user-roles-update.sql
3. 🌱 (Opcional) Ejecuta el seeding: npm run seed
4. 🚀 Inicia el servidor: npm run dev

📚 Documentación completa: README.md

¿Necesitas ayuda? Revisa docs/ o abre un issue en GitHub.
`)
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`)
    process.exit(1)
  }
}

main()
