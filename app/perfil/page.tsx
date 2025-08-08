'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/providers'
import { User, Mail, Calendar, Edit, Save, X, Shield, PenTool } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AvatarSelectorSimple from '@/components/avatar-selector-simple'

export default function ProfilePage() {
  const { user, author, signOut } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: author?.full_name || '',
    bio: author?.bio || '',
    website: author?.website || '',
    twitter: author?.twitter || '',
    github: author?.github || ''
  })

  const handleAvatarChange = (newAvatarUrl: string) => {
    // El avatar se actualiza automáticamente en la base de datos
    // Solo necesitamos refrescar la página para ver los cambios
    window.location.reload()
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Aquí podrías hacer la actualización en Supabase
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsEditing(false)
    setIsLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      full_name: author?.full_name || '',
      bio: author?.bio || '',
      website: author?.website || '',
      twitter: author?.twitter || '',
      github: author?.github || ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Acceso Denegado
          </h1>
          <p className="text-gray-400 text-lg">
            Debes iniciar sesión para acceder a tu perfil.
          </p>
          <Button 
            asChild 
            className="mt-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white"
          >
            <a href="/auth/login">Iniciar Sesión</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            Mi Perfil
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mi Perfil
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Información Personal</span>
                  </CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
                <CardDescription className="text-gray-400">
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre Completo
                      </label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Biografía
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 resize-none"
                        placeholder="Cuéntanos sobre ti..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Sitio Web
                        </label>
                        <Input
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                          placeholder="https://tu-sitio.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Twitter
                        </label>
                        <Input
                          value={formData.twitter}
                          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                          className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                          placeholder="@tu-usuario"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        GitHub
                      </label>
                      <Input
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                        placeholder="tu-usuario"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white"
                      >
                        {isLoading ? (
                          <span className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-2">
                            <Save className="w-4 h-4" />
                            <span>Guardar</span>
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300">
                        Miembro desde {new Date(user.created_at || Date.now()).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    {author?.full_name && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-300">{author.full_name}</span>
                      </div>
                    )}
                    {author?.bio && (
                      <div className="pt-2">
                        <p className="text-gray-300">{author.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Estadísticas de Cuenta</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">0</div>
                    <div className="text-sm text-gray-400">Posts Publicados</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-cyan-400">0</div>
                    <div className="text-sm text-gray-400">Comentarios</div>
                  </div>
                  <div className="text-center p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-pink-400">0</div>
                    <div className="text-sm text-gray-400">Likes Recibidos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
                         {/* Profile Avatar */}
             <Card className="bg-black/20 border-purple-500/20">
               <CardHeader>
                 <CardTitle className="text-white">Foto de Perfil</CardTitle>
               </CardHeader>
               <CardContent className="text-center">
                 <AvatarSelectorSimple
                   currentAvatarUrl={author?.avatar_url}
                   userName={author?.full_name || user.email || 'Usuario'}
                   onAvatarChange={handleAvatarChange}
                   size="lg"
                 />
               </CardContent>
             </Card>

            {/* Quick Actions */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {author?.role === 'admin' && (
                  <>
                    <Button asChild variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                      <a href="/admin">
                        <PenTool className="w-4 h-4 mr-2" />
                        Panel Admin
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                      <a href="/posts">
                        Ver Mis Posts
                      </a>
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
                >
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Información de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rol:</span>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {author?.role || 'Usuario'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Estado:</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    Activo
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Verificado:</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Sí
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
