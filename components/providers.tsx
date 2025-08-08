
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Author } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  author: Author | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  author: null,
  loading: true,
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchAuthorProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchAuthorProfile(session.user.id)
      } else {
        setAuthor(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const fetchAuthorProfile = async (userId: string) => {
    try {
      console.log('Fetching author profile for user:', userId)
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching author profile:', error)
        // If author doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('Author not found, creating basic profile...')
          const { data: userData } = await supabase.auth.getUser()
          if (userData.user) {
            const { data: newAuthor, error: createError } = await supabase
              .from('authors')
              .insert({
                id: userId,
                email: userData.user.email,
                full_name: userData.user.user_metadata?.full_name || 'Usuario',
                role: 'user',
                avatar_url: null
              })
              .select()
              .single()
            
            if (createError) {
              console.error('Error creating author profile:', createError)
            } else {
              console.log('Author profile created:', newAuthor)
              setAuthor(newAuthor)
            }
          }
        }
      } else {
        console.log('Author profile found:', data)
        setAuthor(data)
      }
    } catch (error) {
      console.error('Error in fetchAuthorProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, author, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
