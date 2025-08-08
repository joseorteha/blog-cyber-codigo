'use client'

import { useAuth } from '@/components/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const { user, author, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [authorInfo, setAuthorInfo] = useState<any>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function fetchDebugInfo() {
      // Get session info
      const { data: { session } } = await supabase.auth.getSession()
      setSessionInfo(session)

      // Get author info directly
      if (user) {
        const { data, error } = await supabase
          .from('authors')
          .select('*')
          .eq('id', user.id)
          .single()
        
        setAuthorInfo({ data, error })
      }
    }

    fetchDebugInfo()
  }, [user, supabase])

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Debug - Estado de Autenticación</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Estado del Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({
                loading,
                user: user ? {
                  id: user.id,
                  email: user.email,
                  email_confirmed_at: user.email_confirmed_at,
                  created_at: user.created_at
                } : null,
                author: author ? {
                  id: author.id,
                  email: author.email,
                  full_name: author.full_name,
                  role: author.role,
                  created_at: author.created_at
                } : null
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Sesión (Directa)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Autor (Directa)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authorInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Enlaces de Prueba:</h3>
              <div className="space-y-2">
                <Button asChild variant="outline">
                  <a href="/admin" target="_blank">Ir a /admin</a>
                </Button>
                <br />
                <Button asChild variant="outline">
                  <a href="/auth/login" target="_blank">Ir a /auth/login</a>
                </Button>
                <br />
                <Button asChild variant="outline">
                  <a href="/" target="_blank">Ir a / (inicio)</a>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Estado Actual:</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
                <p><strong>Usuario:</strong> {user ? 'Sí' : 'No'}</p>
                <p><strong>Autor:</strong> {author ? 'Sí' : 'No'}</p>
                <p><strong>Rol:</strong> {author?.role || 'Sin rol'}</p>
                <p><strong>Es Admin:</strong> {author?.role === 'admin' ? 'Sí' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
