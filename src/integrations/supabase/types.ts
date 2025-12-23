export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      business_offerings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_featured: boolean | null
          location_id: string
          price_range: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          location_id: string
          price_range?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          location_id?: string
          price_range?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_offerings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          about: string | null
          awards_recognition: string[] | null
          business_hours: Json | null
          created_at: string | null
          current_project_description: string | null
          current_project_end_date: string | null
          current_project_image_url: string | null
          current_project_start_date: string | null
          current_project_status: string | null
          current_project_title: string | null
          founded_year: number | null
          id: string
          last_updated: string | null
          location_id: string
          profile_views: number | null
          specialties: string[] | null
          tagline: string | null
          team_size: string | null
        }
        Insert: {
          about?: string | null
          awards_recognition?: string[] | null
          business_hours?: Json | null
          created_at?: string | null
          current_project_description?: string | null
          current_project_end_date?: string | null
          current_project_image_url?: string | null
          current_project_start_date?: string | null
          current_project_status?: string | null
          current_project_title?: string | null
          founded_year?: number | null
          id?: string
          last_updated?: string | null
          location_id: string
          profile_views?: number | null
          specialties?: string[] | null
          tagline?: string | null
          team_size?: string | null
        }
        Update: {
          about?: string | null
          awards_recognition?: string[] | null
          business_hours?: Json | null
          created_at?: string | null
          current_project_description?: string | null
          current_project_end_date?: string | null
          current_project_image_url?: string | null
          current_project_start_date?: string | null
          current_project_status?: string | null
          current_project_title?: string | null
          founded_year?: number | null
          id?: string
          last_updated?: string | null
          location_id?: string
          profile_views?: number | null
          specialties?: string[] | null
          tagline?: string | null
          team_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_videos: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          location_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_platform: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          location_id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_platform?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          location_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_platform?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_videos_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_form_submissions: {
        Row: {
          created_at: string | null
          id: string
          inquiry_type: string | null
          location_id: string
          message: string
          read_at: string | null
          replied_at: string | null
          sender_email: string
          sender_name: string
          sender_phone: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inquiry_type?: string | null
          location_id: string
          message: string
          read_at?: string | null
          replied_at?: string | null
          sender_email: string
          sender_name: string
          sender_phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inquiry_type?: string | null
          location_id?: string
          message?: string
          read_at?: string | null
          replied_at?: string | null
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_form_submissions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          location_id: string
          photo_url: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          location_id: string
          photo_url: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          location_id?: string
          photo_url?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_photos_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          accessibility_notes: string | null
          address: string
          best_for: string | null
          capacity: number | null
          category: Database["public"]["Enums"]["location_category"]
          country: string
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          last_verified_at: string | null
          latitude: number
          logo_url: string | null
          longitude: number
          name: string
          og_description: string | null
          og_image_url: string | null
          other_social: string | null
          owner_user_id: string | null
          phone: string | null
          postcode: string
          source: Database["public"]["Enums"]["location_source"]
          state: string
          status: Database["public"]["Enums"]["location_status"]
          subcategory: string | null
          suburb: string
          updated_at: string
          website: string | null
        }
        Insert: {
          accessibility_notes?: string | null
          address: string
          best_for?: string | null
          capacity?: number | null
          category: Database["public"]["Enums"]["location_category"]
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_verified_at?: string | null
          latitude: number
          logo_url?: string | null
          longitude: number
          name: string
          og_description?: string | null
          og_image_url?: string | null
          other_social?: string | null
          owner_user_id?: string | null
          phone?: string | null
          postcode: string
          source: Database["public"]["Enums"]["location_source"]
          state: string
          status?: Database["public"]["Enums"]["location_status"]
          subcategory?: string | null
          suburb: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          accessibility_notes?: string | null
          address?: string
          best_for?: string | null
          capacity?: number | null
          category?: Database["public"]["Enums"]["location_category"]
          country?: string
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          last_verified_at?: string | null
          latitude?: number
          logo_url?: string | null
          longitude?: number
          name?: string
          og_description?: string | null
          og_image_url?: string | null
          other_social?: string | null
          owner_user_id?: string | null
          phone?: string | null
          postcode?: string
          source?: Database["public"]["Enums"]["location_source"]
          state?: string
          status?: Database["public"]["Enums"]["location_status"]
          subcategory?: string | null
          suburb?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          account_type_granted:
            | Database["public"]["Enums"]["account_type"]
            | null
          amount: number
          created_at: string
          currency: string
          id: string
          location_id: string | null
          payment_type: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type_granted?:
            | Database["public"]["Enums"]["account_type"]
            | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          location_id?: string | null
          payment_type?: string | null
          status: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type_granted?:
            | Database["public"]["Enums"]["account_type"]
            | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          location_id?: string | null
          payment_type?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          payment_date: string | null
          payment_verified: boolean | null
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          payment_date?: string | null
          payment_verified?: boolean | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          payment_date?: string | null
          payment_verified?: boolean | null
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      account_type: "free" | "basic_paid" | "creative_entity"
      app_role: "public" | "owner" | "admin"
      location_category:
        | "Venue"
        | "Studio"
        | "Festival"
        | "Label"
        | "Management"
        | "Services"
        | "Education"
        | "Government/Peak Body"
        | "Community Organisation"
        | "Co-working/Creative Hub"
        | "Gallery/Arts Space"
        | "Other"
        | "Record Labels"
        | "Music Venues"
        | "Festivals & Live Event Organisers"
        | "Artist Management Agencies"
        | "Booking Agencies"
        | "Music Publishers"
        | "Recording Studios"
        | "Rehearsal Studios"
        | "Post-Production Studios"
        | "Production Companies"
        | "Independent Artists & Bands"
        | "DJs & Electronic Producers"
        | "Audio Engineers & Mix/Mastering Services"
        | "Music Technology Startups"
        | "Creative Technology Labs"
        | "Digital Media Agencies"
        | "Web3 / Blockchain Creative Platforms"
        | "Film & TV Production Companies"
        | "Art Galleries"
        | "Artist-Run Initiatives"
        | "Cultural Centres"
        | "Creative Hubs & Coworking Spaces"
        | "Community Arts Organisations"
        | "Theatre Companies"
        | "Dance Companies"
        | "Design Studios"
        | "Animation & Motion Studios"
        | "Game Development Studios"
        | "XR/AR/VR Studios"
        | "Immersive Media Creators"
        | "Content Creators & Creative Influencers"
        | "Photography Studios"
        | "Videography Studios"
        | "Event Production & Technical Services"
        | "Lighting, Sound & Staging Companies"
        | "Event Ticketing Platforms"
        | "Publicists & PR Agencies"
        | "Marketing & Creative Communications Agencies"
        | "Cultural Festivals"
        | "Education & Training Providers"
        | "Talent Development Programs & Residencies"
        | "Creative Marketplaces & Digital Platforms"
        | "Creative Tools & Software Providers"
        | "Podcast Studios & Networks"
        | "Cultural Research & Policy Organisations"
        | "Artist Services & Freelance Creative Providers"
        | "Community Radio Stations"
        | "Music Retailers & Instrument Stores"
        | "Arts Foundations & Funders"
        | "Music Distributors"
        | "Sync Licensing Agencies"
        | "Music Supervisors"
        | "Composer Services"
        | "Audio Sample Library Companies"
        | "Music Data & Analytics Platforms"
        | "Music Education Platforms & Tutors"
        | "Instrument Makers & Luthiers"
        | "Audio Hardware Manufacturers"
        | "Micro-labels"
        | "Artist Collectives & Creative Co-ops"
        | "Streetwear & Creative Fashion Brands"
        | "Creative Fabrication Workshops"
        | "Makerspaces & Fab Labs"
        | "Cultural Heritage Organisations"
        | "Museums & Exhibition Spaces"
        | "Public Art Producers"
        | "Festival Infrastructure Suppliers"
        | "Backline Hire Companies"
        | "Touring & Logistics Companies"
        | "Set Designers & Scenic Fabricators"
        | "Prop & Costume Workshops"
        | "Creative Industrial Designers"
        | "Sound Art & Experimental Media Groups"
        | "Lighting Designers & Visual Effects Artists"
        | "Projection Mapping Studios"
        | "Generative Art Studios"
        | "AI Creative Production Studios"
        | "AI Music Generation Platforms"
        | "Live Streaming Production Studios"
        | "Hybrid Events & Virtual Venue Platforms"
        | "Content Syndication Networks"
        | "Creative Print Shops"
        | "Zine Publishers & Micro-presses"
        | "Art Supply Retailers"
        | "Craft & Artisan Studios"
        | "Creative Retreats & Residency Spaces"
        | "Interdisciplinary Art–Tech Labs"
        | "Civic & Urban Creative Placemaking Organisations"
        | "Regional Creative Networks"
        | "Cultural Tourism Operators"
        | "Indigenous Art Centres"
        | "Dance Schools & Academies"
        | "Storytelling & Narrative Design Studios"
        | "Creative Workshops & Education Providers"
        | "Professional Guilds & Industry Associations"
        | "Creative Funding Consultants"
        | "Cultural Strategy Consultancies"
        | "Creative Incubators & Accelerators"
        | "Creative Social Enterprises"
        | "Independent Media Outlets"
        | "Community Makers Markets"
        | "Fashion & Textile Studios"
        | "Illustrators & Concept Artists"
        | "Model & Talent Casting Agencies"
        | "Voiceover Studios"
        | "Location Scouts & Production Support"
        | "NFT Art Platforms"
        | "Metaverse Experience Builders"
        | "Digital Collectible Creators"
        | "Online Creative Marketplaces"
        | "Crowdfunding Platforms for Creators"
        | "Creative Coworking/Hotdesk Spaces"
        | "Wearable Tech Creators"
        | "Immersive Theatre Companies"
        | "Open Studios & Artist Exchanges"
        | "Venue Discovery Platforms"
        | "Artist Portfolio Platforms"
        | "Music Monetisation Platforms"
        | "Creative Data & Metadata Services"
        | "Archival & Digitisation Services"
        | "Cultural Mapping Organisations"
        | "Public Music Programs & Youth Music Foundations"
        | "Software Development Studios"
        | "Full-Stack Development Agencies"
        | "Frontend/Backend Developers"
        | "App Development Studios"
        | "Web Development Agencies"
        | "Custom Platform Builders"
        | "SaaS Creators"
        | "Creative Technology Agencies"
        | "AI Research & Development Labs"
        | "AI-Driven Creative Studios"
        | "AI Video/Audio Generation Platforms"
        | "Machine Learning Engineers"
        | "Data Science & Analytics Firms"
        | "Data Engineering Services"
        | "Digital Signal Processing Companies"
        | "Audio AI Companies"
        | "Music Recommendation Engines"
        | "Audio Plugin Developers"
        | "DAW Developers"
        | "Creative Tools & Productivity Software Makers"
        | "Immersive Technology Labs"
        | "3D Modelling & Simulation Studios"
        | "Virtual Production Studios"
        | "Realtime Engine Specialists"
        | "Game Audio & Interactive Sound Designers"
        | "Interactive Media Designers"
        | "Smart Contract Developers"
        | "Motion Capture Studios"
        | "Creative Robotics Labs"
        | "IoT & Wearable Tech Designers"
        | "Haptics & Sensory Experience Companies"
        | "Streaming Technology Platforms"
        | "Cloud Media Infrastructure Providers"
        | "Cybersecurity for Creative Industries"
        | "DevOps & Cloud Engineering Services"
        | "API Providers & Developer Platforms"
        | "Audio Infrastructure Platforms"
        | "Video Encoding & Live-stream Tech"
        | "Creative Automation Platforms"
        | "DRM & Rights Management Services"
        | "Asset Management & Metadata Software"
        | "Digital Preservation Technology"
        | "E-commerce Platforms for Creators"
        | "Multi-vendor Marketplace Platforms"
        | "White-label Ticketing Providers"
        | "Event Technology & RFID/NFC Systems"
        | "Spatial Audio Technology Companies"
        | "Embedded Systems for Art & Music"
        | "3D Printing & Fabrication Tech Studios"
        | "Digital Fabrication Labs"
        | "Creative Coding Studios"
        | "Interactive Installation Technologists"
        | "Projection Mapping Tech Providers"
        | "Lighting Control System Developers"
        | "Show Control & Live Event Software"
        | "Music Industry"
        | "Audio, Production & Post-Production"
        | "Visual Arts, Design & Craft"
        | "Culture, Heritage & Community"
        | "Events, Festivals & Live Performance"
        | "Media, Content & Communications"
        | "Education, Training & Professional Development"
        | "Workspaces, Fabrication & Creative Infrastructure"
        | "Creative Technology & Emerging Media"
        | "Software, Development & Digital Platforms"
        | "Media Infrastructure & Cloud Technology"
        | "Business, Logistics & Support Services"
      location_source: "UserSubmitted" | "AdminImported" | "AdminCreated"
      location_status:
        | "Pending"
        | "Active"
        | "Rejected"
        | "Inactive"
        | "PendingPayment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["free", "basic_paid", "creative_entity"],
      app_role: ["public", "owner", "admin"],
      location_category: [
        "Venue",
        "Studio",
        "Festival",
        "Label",
        "Management",
        "Services",
        "Education",
        "Government/Peak Body",
        "Community Organisation",
        "Co-working/Creative Hub",
        "Gallery/Arts Space",
        "Other",
        "Record Labels",
        "Music Venues",
        "Festivals & Live Event Organisers",
        "Artist Management Agencies",
        "Booking Agencies",
        "Music Publishers",
        "Recording Studios",
        "Rehearsal Studios",
        "Post-Production Studios",
        "Production Companies",
        "Independent Artists & Bands",
        "DJs & Electronic Producers",
        "Audio Engineers & Mix/Mastering Services",
        "Music Technology Startups",
        "Creative Technology Labs",
        "Digital Media Agencies",
        "Web3 / Blockchain Creative Platforms",
        "Film & TV Production Companies",
        "Art Galleries",
        "Artist-Run Initiatives",
        "Cultural Centres",
        "Creative Hubs & Coworking Spaces",
        "Community Arts Organisations",
        "Theatre Companies",
        "Dance Companies",
        "Design Studios",
        "Animation & Motion Studios",
        "Game Development Studios",
        "XR/AR/VR Studios",
        "Immersive Media Creators",
        "Content Creators & Creative Influencers",
        "Photography Studios",
        "Videography Studios",
        "Event Production & Technical Services",
        "Lighting, Sound & Staging Companies",
        "Event Ticketing Platforms",
        "Publicists & PR Agencies",
        "Marketing & Creative Communications Agencies",
        "Cultural Festivals",
        "Education & Training Providers",
        "Talent Development Programs & Residencies",
        "Creative Marketplaces & Digital Platforms",
        "Creative Tools & Software Providers",
        "Podcast Studios & Networks",
        "Cultural Research & Policy Organisations",
        "Artist Services & Freelance Creative Providers",
        "Community Radio Stations",
        "Music Retailers & Instrument Stores",
        "Arts Foundations & Funders",
        "Music Distributors",
        "Sync Licensing Agencies",
        "Music Supervisors",
        "Composer Services",
        "Audio Sample Library Companies",
        "Music Data & Analytics Platforms",
        "Music Education Platforms & Tutors",
        "Instrument Makers & Luthiers",
        "Audio Hardware Manufacturers",
        "Micro-labels",
        "Artist Collectives & Creative Co-ops",
        "Streetwear & Creative Fashion Brands",
        "Creative Fabrication Workshops",
        "Makerspaces & Fab Labs",
        "Cultural Heritage Organisations",
        "Museums & Exhibition Spaces",
        "Public Art Producers",
        "Festival Infrastructure Suppliers",
        "Backline Hire Companies",
        "Touring & Logistics Companies",
        "Set Designers & Scenic Fabricators",
        "Prop & Costume Workshops",
        "Creative Industrial Designers",
        "Sound Art & Experimental Media Groups",
        "Lighting Designers & Visual Effects Artists",
        "Projection Mapping Studios",
        "Generative Art Studios",
        "AI Creative Production Studios",
        "AI Music Generation Platforms",
        "Live Streaming Production Studios",
        "Hybrid Events & Virtual Venue Platforms",
        "Content Syndication Networks",
        "Creative Print Shops",
        "Zine Publishers & Micro-presses",
        "Art Supply Retailers",
        "Craft & Artisan Studios",
        "Creative Retreats & Residency Spaces",
        "Interdisciplinary Art–Tech Labs",
        "Civic & Urban Creative Placemaking Organisations",
        "Regional Creative Networks",
        "Cultural Tourism Operators",
        "Indigenous Art Centres",
        "Dance Schools & Academies",
        "Storytelling & Narrative Design Studios",
        "Creative Workshops & Education Providers",
        "Professional Guilds & Industry Associations",
        "Creative Funding Consultants",
        "Cultural Strategy Consultancies",
        "Creative Incubators & Accelerators",
        "Creative Social Enterprises",
        "Independent Media Outlets",
        "Community Makers Markets",
        "Fashion & Textile Studios",
        "Illustrators & Concept Artists",
        "Model & Talent Casting Agencies",
        "Voiceover Studios",
        "Location Scouts & Production Support",
        "NFT Art Platforms",
        "Metaverse Experience Builders",
        "Digital Collectible Creators",
        "Online Creative Marketplaces",
        "Crowdfunding Platforms for Creators",
        "Creative Coworking/Hotdesk Spaces",
        "Wearable Tech Creators",
        "Immersive Theatre Companies",
        "Open Studios & Artist Exchanges",
        "Venue Discovery Platforms",
        "Artist Portfolio Platforms",
        "Music Monetisation Platforms",
        "Creative Data & Metadata Services",
        "Archival & Digitisation Services",
        "Cultural Mapping Organisations",
        "Public Music Programs & Youth Music Foundations",
        "Software Development Studios",
        "Full-Stack Development Agencies",
        "Frontend/Backend Developers",
        "App Development Studios",
        "Web Development Agencies",
        "Custom Platform Builders",
        "SaaS Creators",
        "Creative Technology Agencies",
        "AI Research & Development Labs",
        "AI-Driven Creative Studios",
        "AI Video/Audio Generation Platforms",
        "Machine Learning Engineers",
        "Data Science & Analytics Firms",
        "Data Engineering Services",
        "Digital Signal Processing Companies",
        "Audio AI Companies",
        "Music Recommendation Engines",
        "Audio Plugin Developers",
        "DAW Developers",
        "Creative Tools & Productivity Software Makers",
        "Immersive Technology Labs",
        "3D Modelling & Simulation Studios",
        "Virtual Production Studios",
        "Realtime Engine Specialists",
        "Game Audio & Interactive Sound Designers",
        "Interactive Media Designers",
        "Smart Contract Developers",
        "Motion Capture Studios",
        "Creative Robotics Labs",
        "IoT & Wearable Tech Designers",
        "Haptics & Sensory Experience Companies",
        "Streaming Technology Platforms",
        "Cloud Media Infrastructure Providers",
        "Cybersecurity for Creative Industries",
        "DevOps & Cloud Engineering Services",
        "API Providers & Developer Platforms",
        "Audio Infrastructure Platforms",
        "Video Encoding & Live-stream Tech",
        "Creative Automation Platforms",
        "DRM & Rights Management Services",
        "Asset Management & Metadata Software",
        "Digital Preservation Technology",
        "E-commerce Platforms for Creators",
        "Multi-vendor Marketplace Platforms",
        "White-label Ticketing Providers",
        "Event Technology & RFID/NFC Systems",
        "Spatial Audio Technology Companies",
        "Embedded Systems for Art & Music",
        "3D Printing & Fabrication Tech Studios",
        "Digital Fabrication Labs",
        "Creative Coding Studios",
        "Interactive Installation Technologists",
        "Projection Mapping Tech Providers",
        "Lighting Control System Developers",
        "Show Control & Live Event Software",
        "Music Industry",
        "Audio, Production & Post-Production",
        "Visual Arts, Design & Craft",
        "Culture, Heritage & Community",
        "Events, Festivals & Live Performance",
        "Media, Content & Communications",
        "Education, Training & Professional Development",
        "Workspaces, Fabrication & Creative Infrastructure",
        "Creative Technology & Emerging Media",
        "Software, Development & Digital Platforms",
        "Media Infrastructure & Cloud Technology",
        "Business, Logistics & Support Services",
      ],
      location_source: ["UserSubmitted", "AdminImported", "AdminCreated"],
      location_status: [
        "Pending",
        "Active",
        "Rejected",
        "Inactive",
        "PendingPayment",
      ],
    },
  },
} as const
