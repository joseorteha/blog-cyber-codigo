# Cyber Código - Blog de Tecnología

Un blog moderno y elegante construido con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- **Diseño Cyberpunk**: Tema oscuro con gradientes cyan-purple-pink
- **Autenticación**: Sistema completo de registro y login
- **Panel Admin**: Gestión de posts y usuarios
- **Comentarios**: Sistema de comentarios con reacciones
- **Avatares**: Sistema de avatares predeterminados
- **Noticias**: API de noticias tecnológicas en tiempo real
- **Responsive**: Diseño completamente adaptativo
- **SEO Optimizado**: Meta tags y estructura semántica

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd blog-tech
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_NEWS_API_KEY=tu_news_api_key
```

4. **Configurar la base de datos**
```bash
npm run setup
```

5. **Crear usuario admin**
```bash
npm run create-admin
```

6. **Crear avatares predeterminados**
```bash
npm run create-simple-avatars
```

7. **Ejecutar el proyecto**
```bash
npm run dev
```

## 🔑 Configuración de APIs

### NewsAPI (Noticias Tecnológicas)

Para obtener noticias en tiempo real, necesitas una API key gratuita:

1. Ve a [NewsAPI.org](https://newsapi.org/)
2. Regístrate para obtener una API key gratuita
3. Agrega la key a tu `.env.local`:
```env
NEXT_PUBLIC_NEWS_API_KEY=tu_api_key_aqui
```

**Nota**: La versión gratuita permite 1,000 requests por día, suficiente para desarrollo.

## 📁 Estructura del Proyecto

```
blog-tech/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── auth/              # Páginas de autenticación
│   ├── noticias/          # Página de noticias tecnológicas
│   └── perfil/            # Página de perfil de usuario
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   └── news-card.tsx     # Componente de tarjeta de noticias
├── lib/                  # Utilidades y configuración
│   ├── news-api.ts       # Servicio de API de noticias
│   └── supabase.ts       # Configuración de Supabase
└── scripts/              # Scripts de configuración
```

## 🎨 Características de Diseño

- **Tema Cyberpunk**: Colores oscuros con acentos vibrantes
- **Gradientes**: Cyan → Purple → Pink
- **Animaciones**: Transiciones suaves y efectos hover
- **Tipografía**: Fuentes modernas y legibles
- **Iconografía**: Lucide React icons

## 🔧 Scripts Disponibles

```bash
npm run dev              # Desarrollo
npm run build            # Producción
npm run start            # Servidor de producción
npm run setup            # Configurar base de datos
npm run create-admin     # Crear usuario admin
npm run create-avatars   # Crear avatares predeterminados
npm run seed             # Poblar con datos de ejemplo
```

## 📱 Páginas Principales

- **Inicio** (`/`): Página principal con posts destacados
- **Noticias** (`/noticias`): Noticias tecnológicas en tiempo real
- **Perfil** (`/perfil`): Gestión de perfil y avatar
- **Admin** (`/admin`): Panel de administración
- **Categorías**: IA, Smartphones, Desarrollo Web, Startups, Ciberseguridad

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otros Proveedores

El proyecto es compatible con cualquier proveedor que soporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas:

1. Verifica que todas las variables de entorno estén configuradas
2. Ejecuta `npm run setup` para configurar la base de datos
3. Revisa los logs del servidor para errores específicos
4. Abre un issue en GitHub

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Supabase**