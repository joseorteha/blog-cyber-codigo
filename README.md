# 🚀 Cyber Código - Blog de Tecnología

Un blog moderno y elegante de tecnología construido con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **Supabase**. Diseñado para ser completamente responsive y optimizado para móviles.

![Cyber Código Blog](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)

## ✨ Características Principales

### 🎨 **Diseño Moderno**
- **Tema Cyberpunk** con gradientes cyan → purple → pink
- **Carrusel automático** con animaciones fluidas
- **Diseño completamente responsive** optimizado para móviles
- **Efectos visuales avanzados** (glow, sparkles, shimmer)

### 📱 **Optimización Móvil**
- **Mobile-first design** con breakpoints optimizados
- **Touch gestures** mejorados
- **Performance optimizada** para dispositivos móviles
- **Carrusel automático** con pausa en hover

### 🔐 **Sistema de Autenticación**
- **Supabase Auth** integrado
- **Roles de usuario** (admin, user, editor, moderator)
- **Perfiles personalizables** con avatares
- **Panel de administración** protegido

### 📝 **Gestión de Contenido**
- **Editor Markdown** avanzado
- **Categorías y tags** organizadas
- **Posts destacados** y programación
- **Sistema de comentarios** con reacciones

### 🌐 **Integración de APIs**
- **NewsAPI** para noticias tecnológicas
- **Búsqueda inteligente** de artículos
- **Filtros por categoría** y país
- **Contenido dinámico** actualizado

### ⚡ **Performance**
- **Next.js 14 App Router**
- **Static Generation** optimizada
- **Image optimization** automática
- **Caching inteligente**

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animaciones**: CSS Native, Framer Motion
- **Validación**: Zod
- **Deployment**: Vercel (recomendado)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- API Key de NewsAPI (opcional)

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