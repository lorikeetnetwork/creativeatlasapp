
-- =============================================
-- PHASE 1: DATABASE FOUNDATION FOR COMMUNITY FEATURES
-- =============================================

-- 1. CREATE ENUMS
-- =============================================

CREATE TYPE public.event_type AS ENUM ('workshop', 'concert', 'exhibition', 'festival', 'conference', 'meetup', 'networking', 'other');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE public.opportunity_type AS ENUM ('job', 'gig', 'residency', 'grant', 'collaboration', 'volunteer', 'internship');
CREATE TYPE public.compensation_type AS ENUM ('paid', 'unpaid', 'honorarium', 'equity', 'negotiable');
CREATE TYPE public.experience_level AS ENUM ('entry', 'mid', 'senior', 'any');
CREATE TYPE public.opportunity_status AS ENUM ('open', 'closed', 'filled');
CREATE TYPE public.application_status AS ENUM ('submitted', 'reviewed', 'shortlisted', 'rejected', 'accepted');
CREATE TYPE public.discussion_category AS ENUM ('general', 'help', 'showcase', 'opportunities', 'events', 'introductions');
CREATE TYPE public.resource_type AS ENUM ('guide', 'template', 'tool', 'directory', 'tutorial');
CREATE TYPE public.mentorship_status AS ENUM ('open', 'matched', 'in_progress', 'completed', 'closed');
CREATE TYPE public.mentorship_match_status AS ENUM ('pending', 'accepted', 'declined', 'active', 'completed');
CREATE TYPE public.preferred_format AS ENUM ('virtual', 'in_person', 'either');

-- 2. EVENTS TABLE
-- =============================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  event_type public.event_type NOT NULL DEFAULT 'other',
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  is_online BOOLEAN DEFAULT false,
  online_url TEXT,
  ticket_url TEXT,
  ticket_price_min DECIMAL(10,2),
  ticket_price_max DECIMAL(10,2),
  is_free BOOLEAN DEFAULT true,
  category public.location_category,
  status public.event_status NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published events" ON public.events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = creator_id);

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 3. EVENT RSVPS TABLE
-- =============================================

CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'interested', 'not_going')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view RSVPs for published events" ON public.event_rsvps
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.events WHERE events.id = event_rsvps.event_id AND events.status = 'published'
  ));

CREATE POLICY "Users can manage their own RSVPs" ON public.event_rsvps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all RSVPs" ON public.event_rsvps
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. OPPORTUNITIES TABLE
-- =============================================

CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  opportunity_type public.opportunity_type NOT NULL,
  category public.location_category,
  compensation_type public.compensation_type NOT NULL DEFAULT 'negotiable',
  compensation_details TEXT,
  application_url TEXT,
  application_email TEXT,
  deadline DATE,
  start_date DATE,
  is_remote BOOLEAN DEFAULT false,
  location_text TEXT,
  experience_level public.experience_level DEFAULT 'any',
  status public.opportunity_status NOT NULL DEFAULT 'open',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view open opportunities" ON public.opportunities
  FOR SELECT USING (status = 'open');

CREATE POLICY "Posters can view their own opportunities" ON public.opportunities
  FOR SELECT USING (auth.uid() = poster_id);

CREATE POLICY "Posters can insert their own opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Posters can update their own opportunities" ON public.opportunities
  FOR UPDATE USING (auth.uid() = poster_id);

CREATE POLICY "Posters can delete their own opportunities" ON public.opportunities
  FOR DELETE USING (auth.uid() = poster_id);

CREATE POLICY "Admins can manage all opportunities" ON public.opportunities
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 5. OPPORTUNITY APPLICATIONS TABLE
-- =============================================

CREATE TABLE public.opportunity_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_message TEXT,
  resume_url TEXT,
  status public.application_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can view their own applications" ON public.opportunity_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Applicants can insert their own applications" ON public.opportunity_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Applicants can update their own applications" ON public.opportunity_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Posters can view applications for their opportunities" ON public.opportunity_applications
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.opportunities WHERE opportunities.id = opportunity_applications.opportunity_id AND opportunities.poster_id = auth.uid()
  ));

CREATE POLICY "Posters can update application status" ON public.opportunity_applications
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.opportunities WHERE opportunities.id = opportunity_applications.opportunity_id AND opportunities.poster_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all applications" ON public.opportunity_applications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 6. MEMBER PROFILES TABLE (extends profiles)
-- =============================================

