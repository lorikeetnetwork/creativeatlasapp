-- Create article status type
DO $$ BEGIN
    CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create article type enum
DO $$ BEGIN
    CREATE TYPE article_type AS ENUM ('article', 'update', 'announcement', 'event');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create articles table
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    linked_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content JSONB DEFAULT '[]'::jsonb,
    cover_image_url TEXT,
    status article_status NOT NULL DEFAULT 'draft',
    article_type article_type NOT NULL DEFAULT 'article',
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    read_time_minutes INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create article_tags junction table
CREATE TABLE public.article_tags (
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Create article_likes table
CREATE TABLE public.article_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (article_id, user_id)
);

-- Create article_comments table
CREATE TABLE public.article_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Articles RLS Policies
CREATE POLICY "Public can view published articles" 
ON public.articles FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authors can view their own articles" 
ON public.articles FOR SELECT 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert their own articles" 
ON public.articles FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own articles" 
ON public.articles FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own articles" 
ON public.articles FOR DELETE 
USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all articles" 
ON public.articles FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Tags RLS Policies (public read, admin manage)
CREATE POLICY "Anyone can view tags" 
ON public.tags FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage tags" 
ON public.tags FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can create tags" 
ON public.tags FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Article Tags RLS Policies
CREATE POLICY "Anyone can view article tags" 
ON public.article_tags FOR SELECT 
USING (true);

CREATE POLICY "Authors can manage their article tags" 
ON public.article_tags FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.articles 
        WHERE articles.id = article_tags.article_id 
        AND articles.author_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all article tags" 
ON public.article_tags FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Article Likes RLS Policies
CREATE POLICY "Anyone can view likes" 
ON public.article_likes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like articles" 
ON public.article_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
ON public.article_likes FOR DELETE 
USING (auth.uid() = user_id);

-- Article Comments RLS Policies
CREATE POLICY "Anyone can view comments on published articles" 
ON public.article_comments FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.articles 
        WHERE articles.id = article_comments.article_id 
        AND articles.status = 'published'
    )
);

CREATE POLICY "Authenticated users can comment" 
ON public.article_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.article_comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.article_comments FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" 
ON public.article_comments FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger for articles
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for comments
CREATE TRIGGER update_article_comments_updated_at
    BEFORE UPDATE ON public.article_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create article-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true);

-- Storage policies for article-images
CREATE POLICY "Anyone can view article images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'article-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own article images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own article images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'article-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert some default tags
INSERT INTO public.tags (name, slug) VALUES
    ('Music Industry', 'music-industry'),
    ('Tech for Good', 'tech-for-good'),
    ('Events', 'events'),
    ('Community', 'community'),
    ('Tutorials', 'tutorials'),
    ('News', 'news'),
    ('Interviews', 'interviews'),
    ('Resources', 'resources')
ON CONFLICT (slug) DO NOTHING;