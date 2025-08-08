'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit,
  Upload,
  HelpCircle
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  onImageUpload?: (file: File) => Promise<string>
}

const markdownHelp = `
# Guía Markdown

## Encabezados
# H1
## H2
### H3

## Texto
**Negrita** o __negrita__
*Cursiva* o _cursiva_
~~Tachado~~

## Enlaces
[Texto del enlace](https://ejemplo.com)

## Listas
- Elemento 1
- Elemento 2

1. Primer elemento
2. Segundo elemento

## Citas
> Esto es una cita

## Código
\`código en línea\`

\`\`\`javascript
// Bloque de código
function ejemplo() {
  return "Hola mundo";
}
\`\`\`

## Imágenes
![Alt text](url-imagen)

## Tablas
| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato 1    | Dato 2    |

## Separadores
---
`

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Escribe tu contenido en Markdown...',
  minHeight = '400px',
  onImageUpload
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [showHelp, setShowHelp] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newText = before + textToInsert + after
    
    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newStart = start + before.length
      const newEnd = newStart + textToInsert.length
      textarea.setSelectionRange(newStart, newEnd)
    }, 0)
  }, [value, onChange])

  const handleImageUpload = async (file: File) => {
    if (!onImageUpload) {
      // Fallback: just insert placeholder
      insertText('![', '](url-imagen)', 'alt text')
      return
    }

    try {
      const imageUrl = await onImageUpload(file)
      insertText(`![${file.name}](${imageUrl})`)
    } catch (error) {
      console.error('Error uploading image:', error)
      // Insert placeholder on error
      insertText('![', '](url-imagen)', 'alt text')
    }
  }

  const toolbarButtons = [
    {
      icon: Heading1,
      tooltip: 'Encabezado 1',
      action: () => insertText('# ', '', 'Encabezado 1')
    },
    {
      icon: Heading2,
      tooltip: 'Encabezado 2',
      action: () => insertText('## ', '', 'Encabezado 2')
    },
    {
      icon: Heading3,
      tooltip: 'Encabezado 3',
      action: () => insertText('### ', '', 'Encabezado 3')
    },
    {
      icon: Bold,
      tooltip: 'Negrita',
      action: () => insertText('**', '**', 'texto en negrita')
    },
    {
      icon: Italic,
      tooltip: 'Cursiva',
      action: () => insertText('*', '*', 'texto en cursiva')
    },
    {
      icon: Link,
      tooltip: 'Enlace',
      action: () => insertText('[', '](https://)', 'texto del enlace')
    },
    {
      icon: List,
      tooltip: 'Lista',
      action: () => insertText('- ', '', 'elemento de lista')
    },
    {
      icon: ListOrdered,
      tooltip: 'Lista numerada',
      action: () => insertText('1. ', '', 'elemento numerado')
    },
    {
      icon: Quote,
      tooltip: 'Cita',
      action: () => insertText('> ', '', 'texto de la cita')
    },
    {
      icon: Code,
      tooltip: 'Código',
      action: () => insertText('`', '`', 'código')
    },
    {
      icon: Image,
      tooltip: 'Imagen',
      action: () => fileInputRef.current?.click()
    }
  ]

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Toolbar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Editor Markdown</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Ayuda
                </Button>
                <Badge variant="secondary">
                  {value.length} caracteres
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {toolbarButtons.map((button, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={button.action}
                      className="h-8 w-8 p-0"
                    >
                      <button.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{button.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Panel */}
        {showHelp && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guía de Markdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {markdownHelp}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Editor/Preview Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista previa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <Card>
              <CardContent className="p-0">
                <Textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="min-h-[400px] border-0 resize-none rounded-t-none"
                  style={{ minHeight }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="p-6">
                {value.trim() ? (
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                        img({ src, alt, ...props }) {
                          return (
                            <img
                              src={src}
                              alt={alt}
                              className="max-w-full h-auto rounded-lg"
                              {...props}
                            />
                          )
                        },
                        a({ href, children, ...props }) {
                          return (
                            <a
                              href={href}
                              target={href?.startsWith('http') ? '_blank' : undefined}
                              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="text-primary hover:underline"
                              {...props}
                            >
                              {children}
                            </a>
                          )
                        }
                      }}
                    >
                      {value}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4" />
                    <p>Escribe algo en el editor para ver la vista previa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hidden file input for images */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleImageUpload(file)
            }
          }}
        />
      </div>
    </TooltipProvider>
  )
}
