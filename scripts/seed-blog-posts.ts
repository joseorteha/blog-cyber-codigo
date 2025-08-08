import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const blogPosts = [
  {
    title: "IA Agéntica y AlphaFold: Los Avances que Están Revolucionando el 2025",
    slug: "ia-agentica-alphafold-revolucion-2025",
    excerpt: "La IA ha dado un salto cuántico en 2025 con sistemas agénticos autónomos y modelos como AlphaFold que revolucionan el descubrimiento de medicamentos.",
    content: "# IA Agéntica y AlphaFold\\n\\nLa inteligencia artificial ha experimentado una transformación radical en 2025. Los **sistemas agénticos** representan el siguiente nivel evolutivo de la IA.\\n\\n## Principales Avances\\n\\n- Toma de decisiones autónomas\\n- Gestión de correos inteligente\\n- Automatización doméstica\\n\\nLa IA agéntica está creando oportunidades ilimitadas en todos los sectores.",
    image_url: "https://cdn.abacus.ai/images/c432eff2-b9fc-4470-b4d9-b0a503a2875b.png",
    category: "ia",
    tags: ["IA", "AlphaFold", "Tecnología", "2025", "España"]
  },
  {
    title: "Galaxy S25 Ultra vs. iPhone 16: La Batalla de los Smartphones con IA en 2025",
    slug: "galaxy-s25-ultra-vs-iphone-16-batalla-smartphones-ia-2025", 
    excerpt: "El mercado móvil 2025 está dominado por la integración de IA avanzada, procesadores Snapdragon 8 Elite y cámaras periscópicas.",
    content: "# Galaxy S25 Ultra vs. iPhone 16\\n\\nEl mercado de smartphones en 2025 está siendo testigo de la guerra más intensa entre Samsung y Apple.\\n\\n## Samsung Galaxy S25 Ultra\\n\\n- Snapdragon 8 Elite (4nm)\\n- 16GB de RAM\\n- Batería 5,700 mAh\\n- Cámara 200MP\\n\\n## iPhone 16 Pro Max\\n\\n- A18 Bionic (3nm)\\n- 8GB de RAM\\n- Cámara 48MP\\n\\nAmbos integran IA avanzada que transforma la experiencia móvil.",
    image_url: "https://cdn.abacus.ai/images/66f6c73d-c7dc-45e4-96be-3f20836b4738.png",
    category: "smartphones", 
    tags: ["Samsung", "iPhone", "Smartphones", "2025", "IA"]
  },
  {
    title: "WebAssembly, Edge Computing y IA: El Futuro del Desarrollo Web en 2025",
    slug: "webassembly-edge-computing-ia-futuro-desarrollo-web-2025",
    excerpt: "El desarrollo web 2025 se centra en optimización extrema con WebAssembly, edge computing que reduce latencia y IA que genera código automáticamente.",
    content: "# WebAssembly y Edge Computing\\n\\nEl desarrollo web está experimentando su transformación más radical.\\n\\n## WebAssembly\\n\\n- 85-95% del rendimiento nativo\\n- 60% más pequeño que JavaScript\\n\\n## Edge Computing\\n\\n- Latencia sub-10ms\\n- Procesamiento cercano al usuario\\n\\n## IA en Desarrollo\\n\\n- 78% de desarrolladores usa IA\\n- 60% incremento en productividad\\n\\nEl futuro del desarrollo web es híbrido, inteligente y ultra-optimizado.",
    image_url: "https://cdn.abacus.ai/images/40cfff6e-37dc-4e23-beb6-bd61fff8d158.png", 
    category: "desarrollo-web",
    tags: ["WebAssembly", "Edge Computing", "PWA", "Desarrollo Web", "2025"]
  },
  {
    title: "De Keybotic a Revolut: Las Startups que Marcarán el 2025", 
    slug: "keybotic-revolut-startups-marcaran-2025",
    excerpt: "El ecosistema startup 2025 está dominado por la robótica autónoma, inteligencia geoespacial y fintech.",
    content: "# Startups que Marcarán 2025\\n\\n## España: Aistech y Keybotic\\n\\n### Aistech Space\\n- 25 satélites en órbita\\n- Serie B de 35-40M€\\n\\n### Keybotic\\n- Ganador DARPA Challenge 2024\\n- Robot-as-a-Service\\n\\n## Revolut: El Decacornio\\n\\n- 45 millones de usuarios\\n- $33B valoración récord\\n\\nEl ecosistema startup 2025 combina deep tech con propósito social.",
    image_url: "https://cdn.abacus.ai/images/23f1814f-a66e-456e-82e9-0c555c7d5400.png",
    category: "startups", 
    tags: ["Startups", "España", "Unicornios", "Inversión", "2025"]
  },
  {
    title: "La Era Post-Cuántica: Por Qué 2025 es el Año de la Revolución en Seguridad",
    slug: "era-post-cuantica-revolucion-seguridad-2025", 
    excerpt: "La computación cuántica alcanza madurez comercial mientras surge la urgencia de criptografía post-cuántica.",
    content: "# La Era Post-Cuántica\\n\\n2025 marca un punto de inflexión en la seguridad digital.\\n\\n## Computación Cuántica\\n\\n- IBM: 1,121 qubits estables\\n- Google Sycamore 2.0\\n\\n## El Problema RSA\\n\\n- 2029: RSA vulnerable\\n- 2030: Criptografía clásica obsoleta\\n\\n## Solución Post-Cuántica\\n\\n- CRYSTALS-Kyber para cifrado\\n- CRYSTALS-Dilithium para firmas\\n\\n## Ciberseguridad 2025\\n\\n- 75% aumento en ataques\\n- $215B gastos globales\\n\\nLa transición post-cuántica no es opcional, es supervivencia digital.",
    image_url: "https://cdn.abacus.ai/images/46fb7e63-1c7c-4532-844d-fc1f098523a4.png",
    category: "ciberseguridad",
    tags: ["Computación Cuántica", "Ciberseguridad", "Criptografía", "2025", "Tecnología"]
  }
]

async function seedBlogPosts() {
  try {
    console.log('🌱 Starting to seed blog posts...')

    // Create admin user
    const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
      email: 'admin@technews.com',
      password: 'TechNews2025!',
      email_confirm: true
    })

    if (signUpError) {
      console.log('Admin user may already exist')
    }

    let adminAuthor
    if (newUser?.user) {
      const { data: newAuthor } = await supabase
        .from('authors')
        .upsert([{
          id: newUser.user.id,
          email: 'admin@technews.com',
          full_name: 'TechNews Admin',
          role: 'admin'
        }])
        .select()
        .single()
      
      adminAuthor = newAuthor
    }

    if (!adminAuthor) {
      const { data: authors } = await supabase
        .from('authors')
        .select('*')
        .eq('role', 'admin')
        .limit(1)
      adminAuthor = authors?.[0]
    }

    // Seed posts
    for (const post of blogPosts) {
      console.log(`📝 Creating post: ${post.title}`)
      
      const { error } = await supabase
        .from('posts')
        .upsert([{
          ...post,
          author_id: adminAuthor?.id,
          published: true,
          published_at: new Date().toISOString()
        }], { onConflict: 'slug' })

      if (error) {
        console.error(`❌ Error creating post: ${error.message}`)
      } else {
        console.log(`✅ Successfully created post: ${post.title}`)
      }
    }

    console.log('🎉 Blog posts seeding completed!')
    
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error)
  }
}

seedBlogPosts()