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

    const animate = () => {
      scrollPosition += 0.5
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
    <div className="relative w-full">
             {/* PERRONO Carousel Container */}
       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/20 via-slate-900/50 to-cyan-900/20 border border-purple-500/20 backdrop-blur-sm">
         <div 
           ref={scrollRef}
           className="flex gap-8 p-10 overflow-x-auto scrollbar-hide"
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
         >
           {duplicatedCategories.map((category, index) => {
             const Icon = getIconForCategory(category.label)
             return (
               <div key={index} className="flex-shrink-0 w-96 h-56">
                <Link href={category.href} className="block h-full group">
                  {/* PERRONA Card */}
                  <div className="relative h-full bg-gradient-to-br from-slate-800/80 via-purple-900/40 to-slate-800/80 rounded-xl border border-purple-500/30 backdrop-blur-sm overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-purple-400/50 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
                    
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                                         {/* Content */}
                     <div className="relative flex flex-col items-center justify-center h-full p-8 text-center">
                       
                       {/* PERRONO Icon Container */}
                       <div className="relative mb-6">
                         <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5 shadow-xl">
                           <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center relative overflow-hidden">
                             <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white relative z-10" />
                             {/* Animated background */}
                             <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
                           </div>
                         </div>
                         {/* Outer glow */}
                         <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                       </div>

                       {/* PERRONO Title */}
                       <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                         {category.label}
                       </h3>

                       {/* PERRONO Description */}
                       <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300 max-w-xs">
                         {category.description}
                       </p>

                       {/* PERRONO Button */}
                       <div className="relative">
                         <span className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/40 hover:border-purple-500/60 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm group-hover:scale-105">
                           Explorar
                           <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                         </span>
                         {/* Button glow */}
                         <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       </div>
                     </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
