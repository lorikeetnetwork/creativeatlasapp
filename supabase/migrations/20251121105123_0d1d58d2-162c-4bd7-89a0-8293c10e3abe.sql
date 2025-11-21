-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('public', 'owner', 'admin');

-- Create enum for location categories
CREATE TYPE public.location_category AS ENUM (
  'Venue',
  'Studio',
  'Festival',
  'Label',
  'Management',
  'Services',
  'Education',
  'Government/Peak Body',
  'Community Organisation',
  'Co-working/Creative Hub',
  'Gallery/Arts Space',
  'Other'
);

-- Create enum for location status
CREATE TYPE public.location_status AS ENUM ('Pending', 'Active', 'Rejected', 'Inactive', 'PendingPayment');

-- Create enum for location source
CREATE TYPE public.location_source AS ENUM ('UserSubmitted', 'AdminImported', 'AdminCreated');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category location_category NOT NULL,
  subcategory TEXT,
  description TEXT,
  address TEXT NOT NULL,
  suburb TEXT NOT NULL,
  state TEXT NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Australia',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  website TEXT,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  other_social TEXT,
  capacity INTEGER,
  best_for TEXT,
  accessibility_notes TEXT,
  status location_status NOT NULL DEFAULT 'Pending',
  source location_source NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ
);

-- Enable RLS on locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Locations policies
CREATE POLICY "Public can view active locations"
  ON public.locations FOR SELECT
  USING (status = 'Active');

CREATE POLICY "Owners can view their own locations"
  ON public.locations FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Owners can insert their own locations"
  ON public.locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Owners can update their own locations"
  ON public.locations FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Admins can view all locations"
  ON public.locations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert locations"
  ON public.locations FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all locations"
  ON public.locations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete locations"
  ON public.locations FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_locations_status ON public.locations(status);
CREATE INDEX idx_locations_category ON public.locations(category);
CREATE INDEX idx_locations_owner ON public.locations(owner_user_id);
CREATE INDEX idx_locations_coords ON public.locations(latitude, longitude);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  -- Assign default 'owner' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'owner');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert seed data for Gold Coast / Northern Rivers region
INSERT INTO public.locations (
  name, category, subcategory, description, address, suburb, state, postcode,
  latitude, longitude, website, capacity, best_for, status, source
) VALUES
  (
    'Miami Marketta',
    'Venue',
    '300-500 cap venue',
    'Vibrant outdoor venue with multiple stages, food trucks, and bars. Known for eclectic live music, markets, and community events.',
    '23 Hillcrest Parade',
    'Miami',
    'QLD',
    '4220',
    -28.0714,
    153.4345,
    'https://miamimarketta.com',
    400,
    'Local bands, touring artists, festivals',
    'Active',
    'AdminImported'
  ),
  (
    'The Northern',
    'Venue',
    '150-300 cap venue',
    'Historic Byron Bay venue hosting live music, comedy, and DJ nights. Iconic spot for both local and touring acts.',
    '84 Jonson Street',
    'Byron Bay',
    'NSW',
    '2481',
    -28.6436,
    153.6115,
    'https://thenorthern.com.au',
    250,
    'Touring artists, local bands',
    'Active',
    'AdminImported'
  ),
  (
    'The Triffid',
    'Venue',
    '500-2000 cap venue',
    'Brisbane''s premier live music venue featuring national and international touring acts across multiple genres.',
    '7-9 Stratton Street',
    'Newstead',
    'QLD',
    '4006',
    -27.4492,
    153.0442,
    'https://thetriffid.com.au',
    800,
    'Touring artists, album launches',
    'Active',
    'AdminImported'
  ),
  (
    'Sonic Studios',
    'Studio',
    'Recording studio',
    'Professional recording, mixing, and mastering facility. Experienced engineers and top-tier equipment.',
    '15 Innovation Drive',
    'Burleigh Heads',
    'QLD',
    '4220',
    -28.0892,
    153.4507,
    'https://sonicstudios.com.au',
    NULL,
    'Recording artists, podcasters',
    'Active',
    'AdminImported'
  ),
  (
    'Gold Coast Music Festival',
    'Festival',
    'Annual music festival',
    'Three-day celebration of Australian music featuring local and national acts across multiple stages.',
    'Marine Parade',
    'Coolangatta',
    'QLD',
    '4225',
    -28.1676,
    153.5397,
    'https://gcmusicfest.com.au',
    5000,
    'Festival-goers, music lovers',
    'Active',
    'AdminImported'
  ),
  (
    'Creative Gold Coast',
    'Government/Peak Body',
    'Arts organization',
    'Supporting creative industries on the Gold Coast through programs, funding, and advocacy.',
    '135 Bundall Road',
    'Surfers Paradise',
    'QLD',
    '4217',
    -28.0024,
    153.4279,
    'https://creativegc.com.au',
    NULL,
    'Artists, creative businesses',
    'Active',
    'AdminImported'
  ),
  (
    'Byron Bay Community Centre',
    'Community Organisation',
    'Community arts hub',
    'Multi-purpose venue hosting workshops, exhibitions, performances, and community gatherings.',
    '69 Jonson Street',
    'Byron Bay',
    'NSW',
    '2481',
    -28.6431,
    153.6108,
    'https://byroncentre.com.au',
    150,
    'Community, workshops, local artists',
    'Active',
    'AdminImported'
  ),
  (
    'The Basement',
    'Venue',
    'Under 150 cap venue',
    'Intimate underground venue perfect for emerging artists and acoustic performances.',
    '47 Thomas Drive',
    'Chevron Island',
    'QLD',
    '4217',
    -28.0104,
    153.4196,
    NULL,
    80,
    'Emerging artists, acoustic shows',
    'Active',
    'AdminImported'
  );
