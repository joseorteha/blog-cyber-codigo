-- Script para arreglar las políticas RLS de posts
-- Ejecutar esto en el SQL Editor de Supabase

-- Eliminar políticas existentes de posts
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can manage their own posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;

-- Crear nuevas políticas más permisivas para posts
-- 1. Política para ver posts publicados (cualquier usuario)
CREATE POLICY "Anyone can view published posts" ON public.posts 
FOR SELECT USING (published = true);

-- 2. Política para que los autores puedan gestionar sus propios posts
CREATE POLICY "Authors can manage their own posts" ON public.posts 
FOR ALL USING (
  author_id = auth.uid()
);

-- 3. Política para que los admins puedan gestionar todos los posts
CREATE POLICY "Admins can manage all posts" ON public.posts 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.authors 
    WHERE authors.id = auth.uid() AND authors.role = 'admin'
  )
);

-- 4. Política adicional para que los admins puedan ver todos los posts (incluyendo borradores)
CREATE POLICY "Admins can view all posts" ON public.posts 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.authors 
    WHERE authors.id = auth.uid() AND authors.role = 'admin'
  )
);

-- Verificar que las políticas se aplicaron correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'posts'
ORDER BY policyname;
