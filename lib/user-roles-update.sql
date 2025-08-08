-- Update user roles to include moderator
-- Add this to your existing Supabase database

-- Update the role check constraint to include moderator
ALTER TABLE public.authors DROP CONSTRAINT IF EXISTS authors_role_check;
ALTER TABLE public.authors ADD CONSTRAINT authors_role_check 
  CHECK (role IN ('admin', 'moderator', 'editor', 'user'));

-- Add featured posts functionality
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Add view count for posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add reading time estimate
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS reading_time INTEGER; -- in minutes

-- Create index for featured posts
CREATE INDEX IF NOT EXISTS idx_posts_featured ON public.posts(featured, featured_until);
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON public.posts(view_count DESC);

-- Function to update view count
CREATE OR REPLACE FUNCTION increment_post_views(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate reading time from content
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
  reading_time INTEGER;
BEGIN
  -- Count words (rough estimate)
  word_count := array_length(string_to_array(trim(content_text), ' '), 1);
  
  -- Calculate reading time (assuming 200 words per minute)
  reading_time := GREATEST(1, ROUND(word_count / 200.0));
  
  RETURN reading_time;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate reading time on post insert/update
CREATE OR REPLACE FUNCTION update_post_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_post_reading_time
  BEFORE INSERT OR UPDATE OF content ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_post_reading_time();

-- Create notifications table for future use
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('comment', 'reply', 'mention', 'post_published', 'post_featured')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT CHECK (entity_type IN ('post', 'comment', 'user')),
  entity_id UUID,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications 
  FOR UPDATE USING (user_id = auth.uid());

-- Create tags table for better tag management
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6B7280', -- Default gray color
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Junction table for post-tag relationships
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Indexes for tags
CREATE INDEX idx_tags_usage_count ON public.tags(usage_count DESC);
CREATE INDEX idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON public.post_tags(tag_id);

-- RLS policies for tags
CREATE POLICY "Anyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.authors 
    WHERE authors.id = auth.uid() AND authors.role IN ('admin', 'moderator')
  )
);

CREATE POLICY "Anyone can view post-tag relationships" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Authors can manage their post tags" ON public.post_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_id AND posts.author_id = auth.uid()
  )
);

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tags 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.tag_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tags 
    SET usage_count = GREATEST(0, usage_count - 1) 
    WHERE id = OLD.tag_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_trigger
  AFTER INSERT OR DELETE ON public.post_tags
  FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Insert some default tags
INSERT INTO public.tags (name, slug, description, color) VALUES
('Inteligencia Artificial', 'inteligencia-artificial', 'Artículos sobre IA y ML', '#8B5CF6'),
('Smartphones', 'smartphones', 'Novedades en dispositivos móviles', '#3B82F6'),
('Desarrollo Web', 'desarrollo-web', 'Programación y desarrollo web', '#10B981'),
('Startups', 'startups', 'Ecosistema emprendedor', '#F59E0B'),
('Ciberseguridad', 'ciberseguridad', 'Seguridad informática', '#EF4444'),
('Reviews', 'reviews', 'Análisis de productos', '#6366F1'),
('Tutoriales', 'tutoriales', 'Guías y tutoriales', '#8B5CF6'),
('Noticias', 'noticias', 'Últimas noticias tech', '#06B6D4')
ON CONFLICT (slug) DO NOTHING;
