-- Comments system for blog posts
-- Add this to your existing Supabase setup

-- Comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For threaded comments
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  author_name TEXT, -- For guest comments (if author_id is null)
  author_email TEXT, -- For guest comments
  author_website TEXT, -- Optional for guest comments
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure either authenticated user or guest info
  CONSTRAINT check_author_or_guest CHECK (
    (author_id IS NOT NULL) OR 
    (author_name IS NOT NULL AND author_email IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_status ON public.comments(status);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Comment votes/reactions table
CREATE TABLE public.comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike', 'love', 'laugh', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(comment_id, user_id) -- One reaction per user per comment
);

ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;

-- Comment reports table for moderation
CREATE TABLE public.comment_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'inappropriate', 'off-topic', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  reviewed_by UUID REFERENCES public.authors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(comment_id, reporter_id) -- One report per user per comment
);

ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Comments
CREATE POLICY "Anyone can view approved comments" ON public.comments 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Comment authors can view their own comments" ON public.comments 
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Moderators can view all comments" ON public.comments 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.authors 
      WHERE authors.id = auth.uid() 
      AND authors.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Authenticated users can insert comments" ON public.comments 
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    (author_id = auth.uid() OR author_id IS NULL)
  );

CREATE POLICY "Comment authors can update their own comments" ON public.comments 
  FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Moderators can update any comment" ON public.comments 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.authors 
      WHERE authors.id = auth.uid() 
      AND authors.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Moderators can delete any comment" ON public.comments 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.authors 
      WHERE authors.id = auth.uid() 
      AND authors.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for Comment Reactions
CREATE POLICY "Anyone can view comment reactions" ON public.comment_reactions 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage their reactions" ON public.comment_reactions 
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for Comment Reports
CREATE POLICY "Reporters can view their own reports" ON public.comment_reports 
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Moderators can view all reports" ON public.comment_reports 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.authors 
      WHERE authors.id = auth.uid() 
      AND authors.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Authenticated users can create reports" ON public.comment_reports 
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Moderators can update reports" ON public.comment_reports 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.authors 
      WHERE authors.id = auth.uid() 
      AND authors.role IN ('admin', 'moderator')
    )
  );

-- Trigger for comments updated_at
CREATE TRIGGER handle_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Function to get comment counts for posts
CREATE OR REPLACE FUNCTION get_comment_count(post_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM public.comments 
    WHERE post_id = post_uuid AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get comment thread (with replies)
CREATE OR REPLACE FUNCTION get_comment_thread(comment_uuid UUID)
RETURNS TABLE(
  id UUID,
  content TEXT,
  author_name TEXT,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  level INTEGER
) AS $$
WITH RECURSIVE comment_tree AS (
  -- Base case: the root comment
  SELECT 
    c.id,
    c.content,
    COALESCE(a.full_name, c.author_name) as author_name,
    a.avatar_url as author_avatar,
    c.created_at,
    0 as level
  FROM public.comments c
  LEFT JOIN public.authors a ON c.author_id = a.id
  WHERE c.id = comment_uuid AND c.status = 'approved'
  
  UNION ALL
  
  -- Recursive case: replies to comments in the tree
  SELECT 
    c.id,
    c.content,
    COALESCE(a.full_name, c.author_name) as author_name,
    a.avatar_url as author_avatar,
    c.created_at,
    ct.level + 1
  FROM public.comments c
  LEFT JOIN public.authors a ON c.author_id = a.id
  INNER JOIN comment_tree ct ON c.parent_id = ct.id
  WHERE c.status = 'approved'
)
SELECT * FROM comment_tree ORDER BY level, created_at;
$$ LANGUAGE SQL SECURITY DEFINER;
