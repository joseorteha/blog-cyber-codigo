-- Script para arreglar las políticas RLS
-- Ejecutar esto en el SQL Editor de Supabase

-- Eliminar políticas existentes de categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON public.categories;

-- Crear nuevas políticas para categories
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
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
WHERE tablename = 'categories';
