'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  MessageCircle, 
  FileText, 
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'
import { getBlogStats } from '@/lib/analytics'

interface BlogStats {
  totalPosts: number
  publishedPosts: number
  totalViews: number
  totalComments: number
}

export default function BlogStats() {
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalComments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const blogStats = await getBlogStats()
      setStats(blogStats)
    } catch (error) {
      console.error('Error fetching blog stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-purple-500/20 rounded mb-2"></div>
                <div className="h-6 bg-purple-500/20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-black/20 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Posts Publicados</p>
              <p className="text-2xl font-bold text-white">{stats.publishedPosts}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Vistas</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.totalViews)}</p>
            </div>
            <Eye className="w-8 h-8 text-cyan-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Comentarios</p>
              <p className="text-2xl font-bold text-white">{formatNumber(stats.totalComments)}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-pink-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Promedio</p>
              <p className="text-2xl font-bold text-white">
                {stats.publishedPosts > 0 
                  ? Math.round(stats.totalViews / stats.publishedPosts) 
                  : 0
                }
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
