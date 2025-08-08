'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Calendar, User, Eye } from 'lucide-react'
import { NewsArticle, formatDate, truncateText, getDefaultImage } from '@/lib/news-api'
import Image from 'next/image'

interface NewsCardProps {
  article: NewsArticle
  variant?: 'default' | 'featured' | 'compact'
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const imageUrl = article.urlToImage || getDefaultImage()
  const formattedDate = formatDate(article.publishedAt)
  const truncatedDescription = truncateText(article.description || '', 120)

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 bg-black/20 border-purple-500/20 hover:border-purple-500/40">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded-lg"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-black/30 to-purple-900/20 border-purple-500/30 hover:border-purple-500/50">
        <CardHeader className="p-0">
          <div className="relative h-64 w-full">
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-t-lg" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="outline" className="mb-2 border-purple-500/50 text-purple-300">
                Destacado
              </Badge>
              <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                {article.title}
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-300 mb-4 line-clamp-3">
            {truncatedDescription}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{truncateText(article.author, 20)}</span>
                </div>
              )}
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Leer
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Variant default
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-black/20 border-purple-500/20 hover:border-purple-500/40 h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300 text-xs">
              {article.source.name}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-white text-lg line-clamp-2 mb-3 group-hover:text-purple-300 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
          {truncatedDescription}
        </p>
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
            {article.author && (
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <User className="w-3 h-3" />
                <span>{truncateText(article.author, 15)}</span>
              </div>
            )}
          </div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Leer Artículo
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
