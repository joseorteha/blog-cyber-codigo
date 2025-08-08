
'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ShareButtonProps {
  title: string
  text: string
  url: string
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const { toast } = useToast()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        })
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: 'Enlace copiado',
          description: 'El enlace ha sido copiado al portapapeles.',
        })
      } catch (err) {
        toast({
          title: 'Error',
          description: 'No se pudo copiar el enlace.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      Compartir
    </Button>
  )
}
