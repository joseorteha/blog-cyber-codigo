
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TechNews - Blog de Noticias Tecnológicas',
  description: 'Las últimas noticias y tendencias en tecnología, IA, smartphones, desarrollo web y startups.',
  keywords: ['tecnología', 'IA', 'smartphones', 'desarrollo web', 'startups', 'noticias tech'],
  authors: [{ name: 'TechNews Team' }],
  openGraph: {
    title: 'TechNews - Blog de Noticias Tecnológicas',
    description: 'Las últimas noticias y tendencias en tecnología',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <title>Cyber Código - Blog de Tecnología</title>
        <meta name="description" content="Blog de tecnología, programación e innovación digital" />
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
