'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/components/providers'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search, Menu, X, User, Settings, LogOut, PenTool, Code, Zap, Shield, Smartphone, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Notifications from './notifications'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, author, signOut } = useAuth()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery?.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const categories = [
    { href: '/categoria/ia', label: 'IA', icon: Code },
    { href: '/categoria/smartphones', label: 'Smartphones', icon: Smartphone },
    { href: '/categoria/desarrollo-web', label: 'Desarrollo Web', icon: Zap },
    { href: '/categoria/startups', label: 'Startups', icon: Rocket },
    { href: '/categoria/ciberseguridad', label: 'Ciberseguridad', icon: Shield },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 xl:h-24">
          {/* Logo y Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                  <Image
                    src="/logo.jpg"
                    alt="Cyber Código"
                    width={36}
                    height={36}
                    className="rounded-lg object-cover w-auto h-auto"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Cyber Código
                </span>
                <span className="text-xs text-gray-400 hidden sm:block">
                  Blog de Tecnología
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 mx-4">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 hover:bg-purple-500/10 rounded-lg"
            >
              Inicio
            </Link>
            <Link
              href="/noticias"
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 hover:bg-purple-500/10 rounded-lg"
            >
              Noticias
            </Link>
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.href}
                  href={category.href}
                  className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 hover:bg-purple-500/10 rounded-lg flex items-center space-x-2 group"
                >
                  <Icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                  <span>{category.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 h-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {user && <Notifications />}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={author?.avatar_url} alt={author?.full_name || user.email || ''} />
                      <AvatarFallback className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white">
                        {author?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/95 border-purple-500/20" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-white">{author?.full_name || 'Usuario'}</p>
                      <p className="w-[200px] truncate text-sm text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-purple-500/20" />
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                    <Link href="/perfil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  {author?.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                        <Link href="/admin" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                        <Link href="/admin/nuevo-post" className="flex items-center">
                          <PenTool className="mr-2 h-4 w-4" />
                          Crear Post
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-purple-500/20" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-gray-300 hover:text-red-400 hover:bg-red-500/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  asChild
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 h-9 px-3"
                >
                  <Link href="/auth/login">Iniciar Sesión</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white h-9 px-3"
                >
                  <Link href="/auth/registro">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden text-gray-300 hover:text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-purple-500/20 bg-black/95 backdrop-blur-xl">
            <div className="py-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3 px-3">
                <Input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 h-9"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </form>

              <div className="space-y-1 px-3">
                <Link
                  href="/"
                  className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/noticias"
                  className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Noticias
                </Link>
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-colors flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </Link>
                  )
                })}
              </div>

              {!user && (
                <div className="pt-3 pb-2 border-t border-purple-500/20 mt-3 px-3">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      asChild 
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 h-9"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/auth/login">
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white h-9"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/auth/registro">
                        Registrarse
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}