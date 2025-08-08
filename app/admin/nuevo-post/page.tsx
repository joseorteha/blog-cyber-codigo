'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { BLOG_CATEGORIES } from '@/lib/types'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'

export default function NuevoPostPage() {
  const { user, author, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseClient()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: '',
    published: false,
    tags: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not admin
  if (!loading && (!user || author?.role !== 'admin')) {
    router.push('/')
    return null
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log(`🔄 Cambiando campo ${field}:`, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      
      setFormData(prev => ({
        ...prev,
        slug
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('🚀 Iniciando creación de post...')
      console.log('👤 User ID:', user?.id)
      console.log('📝 Form Data:', formData)

      // Validate required fields
      console.log('🔍 Validando campos requeridos...')
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        console.log('❌ Validación fallida - campos requeridos faltantes')
        console.log('📋 Campos:', {
          title: !!formData.title,
          excerpt: !!formData.excerpt,
          content: !!formData.content,
          category: !!formData.category
        })
        toast({
          title: 'Error',
          description: 'Por favor completa todos los campos requeridos.',
          variant: 'destructive'
        })
        return
      }
      console.log('✅ Validación de campos exitosa')

      // Prepare tags array
      console.log('🏷️ Preparando etiquetas...')
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      console.log('📋 Etiquetas procesadas:', tags)

      // Primero necesitamos obtener el category_id basado en el slug
      console.log('📂 Obteniendo categoría para slug:', formData.category)
      console.log('📋 Categorías disponibles en BLOG_CATEGORIES:', BLOG_CATEGORIES)
      
      // Mapeo directo de categorías para evitar problemas de RLS
      const categoryMap: Record<string, string> = {
        'ia': 'f6c64f4d-e13d-4d59-b5e5-a30907c8e3bd',
        'smartphones': 'ca4ceaa5-c258-4a2d-81bc-c487472b4f10',
        'desarrollo-web': 'b230278f-0e4c-43f6-9abc-173990688936',
        'startups': 'startups-id', // Placeholder
        'ciberseguridad': '58ed9026-9dc8-49c5-8e10-a4ccff192447'
      }
      
      const categoryId = categoryMap[formData.category]
      
      if (!categoryId) {
        console.error('❌ Categoría no encontrada en el mapeo:', formData.category)
        toast({
          title: 'Error',
          description: 'Categoría no válida.',
          variant: 'destructive'
        })
        return
      }
      
      const categoryData = { id: categoryId }
      console.log('✅ Categoría obtenida (mapeo directo):', categoryData)

             const postData = {
         title: formData.title,
         slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
         excerpt: formData.excerpt,
         content: formData.content,
         image_url: formData.image_url || null,
         category: formData.category, // Enviar el slug de la categoría, no el ID
         published: formData.published,
         tags: tags.length > 0 ? tags : null
         // No enviar author_id, la API route lo obtiene del usuario autenticado
       }

             console.log('📊 Post Data a enviar:', JSON.stringify(postData, null, 2))

      try {
        console.log('🔄 Insertando post en Supabase...')
        
        // Usar una API route para evitar problemas de RLS
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al crear el post')
        }
        
        const data = await response.json()
        console.log('✅ Post creado exitosamente:', data)
      } catch (error) {
        console.error('❌ Error en inserción de post:', error)
        throw error
      }

      toast({
        title: 'Post creado',
        description: `El post "${formData.title}" ha sido creado exitosamente.`
      })

      // Redirect to admin panel
      router.push('/admin')
    } catch (error: unknown) {
      console.error('❌ Error creating post:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el post.'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      console.log('🏁 Finalizando submit...')
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || author?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">No tienes permisos para crear posts.</p>
          <Button asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Panel
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Crear Nuevo Post</h1>
              <p className="text-muted-foreground mt-2">
                Crea un nuevo artículo para tu blog
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contenido del Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Título del artículo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="url-del-articulo"
                    />
                    <p className="text-xs text-muted-foreground">
                      Se genera automáticamente desde el título
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      placeholder="Breve descripción del artículo..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Escribe el contenido del artículo..."
                      rows={15}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOG_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de la imagen</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Etiquetas</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="ia, tecnología, innovación"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separa las etiquetas con comas
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                    <Label htmlFor="published">Publicar inmediatamente</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{formData.title || 'Título del artículo'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.excerpt || 'Extracto del artículo...'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Categoría: {formData.category || 'Sin categoría'}</span>
                      <span>•</span>
                      <span>{formData.published ? 'Publicado' : 'Borrador'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin">Cancelar</Link>
            </Button>
            
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
