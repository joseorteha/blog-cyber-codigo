'use client'

import { ChevronRight, Code, Smartphone, Zap, Rocket, Shield } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface Category {
  href: string
  label: string
  description: string
}

interface CategoryCarouselProps {
  categories: Category[]
}

export default function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

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

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.3

    const animate = () => {
      scrollPosition += scrollSpeed
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Duplicate categories for infinite scroll
  const duplicatedCategories = [...categories, ...categories]

  return (
    <div className="relative w-full px-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900/50 to-slate-900/30 border border-slate-700/50 backdrop-blur-sm">
        <div 
          ref={scrollRef}
          className="flex gap-6 py-8 pl-8 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {duplicatedCategories.map((category, index) => {
            const Icon = getIconForCategory(category.label)
            return (
              <div key={index} className="flex-shrink-0 w-60">
                <Link href={category.href} className="block h-full group">
                  {/* Card Container */}
                  <div className="relative h-full bg-slate-800/60 rounded-lg border border-slate-700/50 backdrop-blur-sm overflow-hidden transition-all duration-300 group-hover:border-purple-400/50 group-hover:shadow-lg group-hover:shadow-purple-500/10">
                    
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative flex flex-col items-center h-full p-6 text-center space-y-4">
                      
                      {/* Icon Container */}
                      <div className="relative">
                        <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                          <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        {/* Outer glow */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white">
                        {category.label}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-slate-300 leading-snug">
                        {category.description}
                      </p>

                      {/* Button */}
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-slate-700/50 rounded-md border border-slate-600/50 hover:bg-slate-700/70 hover:border-purple-400/50 transition-all duration-300 group-hover:translate-x-1">
                          Explorar
                          <ChevronRight className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
        
        {/* Gradient fade effect on sides */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
      </div>
    </div>
  )
}