
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code, Zap, Shield, Smartphone, Rocket, Mail, Twitter, Github, Linkedin } from 'lucide-react'
import { useAuth } from '@/components/providers'

export default function Footer() {
  const { user, author } = useAuth()
  const categories = [
    { href: '/categoria/ia', label: 'Inteligencia Artificial', icon: Code },
    { href: '/categoria/smartphones', label: 'Tecnología Móvil', icon: Smartphone },
    { href: '/categoria/desarrollo-web', label: 'Desarrollo Web', icon: Zap },
    { href: '/categoria/startups', label: 'Startups', icon: Rocket },
    { href: '/categoria/ciberseguridad', label: 'Ciberseguridad', icon: Shield },
  ]

  const socialLinks = [
    { href: '#', label: 'Twitter', icon: Twitter },
    { href: '#', label: 'GitHub', icon: Github },
    { href: '#', label: 'LinkedIn', icon: Linkedin },
    { href: '#', label: 'Email', icon: Mail },
  ]

  return (
    <footer className="relative bg-black border-t border-purple-500/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Cyber Código
                </h3>
                <p className="text-sm text-gray-400">Blog de Tecnología</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Descubre el futuro de la tecnología a través de artículos sobre IA, desarrollo web, 
              startups y ciberseguridad. Mantente actualizado con las últimas tendencias.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-black/50 border border-purple-500/20 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/40 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Categorías</h4>
            <div className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="flex items-center space-x-3 text-gray-400 hover:text-purple-400 transition-colors duration-200 group"
                  >
                    <Icon className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                    <span>{category.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Enlaces Rápidos</h4>
            <div className="space-y-3">
              <Link href="/" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Inicio
              </Link>
              <Link href="/posts" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Todos los Artículos
              </Link>
              {user ? (
                <>
                  {author?.role === 'admin' && (
                    <Link href="/admin" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200">
                      Panel Admin
                    </Link>
                  )}
                  <Link href="/perfil" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200">
                    Mi Perfil
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200">
                    Iniciar Sesión
                  </Link>
                  <Link href="/auth/registro" className="block text-gray-400 hover:text-purple-400 transition-colors duration-200">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Suscríbete para recibir las últimas noticias y artículos directamente en tu email.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 focus:outline-none transition-all duration-200"
              />
              <Button 
                className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white"
              >
                Suscribirse
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-purple-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Cyber Código. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Términos
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
    </footer>
  )
}
