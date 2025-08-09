import { createSupabaseServerClient } from '../lib/supabase'

interface SamplePost {
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  category_slug: string
  published: boolean
  tags: string[]
}

const samplePosts: SamplePost[] = [
  {
    title: "El Futuro de la Inteligencia Artificial en 2024",
    slug: "futuro-inteligencia-artificial-2024",
    excerpt: "Exploramos las tendencias más importantes en IA que definirán el próximo año, desde ChatGPT hasta la automatización empresarial.",
    content: `# El Futuro de la Inteligencia Artificial en 2024

La inteligencia artificial ha experimentado un crecimiento exponencial en los últimos años, y 2024 promete ser un año decisivo para esta tecnología transformadora.

## Principales Tendencias

### 1. IA Generativa
Los modelos como ChatGPT, GPT-4, y Claude han demostrado capacidades impresionantes en:
- Generación de texto
- Creación de código
- Análisis de datos
- Traducción automática

### 2. Automatización Empresarial
Las empresas están adoptando IA para:
- Servicio al cliente automatizado
- Análisis predictivo
- Optimización de procesos
- Toma de decisiones inteligente

### 3. IA en el Edge
- Procesamiento local en dispositivos
- Menor latencia
- Mayor privacidad
- Independencia de la nube

## Desafíos y Oportunidades

La implementación de IA presenta tanto oportunidades como desafíos:

**Oportunidades:**
- Aumento de productividad
- Nuevos modelos de negocio
- Soluciones innovadoras

**Desafíos:**
- Consideraciones éticas
- Regulación gubernamental
- Impacto en el empleo

## Conclusión

2024 será un año crucial para la adopción masiva de IA en todos los sectores de la economía.`,
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category_slug: "ia",
    published: true,
    tags: ["inteligencia artificial", "tecnología", "futuro", "automatización"]
  },
  {
    title: "Los Mejores Smartphones de 2024: Análisis Completo",
    slug: "mejores-smartphones-2024-analisis",
    excerpt: "Comparativa detallada de los smartphones más destacados del año, incluyendo iPhone 15, Samsung Galaxy S24 y Google Pixel 8.",
    content: `# Los Mejores Smartphones de 2024: Análisis Completo

El mercado de smartphones continúa evolucionando con innovaciones increíbles en cámaras, rendimiento y inteligencia artificial.

## Top 5 Smartphones 2024

### 1. iPhone 15 Pro Max
- **Procesador:** A17 Pro
- **Cámara:** Sistema triple con zoom 5x
- **Batería:** Hasta 29 horas de video
- **Precio:** Desde $1,199

### 2. Samsung Galaxy S24 Ultra
- **Procesador:** Snapdragon 8 Gen 3
- **Cámara:** 200MP principal
- **S Pen:** Incluido
- **Precio:** Desde $1,299

### 3. Google Pixel 8 Pro
- **Procesador:** Tensor G3
- **IA:** Magic Eraser mejorado
- **Cámara:** Computational photography
- **Precio:** Desde $999

### 4. OnePlus 12
- **Procesador:** Snapdragon 8 Gen 3
- **Carga:** 100W SuperVOOC
- **Pantalla:** 120Hz LTPO
- **Precio:** Desde $799

### 5. Xiaomi 14 Pro
- **Procesador:** Snapdragon 8 Gen 3
- **Cámara:** Leica optics
- **Carga inalámbrica:** 50W
- **Precio:** Desde $699

## Tendencias Destacadas

### Inteligencia Artificial
- Asistentes más inteligentes
- Fotografía computacional
- Traducción en tiempo real

### Sostenibilidad
- Materiales reciclados
- Reparabilidad mejorada
- Eficiencia energética

### Conectividad
- 5G Advanced
- Wi-Fi 7
- Satellite connectivity

## Conclusión

2024 marca un año de madurez en el mercado smartphone, con mejoras incrementales pero significativas en IA y sostenibilidad.`,
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop",
    category_slug: "smartphones",
    published: true,
    tags: ["smartphones", "móviles", "tecnología", "reviews"]
  },
  {
    title: "Guía Completa de Desarrollo Web en 2024",
    slug: "guia-desarrollo-web-2024",
    excerpt: "Todo lo que necesitas saber sobre desarrollo web moderno: frameworks, herramientas y mejores prácticas para este año.",
    content: `# Guía Completa de Desarrollo Web en 2024

El desarrollo web continúa evolucionando rápidamente. Aquí te presentamos las tecnologías y prácticas más relevantes para 2024.

## Frontend Frameworks

### React 18+
- **Server Components**
- **Concurrent Rendering**
- **Suspense mejorado**
- **Next.js 14** como meta-framework

### Vue 3
- **Composition API**
- **Script Setup**
- **Nuxt 3** para SSR

### Svelte/SvelteKit
- **Compilador optimizado**
- **Bundle size mínimo**
- **Excelente performance**

## Backend Technologies

### Node.js
- **Express.js** - Clásico y confiable
- **Fastify** - Ultra rápido
- **NestJS** - Escalable y bien estructurado

### Python
- **FastAPI** - Moderno y rápido
- **Django** - Completo y maduro
- **Flask** - Minimalista y flexible

### Rust & Go
- **Actix Web** (Rust)
- **Gin** (Go)
- **Fiber** (Go)

## Bases de Datos

### SQL
- **PostgreSQL** - Potente y confiable
- **MySQL** - Popular y estable
- **SQLite** - Ligero para proyectos pequeños

### NoSQL
- **MongoDB** - Document-based
- **Redis** - In-memory cache
- **Supabase** - Firebase alternativo

## DevOps y Deployment

### Containerización
- **Docker** - Estándar de la industria
- **Kubernetes** - Orquestación
- **Docker Compose** - Desarrollo local

### CI/CD
- **GitHub Actions**
- **GitLab CI**
- **Vercel** - Para frontend
- **Railway** - Para fullstack

### Hosting
- **Vercel** - JAMstack
- **Netlify** - Static sites
- **DigitalOcean** - VPS
- **AWS/Azure/GCP** - Enterprise

## Mejores Prácticas 2024

### Performance
- **Core Web Vitals**
- **Lazy loading**
- **Code splitting**
- **Image optimization**

### SEO
- **Server-side rendering**
- **Meta tags optimization**
- **Structured data**
- **Site speed optimization**

### Seguridad
- **HTTPS everywhere**
- **CSP headers**
- **Input validation**
- **Authentication JWT**

### Accesibilidad
- **ARIA labels**
- **Semantic HTML**
- **Keyboard navigation**
- **Screen reader support**

## Herramientas de Desarrollo

### Editores
- **VS Code** - Más popular
- **WebStorm** - JetBrains
- **Vim/Neovim** - Para puristas

### Build Tools
- **Vite** - Ultra rápido
- **Webpack** - Robusto
- **esbuild** - Extremadamente rápido
- **Turbopack** - Next.js

### Testing
- **Jest** - Unit testing
- **Cypress** - E2E testing
- **Playwright** - Cross-browser testing
- **Vitest** - Vite-based testing

## Conclusión

El desarrollo web en 2024 se enfoca en performance, developer experience y user experience. Elige las herramientas que mejor se adapten a tu proyecto y equipo.`,
    image_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    category_slug: "desarrollo-web",
    published: true,
    tags: ["desarrollo web", "programación", "javascript", "react", "node.js"]
  },
  {
    title: "Top 10 Startups Tecnológicas que Están Cambiando el Mundo",
    slug: "top-startups-tecnologicas-2024",
    excerpt: "Descubre las startups más innovadoras de 2024 que están revolucionando diferentes industrias con tecnología de vanguardia.",
    content: `# Top 10 Startups Tecnológicas que Están Cambiando el Mundo

Las startups continúan siendo el motor de innovación más importante en el ecosistema tecnológico mundial.

## 1. Anthropic
**Sector:** Inteligencia Artificial
- **Producto:** Claude AI
- **Funding:** $4B
- **Diferenciador:** IA más segura y confiable

## 2. Stability AI
**Sector:** IA Generativa
- **Producto:** Stable Diffusion
- **Funding:** $101M
- **Diferenciador:** IA de código abierto

## 3. Figma (pre-Adobe)
**Sector:** Design Tools
- **Producto:** Collaborative design
- **Valuation:** $20B
- **Diferenciador:** Diseño colaborativo en tiempo real

## 4. Stripe
**Sector:** FinTech
- **Producto:** Payment infrastructure
- **Valuation:** $95B
- **Diferenciador:** APIs simples para pagos

## 5. Canva
**Sector:** Design & Media
- **Producto:** Design platform
- **Valuation:** $40B
- **Diferenciador:** Diseño accesible para todos

## 6. Notion
**Sector:** Productivity
- **Producto:** All-in-one workspace
- **Valuation:** $10B
- **Diferenciador:** Flexibilidad extrema

## 7. Discord
**Sector:** Communication
- **Producto:** Gaming communication
- **Valuation:** $15B
- **Diferenciador:** Comunidades especializadas

## 8. Databricks
**Sector:** Data & Analytics
- **Producto:** Lakehouse platform
- **Valuation:** $43B
- **Diferenciador:** Unificación de datos

## 9. Instacart
**Sector:** E-commerce & Delivery
- **Producto:** Grocery delivery
- **Valuation:** $24B
- **Diferenciador:** Compras online de supermercado

## 10. Rivian
**Sector:** Electric Vehicles
- **Producto:** Electric trucks
- **Valuation:** $100B+
- **Diferenciador:** Vehículos eléctricos utilitarios

## Tendencias Clave

### IA y Machine Learning
- **Democratización de IA**
- **Herramientas no-code**
- **IA conversacional**

### Sostenibilidad
- **Green tech**
- **Carbon capture**
- **Renewable energy**

### Remote Work
- **Collaboration tools**
- **Virtual offices**
- **Async communication**

### Web3 y Blockchain
- **DeFi platforms**
- **NFT marketplaces**
- **Crypto infrastructure**

## Sectores en Crecimiento

### HealthTech
- Telemedicina
- Wearables
- AI diagnosis

### EdTech
- Online learning
- Skill development
- VR education

### FinTech
- Digital banking
- Crypto wallets
- Investment platforms

### Climate Tech
- Carbon tracking
- Clean energy
- Sustainable agriculture

## Consejos para Emprendedores

### 1. Solve Real Problems
- Identifica dolor genuino
- Valida con usuarios
- Construye MVP rápido

### 2. Build Great Teams
- Diverse skill sets
- Shared vision
- Strong culture

### 3. Focus on Growth
- Product-market fit
- Scalable business model
- Data-driven decisions

### 4. Secure Funding Wisely
- Angel investors
- Venture capital
- Strategic partnerships

## Conclusión

Las startups exitosas de 2024 combinan tecnología avanzada con soluciones a problemas reales, creando valor tanto para usuarios como para la sociedad.`,
    image_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
    category_slug: "startups",
    published: true,
    tags: ["startups", "emprendimiento", "innovación", "tecnología", "venture capital"]
  },
  {
    title: "Ciberseguridad en 2024: Amenazas y Defensas",
    slug: "ciberseguridad-amenazas-defensas-2024",
    excerpt: "Análisis completo de las principales amenazas cibernéticas de 2024 y las mejores estrategias de defensa para empresas y usuarios.",
    content: `# Ciberseguridad en 2024: Amenazas y Defensas

La ciberseguridad se ha convertido en una prioridad crítica en un mundo cada vez más digital y conectado.

## Principales Amenazas 2024

### 1. Ransomware 2.0
- **Double/Triple extortion**
- **Ransomware as a Service (RaaS)**
- **Ataques a infraestructura crítica**
- **Promedio de rescate:** $1.5M

### 2. IA Maliciosa
- **Deepfakes** para ingeniería social
- **Phishing** generado por IA
- **Ataques** automatizados
- **Evasión** de sistemas de detección

### 3. Ataques a la Cadena de Suministro
- **Software supply chain**
- **Hardware backdoors**
- **Third-party vulnerabilities**
- **Compromiso de repositorios**

### 4. Cloud Security Threats
- **Misconfigured cloud storage**
- **API vulnerabilities**
- **Container escapes**
- **Serverless attacks**

### 5. IoT Botnet Attacks
- **Dispositivos no securizados**
- **DDoS masivos**
- **Espionaje doméstico**
- **Ataques a smart cities**

## Vectores de Ataque Emergentes

### Social Engineering 3.0
- **Vishing** (voice phishing)
- **Smishing** (SMS phishing)
- **Pretexting** avanzado
- **Business Email Compromise (BEC)**

### Zero-Day Exploits
- **Browser vulnerabilities**
- **OS kernel exploits**
- **Application zero-days**
- **Firmware attacks**

### Quantum Computing Threats
- **Post-quantum cryptography**
- **Current encryption vulnerable**
- **Timeline:** 10-15 años

## Estrategias de Defensa

### 1. Zero Trust Architecture
```
Principios fundamentales:
- Never trust, always verify
- Least privilege access
- Assume breach mentality
- Continuous monitoring
```

### 2. Extended Detection and Response (XDR)
- **Unified security platform**
- **Cross-domain visibility**
- **Automated response**
- **Threat hunting capabilities**

### 3. Security Mesh Architecture
- **Distributed security controls**
- **Composable security**
- **Identity-centric security**
- **Perimeter-less protection**

### 4. AI-Powered Defense
- **Behavioral analytics**
- **Anomaly detection**
- **Automated incident response**
- **Predictive threat intelligence**

## Mejores Prácticas para Empresas

### Governance & Risk Management
- **Security frameworks** (NIST, ISO 27001)
- **Risk assessments** regulares
- **Incident response** plans
- **Business continuity** planning

### Technical Controls
- **Multi-factor authentication** (MFA)
- **Endpoint detection** and response
- **Network segmentation**
- **Data encryption** at rest y in transit

### Human Factor Security
- **Security awareness** training
- **Phishing simulations**
- **Insider threat** programs
- **Security culture** development

### Vendor Management
- **Third-party risk** assessments
- **Supply chain** security
- **Contract security** requirements
- **Continuous monitoring**

## Compliance y Regulaciones

### GDPR (Europa)
- **Data protection**
- **Privacy by design**
- **Breach notifications**
- **Right to be forgotten**

### CCPA (California)
- **Consumer privacy rights**
- **Data transparency**
- **Opt-out mechanisms**
- **Data minimization**

### SOX (Financial)
- **Financial reporting**
- **Internal controls**
- **Audit requirements**
- **Executive certification**

### HIPAA (Healthcare)
- **Patient data protection**
- **Access controls**
- **Audit trails**
- **Business associate agreements**

## Herramientas Recomendadas

### Security Information and Event Management (SIEM)
- **Splunk**
- **IBM QRadar**
- **Microsoft Sentinel**
- **Elastic Security**

### Vulnerability Management
- **Nessus**
- **Qualys**
- **Rapid7**
- **OpenVAS**

### Penetration Testing
- **Metasploit**
- **Burp Suite**
- **Nmap**
- **Wireshark**

### Identity Management
- **Okta**
- **Auth0**
- **Microsoft Azure AD**
- **Ping Identity**

## Futuro de la Ciberseguridad

### Tendencias Emergentes
- **Quantum-safe cryptography**
- **Autonomous security**
- **Privacy-preserving** technologies
- **Homomorphic encryption**

### Skills Gap Challenge
- **3.5M** empleos vacantes
- **Continuous learning** necesario
- **Certification programs**
- **University partnerships**

## Conclusión

La ciberseguridad en 2024 requiere un enfoque holístico que combine tecnología avanzada, procesos robustos y una cultura de seguridad sólida. Las organizaciones deben adoptar una mentalidad de "security by design" y mantenerse actualizadas con las amenazas emergentes.`,
    image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
    category_slug: "ciberseguridad",
    published: true,
    tags: ["ciberseguridad", "hacking", "privacidad", "seguridad", "tecnología"]
  }
]

