
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, Share2, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ShareButton from '@/components/share-button'
import CommentsSection from '@/components/comments-section'

export const revalidate = 60

interface Params {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()
  
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, image_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) {
    return {
      title: 'Post no encontrado | TechNews',
    }
  }

  return {
    title: `${post.title} | TechNews`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.image_url ? [post.image_url] : [],
    },
  }
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()
  
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:authors(*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const publishedDate = post.published_at || post.created_at

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {post.image_url && (
          <div className="relative h-[60vh] bg-muted">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto w-full px-4 pb-8">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  {post.category || 'General'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(publishedDate)}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {post.title}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-4">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {post.author?.full_name || post.author?.email || 'Autor'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/" className="inline-flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Volver
                    </Link>
                  </Button>
                  <ShareButton
                    title={post.title}
                    text={post.excerpt}
                    url={`${process.env.NEXT_PUBLIC_SITE_URL}/post/${post.slug}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t">
          <CommentsSection postId={post.id} postSlug={post.slug} />
        </div>
      </div>
    </article>
  )
}
