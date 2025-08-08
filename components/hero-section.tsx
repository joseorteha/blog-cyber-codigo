
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import CategoryCarousel from './category-carousel'

export default function HeroSection() {
  // Categories for carousel
  const categories = [
    {
      href: '/categoria/ia',
      label: 'Inteligencia Artificial',
      description: 'Las últimas tendencias en IA y machine learning'
    },
    {
      href: '/categoria/smartphones',
      label: 'Tecnología Móvil',
      description: 'Smartphones, apps y dispositivos del futuro'
    },
    {
      href: '/categoria/desarrollo-web',
      label: 'Desarrollo Web',
      description: 'Frameworks, herramientas y mejores prácticas'
    },
    {
      href: '/categoria/startups',
      label: 'Startups',
      description: 'Innovación, emprendimiento y tecnología'
    },
    {
      href: '/categoria/ciberseguridad',
      label: 'Ciberseguridad',
      description: 'Protección digital y seguridad informática'
    }
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(156,146,172,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 lg:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Cyber Código
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              Descubre el futuro de la tecnología. Artículos sobre{' '}
              <span className="text-purple-400 font-semibold">IA</span>,{' '}
              <span className="text-cyan-400 font-semibold">desarrollo</span>,{' '}
              <span className="text-pink-400 font-semibold">startups</span> y más.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 lg:mb-16">
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-xl shadow-2xl shadow-purple-500/25"
            >
              <Link href="/categoria/ia" className="flex items-center space-x-2">
                <span>Explorar Artículos</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50 text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-xl"
            >
              <Link href="/auth/registro">Únete a la Comunidad</Link>
            </Button>
          </div>

          {/* Categories Carousel */}
          <div className="max-w-6xl mx-auto">
            <CategoryCarousel categories={categories} />
          </div>

          {/* Stats */}
          <div className="mt-8 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                100+
              </div>
              <div className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Artículos Publicados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Lectores Mensuales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">Contenido Actualizado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  )
}
