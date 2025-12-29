-- User's favorite locations (quick favorites)
CREATE TABLE public.user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Named collections of favorites (lists)
CREATE TABLE public.favorite_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Junction table for list membership
CREATE TABLE public.favorite_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES public.favorite_lists(id) ON DELETE CASCADE NOT NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(list_id, location_id)
);

-- User map preferences
CREATE TABLE public.user_map_preferences (
  user_id uuid PRIMARY KEY NOT NULL,
  map_style text DEFAULT 'dark',
  marker_color_mode text DEFAULT 'category',
  show_favorites_only boolean DEFAULT false,
  default_zoom integer DEFAULT 8,
  default_center_lat double precision,
  default_center_lng double precision,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_map_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites"
ON public.user_favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.user_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.user_favorites FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for favorite_lists
CREATE POLICY "Users can view their own lists"
ON public.favorite_lists FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lists"
ON public.favorite_lists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
ON public.favorite_lists FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
ON public.favorite_lists FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for favorite_list_items
CREATE POLICY "Users can view their own list items"
ON public.favorite_list_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.favorite_lists
  WHERE favorite_lists.id = favorite_list_items.list_id
  AND favorite_lists.user_id = auth.uid()
));

CREATE POLICY "Users can insert items to their own lists"
ON public.favorite_list_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.favorite_lists
  WHERE favorite_lists.id = favorite_list_items.list_id
  AND favorite_lists.user_id = auth.uid()
));

CREATE POLICY "Users can delete items from their own lists"
ON public.favorite_list_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.favorite_lists
  WHERE favorite_lists.id = favorite_list_items.list_id
  AND favorite_lists.user_id = auth.uid()
));

-- RLS Policies for user_map_preferences
CREATE POLICY "Users can view their own map preferences"
ON public.user_map_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own map preferences"
ON public.user_map_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own map preferences"
ON public.user_map_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_location_id ON public.user_favorites(location_id);
CREATE INDEX idx_favorite_lists_user_id ON public.favorite_lists(user_id);
CREATE INDEX idx_favorite_list_items_list_id ON public.favorite_list_items(list_id);
CREATE INDEX idx_favorite_list_items_location_id ON public.favorite_list_items(location_id);

-- Trigger for updating updated_at on favorite_lists
CREATE TRIGGER update_favorite_lists_updated_at
BEFORE UPDATE ON public.favorite_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updating updated_at on user_map_preferences
CREATE TRIGGER update_user_map_preferences_updated_at
BEFORE UPDATE ON public.user_map_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();