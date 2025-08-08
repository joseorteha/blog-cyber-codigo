
-- Create tables for our blog

-- Users/Authors table (extends Supabase auth.users)
CREATE TABLE public.authors (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Posts table
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES public.authors(id),
  category_id UUID REFERENCES public.categories(id),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_posts_published ON public.posts(published, published_at DESC);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_category ON public.posts(category_id);
CREATE INDEX idx_posts_slug ON public.posts(slug);

-- RLS Policies

-- Authors policies
CREATE POLICY "Authors can view all profiles" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.authors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.authors FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.authors 
    WHERE authors.id = auth.uid() AND authors.role = 'admin'
  )
);

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Authors can view their own posts" ON public.posts FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Admins can view all posts" ON public.posts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.authors 
    WHERE authors.id = auth.uid() AND authors.role = 'admin'
  )
);
CREATE POLICY "Authors can insert their own posts" ON public.posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Authors can update their own posts" ON public.posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Admins can manage all posts" ON public.posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.authors 
    WHERE authors.id = auth.uid() AND authors.role = 'admin'
  )
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
('Inteligencia Artificial', 'ia', 'Noticias y avances en IA, machine learning y deep learning'),
('Smartphones', 'smartphones', 'Últimas novedades en dispositivos móviles'),
('Desarrollo Web', 'desarrollo-web', 'Tendencias en desarrollo web, frameworks y tecnologías'),
('Startups', 'startups', 'Ecosistema de startups tecnológicas'),
('Ciberseguridad', 'ciberseguridad', 'Seguridad informática y computación cuántica');

-- Function to automatically set updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for posts updated_at
CREATE TRIGGER handle_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to create author profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.authors (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