CREATE TABLE public.member_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  tagline TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  primary_discipline public.location_category,
  skills TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  website TEXT,
  instagram TEXT,
  linkedin TEXT,
  other_social TEXT,
  suburb TEXT,
  state TEXT,
  is_available_for_hire BOOLEAN DEFAULT false,
  is_available_for_collaboration BOOLEAN DEFAULT false,
  is_mentor BOOLEAN DEFAULT false,
  experience_years INTEGER,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public member profiles" ON public.member_profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own member profile" ON public.member_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own member profile" ON public.member_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own member profile" ON public.member_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own member profile" ON public.member_profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all member profiles" ON public.member_profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 7. MEMBER PORTFOLIO ITEMS TABLE
-- =============================================

CREATE TABLE public.member_portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.member_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  project_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.member_portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view portfolio items for public profiles" ON public.member_portfolio_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.member_profiles WHERE member_profiles.id = member_portfolio_items.member_id AND member_profiles.is_public = true
  ));

CREATE POLICY "Owners can view their own portfolio items" ON public.member_portfolio_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.member_profiles WHERE member_profiles.id = member_portfolio_items.member_id AND member_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Owners can manage their own portfolio items" ON public.member_portfolio_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.member_profiles WHERE member_profiles.id = member_portfolio_items.member_id AND member_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all portfolio items" ON public.member_portfolio_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 8. DISCUSSIONS TABLE
-- =============================================

CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB DEFAULT '[]'::jsonb,
  category public.discussion_category NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all discussions" ON public.discussions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create discussions" ON public.discussions
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own discussions" ON public.discussions
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own discussions" ON public.discussions
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all discussions" ON public.discussions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 9. DISCUSSION REPLIES TABLE
-- =============================================

CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all replies" ON public.discussion_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON public.discussion_replies
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own replies" ON public.discussion_replies
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own replies" ON public.discussion_replies
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all replies" ON public.discussion_replies
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 10. DISCUSSION LIKES TABLE
-- =============================================

CREATE TABLE public.discussion_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.discussion_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT like_target CHECK (
    (discussion_id IS NOT NULL AND reply_id IS NULL) OR
    (discussion_id IS NULL AND reply_id IS NOT NULL)
  ),
  UNIQUE(user_id, discussion_id),
  UNIQUE(user_id, reply_id)
);

ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all likes" ON public.discussion_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like" ON public.discussion_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" ON public.discussion_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 11. RESOURCES TABLE
-- =============================================

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  cover_image_url TEXT,
  resource_type public.resource_type NOT NULL,
  category public.location_category,
  external_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  status public.article_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published resources" ON public.resources
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view their own resources" ON public.resources
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can insert their own resources" ON public.resources
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own resources" ON public.resources
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own resources" ON public.resources
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all resources" ON public.resources
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 12. RESOURCE TAGS JUNCTION TABLE
-- =============================================