async function createSamplePosts() {
  console.log('🚀 Iniciando creación de posts de ejemplo...')
  
  const supabase = await createSupabaseServerClient()

  // Verificar conexión
  const { data: testConnection, error: connectionError } = await supabase
    .from('posts')
    .select('count')
    .limit(1)

  if (connectionError) {
    console.error('❌ Error de conexión a Supabase:', connectionError)
    return
  }

  console.log('✅ Conexión a Supabase exitosa')

  // Obtener categorías existentes
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, slug')

  if (categoriesError) {
    console.error('❌ Error obteniendo categorías:', categoriesError)
    return
  }

  console.log(`📁 Categorías encontradas: ${categories?.length || 0}`)

  // Crear mapeo de categorías
  const categoryMap: Record<string, string> = {}
  categories?.forEach(cat => {
    categoryMap[cat.slug] = cat.id
  })

  // Obtener un autor admin para asignar a los posts
  const { data: adminAuthor, error: authorError } = await supabase
    .from('authors')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single()

  if (authorError || !adminAuthor) {
    console.error('❌ No se encontró un autor admin. Creando posts sin autor específico.')
  }

  const authorId = adminAuthor?.id

  let successCount = 0
  let errorCount = 0

  // Crear cada post
  for (const post of samplePosts) {
    try {
      console.log(`\n📝 Creando post: "${post.title}"`)

      // Verificar si ya existe un post con ese slug
      const { data: existingPost } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', post.slug)
        .single()

      if (existingPost) {
        console.log(`⚠️  Post con slug "${post.slug}" ya existe. Omitiendo...`)
        continue
      }

      // Obtener el ID de la categoría
      const categoryId = categoryMap[post.category_slug]
      if (!categoryId) {
        console.error(`❌ Categoría "${post.category_slug}" no encontrada`)
        errorCount++
        continue
      }

      // Preparar datos del post
      const postData = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image_url: post.image_url,
        author_id: authorId,
        category_id: categoryId,
        published: post.published,
        published_at: new Date().toISOString(),
        tags: post.tags,
        view_count: Math.floor(Math.random() * 1000) + 50 // Views aleatorias
      }

      // Insertar el post
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single()

      if (error) {
        console.error(`❌ Error creando post "${post.title}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Post creado exitosamente: "${post.title}"`)
        console.log(`   - ID: ${data.id}`)
        console.log(`   - Slug: ${data.slug}`)
        console.log(`   - Categoría: ${post.category_slug}`)
        console.log(`   - Tags: ${post.tags.join(', ')}`)
        successCount++
      }

    } catch (error) {
      console.error(`❌ Error inesperado creando post "${post.title}":`, error)
      errorCount++
    }
  }

  // Resumen final
  console.log(`\n🎉 Proceso completado!`)
  console.log(`✅ Posts creados exitosamente: ${successCount}`)
  console.log(`❌ Errores: ${errorCount}`)
  console.log(`📊 Total procesados: ${samplePosts.length}`)

  if (successCount > 0) {
    console.log(`\n🌐 Los posts deberían estar visibles en tu blog ahora.`)
    console.log(`📝 Puedes editarlos desde el panel admin: /admin`)
  }
}

// Ejecutar el script
if (require.main === module) {
  createSamplePosts()
    .then(() => {
      console.log('\n✨ Script finalizado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Error fatal:', error)
      process.exit(1)
    })
}

export { createSamplePosts }
