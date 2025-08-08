'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import NewsCard from '@/components/news-card'
import { 
  getTechNews, 
  getAINews, 
  getStartupNews, 
  getCybersecurityNews, 
  searchTechNews,
  NewsArticle,
  NewsResponse 
} from '@/lib/news-api'
import { 
  Search, 
  RefreshCw, 
  TrendingUp, 
  Brain, 
  Rocket, 
  Shield, 
  Globe,
  Filter
} from 'lucide-react'

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const [country, setCountry] = useState('us')
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const loadNews = async (type: string = 'general') => {
    setLoading(true)
    try {
      let response: NewsResponse

      switch (type) {
        case 'ai':
          response = await getAINews()
          break
        case 'startups':
          response = await getStartupNews()
          break
        case 'cybersecurity':
          response = await getCybersecurityNews()
          break
        default:
          response = await getTechNews(country)
          break
      }

      setNews(response.articles)
      toast({
        title: 'Noticias cargadas',
        description: `Se cargaron ${response.articles.length} artículos`,
      })
    } catch (error) {
      console.error('Error cargando noticias:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las noticias',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await searchTechNews(searchQuery)
      setNews(response.articles)
      toast({
        title: 'Búsqueda completada',
        description: `Se encontraron ${response.articles.length} resultados`,
      })
    } catch (error) {
      console.error('Error en la búsqueda:', error)
      toast({
        title: 'Error',
        description: 'No se pudo realizar la búsqueda',
        variant: 'destructive'
      })
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    loadNews(activeTab)
  }, [activeTab, country])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchQuery('')
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
  }

  const handleRefresh = () => {
    loadNews(activeTab)
  }

  const categories = [
    { id: 'general', name: 'General', icon: TrendingUp },
    { id: 'ai', name: 'Inteligencia Artificial', icon: Brain },
    { id: 'startups', name: 'Startups', icon: Rocket },
    { id: 'cybersecurity', name: 'Ciberseguridad', icon: Shield },
  ]

  const countries = [
    { code: 'us', name: 'Estados Unidos' },
    { code: 'mx', name: 'México' },
    { code: 'es', name: 'España' },
    { code: 'ar', name: 'Argentina' },
    { code: 'br', name: 'Brasil' },
  ]

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            Noticias Tecnológicas
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Últimas Noticias
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Mantente actualizado con las últimas noticias sobre tecnología, IA, startups y ciberseguridad
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-black/20 border-purple-500/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Buscar y Filtrar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-2">
              <Input
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white"
              >
                {isSearching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">País:</span>
                <Select value={country} onValueChange={handleCountryChange}>
                  <SelectTrigger className="w-40 bg-black/50 border-purple-500/30 text-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-purple-500/20">
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-black/20 border-purple-500/20">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/50"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-black/20 border-purple-500/20">
                      <CardHeader className="p-0">
                        <Skeleton className="h-48 w-full rounded-t-lg" />
                      </CardHeader>
                      <CardContent className="p-4">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((article, index) => (
                    <NewsCard
                      key={`${article.url}-${index}`}
                      article={article}
                      variant={index === 0 ? 'featured' : 'default'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-4">
                    No se encontraron noticias
                  </div>
                  <Button
                    onClick={handleRefresh}
                    className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white"
                  >
                    Intentar de nuevo
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Results Info */}
        {!loading && news.length > 0 && (
          <div className="text-center mt-8">
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              {news.length} artículos encontrados
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