CREATE TABLE public.resource_tags (
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view resource tags" ON public.resource_tags
  FOR SELECT USING (true);

CREATE POLICY "Authors can manage their resource tags" ON public.resource_tags
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.resources WHERE resources.id = resource_tags.resource_id AND resources.author_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all resource tags" ON public.resource_tags
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 13. SHOWCASES TABLE
-- =============================================

CREATE TABLE public.showcases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  project_url TEXT,
  video_url TEXT,
  collaborators TEXT,
  linked_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  category public.location_category,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.showcases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved showcases" ON public.showcases
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Submitters can view their own showcases" ON public.showcases
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Submitters can insert their own showcases" ON public.showcases
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Submitters can update their own showcases" ON public.showcases
  FOR UPDATE USING (auth.uid() = submitted_by);

CREATE POLICY "Submitters can delete their own showcases" ON public.showcases
  FOR DELETE USING (auth.uid() = submitted_by);

CREATE POLICY "Admins can manage all showcases" ON public.showcases
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 14. NEWSLETTER SUBSCRIBERS TABLE
-- =============================================

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  preferences JSONB DEFAULT '{"weekly_digest": true, "opportunities": true, "events": true}'::jsonb,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own subscription" ON public.newsletter_subscribers
  FOR UPDATE USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can unsubscribe" ON public.newsletter_subscribers
  FOR DELETE USING (auth.uid() = user_id OR email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all subscriptions" ON public.newsletter_subscribers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 15. MENTORSHIP REQUESTS TABLE
-- =============================================

CREATE TABLE public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES public.member_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  areas_seeking_help TEXT[] DEFAULT '{}',
  preferred_format public.preferred_format DEFAULT 'either',
  status public.mentorship_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view open requests" ON public.mentorship_requests
  FOR SELECT USING (status = 'open');

CREATE POLICY "Requesters can view their own requests" ON public.mentorship_requests
  FOR SELECT USING (auth.uid() = requester_id);

CREATE POLICY "Requesters can insert their own requests" ON public.mentorship_requests
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters can update their own requests" ON public.mentorship_requests
  FOR UPDATE USING (auth.uid() = requester_id);

CREATE POLICY "Requesters can delete their own requests" ON public.mentorship_requests
  FOR DELETE USING (auth.uid() = requester_id);

CREATE POLICY "Mentors can view requests directed to them" ON public.mentorship_requests
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.member_profiles WHERE member_profiles.id = mentorship_requests.mentor_id AND member_profiles.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all requests" ON public.mentorship_requests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 16. MENTORSHIP MATCHES TABLE
-- =============================================

CREATE TABLE public.mentorship_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.mentorship_requests(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.mentorship_match_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentorship_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view their matches" ON public.mentorship_matches
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentors can create matches" ON public.mentorship_matches
  FOR INSERT WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Participants can update their matches" ON public.mentorship_matches
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Admins can manage all matches" ON public.mentorship_matches
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 17. STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('opportunity-attachments', 'opportunity-attachments', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('member-portfolios', 'member-portfolios', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resource-files', 'resource-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('showcase-images', 'showcase-images', true);

-- 18. STORAGE POLICIES
-- =============================================

-- Event images: public read, authenticated upload
CREATE POLICY "Public can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own event images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own event images" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Opportunity attachments: private, only poster and applicant can access
CREATE POLICY "Users can view their own attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'opportunity-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'opportunity-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments" ON storage.objects
  FOR DELETE USING (bucket_id = 'opportunity-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Member portfolios: public read, owner upload
CREATE POLICY "Public can view portfolio images" ON storage.objects
  FOR SELECT USING (bucket_id = 'member-portfolios');

CREATE POLICY "Users can upload their portfolio images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'member-portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their portfolio images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'member-portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their portfolio images" ON storage.objects
  FOR DELETE USING (bucket_id = 'member-portfolios' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Resource files: public read, admins/authors can upload
CREATE POLICY "Public can view resource files" ON storage.objects
  FOR SELECT USING (bucket_id = 'resource-files');

CREATE POLICY "Authenticated users can upload resource files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'resource-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their resource files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their resource files" ON storage.objects
  FOR DELETE USING (bucket_id = 'resource-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Showcase images: public read, authenticated upload
CREATE POLICY "Public can view showcase images" ON storage.objects
  FOR SELECT USING (bucket_id = 'showcase-images');

CREATE POLICY "Authenticated users can upload showcase images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'showcase-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their showcase images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'showcase-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their showcase images" ON storage.objects
  FOR DELETE USING (bucket_id = 'showcase-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 19. TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunity_applications_updated_at
  BEFORE UPDATE ON public.opportunity_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_profiles_updated_at
  BEFORE UPDATE ON public.member_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at
  BEFORE UPDATE ON public.discussions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at
  BEFORE UPDATE ON public.discussion_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_requests_updated_at
  BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_matches_updated_at
  BEFORE UPDATE ON public.mentorship_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 20. INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_creator_id ON public.events(creator_id);

CREATE INDEX idx_opportunities_status ON public.opportunities(status);
CREATE INDEX idx_opportunities_type ON public.opportunities(opportunity_type);
CREATE INDEX idx_opportunities_category ON public.opportunities(category);
CREATE INDEX idx_opportunities_poster_id ON public.opportunities(poster_id);
CREATE INDEX idx_opportunities_deadline ON public.opportunities(deadline);

CREATE INDEX idx_member_profiles_user_id ON public.member_profiles(user_id);
CREATE INDEX idx_member_profiles_is_public ON public.member_profiles(is_public);
CREATE INDEX idx_member_profiles_discipline ON public.member_profiles(primary_discipline);

CREATE INDEX idx_discussions_category ON public.discussions(category);
CREATE INDEX idx_discussions_author_id ON public.discussions(author_id);
CREATE INDEX idx_discussions_last_activity ON public.discussions(last_activity_at DESC);

CREATE INDEX idx_discussion_replies_discussion_id ON public.discussion_replies(discussion_id);

CREATE INDEX idx_resources_status ON public.resources(status);
CREATE INDEX idx_resources_type ON public.resources(resource_type);

CREATE INDEX idx_showcases_is_approved ON public.showcases(is_approved);
CREATE INDEX idx_showcases_category ON public.showcases(category);

CREATE INDEX idx_mentorship_requests_status ON public.mentorship_requests(status);
