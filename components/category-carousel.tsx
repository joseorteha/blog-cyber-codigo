'use client'

import { ChevronRight, Code, Smartphone, Zap, Rocket, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Category {
  href: string
  label: string
  description: string
}

interface CategoryCarouselProps {
  categories: Category[]
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  // Icon mapping based on category label
  const getIconForCategory = (label: string) => {
    switch (label.toLowerCase()) {
      case 'inteligencia artificial':
      case 'ia':
        return Code
      case 'tecnología móvil':
      case 'smartphones':
        return Smartphone
      case 'desarrollo web':
        return Zap
      case 'startups':
        return Rocket
      case 'ciberseguridad':
        return Shield
      default:
        return Code
    }
  }

  // Duplicar categorías para el efecto infinito
  const duplicatedCategories = [...categories, ...categories]

  return (
    <div className="relative w-full">
      {/* Carrusel Container AUTOMÁTICO */}
      <div className="carousel-container">
        <ul className="carousel">
          {duplicatedCategories.map((category, index) => {
            const Icon = getIconForCategory(category.label)
            return (
              <li key={index} className="carousel-item group">
                <Link href={category.href} className="block h-full relative">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative flex flex-col items-center justify-center h-full p-6 text-center">
                    {/* Icon Container - SUPER CHIDO */}
                    <div className="relative mb-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5 shadow-2xl">
                        <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center relative overflow-hidden">
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                          {/* Animated background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                          {/* Sparkle effect */}
                          <Sparkles className="absolute top-1 right-1 w-3 h-3 text-cyan-400 animate-ping" />
                        </div>
                      </div>
                      {/* Outer glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-500/30 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                    </div>

                    {/* Title - CON GRADIENTE */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                      {category.label}
                    </h3>

                    {/* Description - MEJOR TIPOGRAFÍA */}
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xs mb-4 group-hover:text-gray-200 transition-colors duration-300">
                      {category.description}
                    </p>

                    {/* Explore Button - SUPER MODERNO */}
                    <div className="relative">
                      <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/40 hover:border-purple-500/60 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm">
                        Explorar
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      {/* Button glow */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
