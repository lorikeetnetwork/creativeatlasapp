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
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          article_type: Database["public"]["Enums"]["article_type"]
          author_id: string
          content: Json | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean | null
          linked_location_id: string | null
          published_at: string | null
          read_time_minutes: number | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          article_type?: Database["public"]["Enums"]["article_type"]
          author_id: string
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          linked_location_id?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          article_type?: Database["public"]["Enums"]["article_type"]
          author_id?: string
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          linked_location_id?: string | null
          published_at?: string | null
          read_time_minutes?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_linked_location_id_fkey"
            columns: ["linked_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string | null
          id: string
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id?: string | null
          id?: string
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string | null
          id?: string
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          discussion_id: string
          id: string
          parent_reply_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          parent_reply_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["discussion_category"]
          content: Json | null
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          reply_count: number | null
          slug: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: Database["public"]["Enums"]["discussion_category"]
          content?: Json | null
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          reply_count?: number | null
          slug: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["discussion_category"]
          content?: Json | null
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          reply_count?: number | null
          slug?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: Database["public"]["Enums"]["location_category"] | null
          cover_image_url: string | null
          created_at: string
          creator_id: string
          description: string | null
          end_date: string | null
          end_time: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          excerpt: string | null
          id: string
          is_featured: boolean | null
          is_free: boolean | null
          is_online: boolean | null
          location_id: string | null
          online_url: string | null
          slug: string
          start_date: string
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"]
          ticket_price_max: number | null
          ticket_price_min: number | null
          ticket_url: string | null
          title: string
          updated_at: string
          venue_address: string | null
          venue_name: string | null
          view_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["location_category"] | null
          cover_image_url?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          is_online?: boolean | null
          location_id?: string | null
          online_url?: string | null
          slug: string
          start_date: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          ticket_price_max?: number | null
          ticket_price_min?: number | null
          ticket_url?: string | null
          title: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
          view_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["location_category"] | null
          cover_image_url?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          excerpt?: string | null
          id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          is_online?: boolean | null
          location_id?: string | null
          online_url?: string | null
          slug?: string
          start_date?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          ticket_price_max?: number | null
          ticket_price_min?: number | null
          ticket_url?: string | null
          title?: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
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
      member_portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          member_id: string
          project_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          member_id: string
          project_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          member_id?: string
          project_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_portfolio_items_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          experience_years: number | null
          id: string
          instagram: string | null
          is_available_for_collaboration: boolean | null
          is_available_for_hire: boolean | null
          is_mentor: boolean | null
          is_public: boolean | null
          linkedin: string | null
          other_social: string | null
          portfolio_url: string | null
          primary_discipline:
            | Database["public"]["Enums"]["location_category"]
            | null
          skills: string[] | null
          state: string | null
          suburb: string | null
          tagline: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          experience_years?: number | null
          id?: string
          instagram?: string | null
          is_available_for_collaboration?: boolean | null
          is_available_for_hire?: boolean | null
          is_mentor?: boolean | null
          is_public?: boolean | null
          linkedin?: string | null
          other_social?: string | null
          portfolio_url?: string | null
          primary_discipline?:
            | Database["public"]["Enums"]["location_category"]
            | null
          skills?: string[] | null
          state?: string | null
          suburb?: string | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          experience_years?: number | null
          id?: string
          instagram?: string | null
          is_available_for_collaboration?: boolean | null
          is_available_for_hire?: boolean | null
          is_mentor?: boolean | null
          is_public?: boolean | null
          linkedin?: string | null
          other_social?: string | null
          portfolio_url?: string | null
          primary_discipline?:
            | Database["public"]["Enums"]["location_category"]
            | null
          skills?: string[] | null
          state?: string | null
          suburb?: string | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_matches: {
        Row: {
          created_at: string
          id: string
          mentee_id: string
          mentor_id: string
          request_id: string
          status: Database["public"]["Enums"]["mentorship_match_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentee_id: string
          mentor_id: string
          request_id: string
          status?: Database["public"]["Enums"]["mentorship_match_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mentee_id?: string
          mentor_id?: string
          request_id?: string
          status?: Database["public"]["Enums"]["mentorship_match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_matches_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_matches_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_matches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "mentorship_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          areas_seeking_help: string[] | null
          created_at: string
          description: string
          id: string
          mentor_id: string | null
          preferred_format:
            | Database["public"]["Enums"]["preferred_format"]
            | null
          requester_id: string
          status: Database["public"]["Enums"]["mentorship_status"]
          title: string
          updated_at: string
        }
        Insert: {
          areas_seeking_help?: string[] | null
          created_at?: string
          description: string
          id?: string
          mentor_id?: string | null
          preferred_format?:
            | Database["public"]["Enums"]["preferred_format"]
            | null
          requester_id: string
          status?: Database["public"]["Enums"]["mentorship_status"]
          title: string
          updated_at?: string
        }
        Update: {
          areas_seeking_help?: string[] | null
          created_at?: string
          description?: string
          id?: string
          mentor_id?: string | null
          preferred_format?:
            | Database["public"]["Enums"]["preferred_format"]
            | null
          requester_id?: string
          status?: Database["public"]["Enums"]["mentorship_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "member_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_verified: boolean | null
          preferences: Json | null
          subscribed_at: string
          unsubscribed_at: string | null
          user_id: string | null
          verification_token: string | null
        }
        Insert: {
          email: string
          id?: string
          is_verified?: boolean | null
          preferences?: Json | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          user_id?: string | null
          verification_token?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_verified?: boolean | null
          preferences?: Json | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          user_id?: string | null
          verification_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          application_email: string | null
          application_url: string | null
          category: Database["public"]["Enums"]["location_category"] | null
          compensation_details: string | null
          compensation_type: Database["public"]["Enums"]["compensation_type"]
          created_at: string
          deadline: string | null
          description: string
          experience_level:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id: string
          is_featured: boolean | null
          is_remote: boolean | null
          location_id: string | null
          location_text: string | null
          opportunity_type: Database["public"]["Enums"]["opportunity_type"]
          poster_id: string
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          application_email?: string | null
          application_url?: string | null
          category?: Database["public"]["Enums"]["location_category"] | null
          compensation_details?: string | null
          compensation_type?: Database["public"]["Enums"]["compensation_type"]
          created_at?: string
          deadline?: string | null
          description: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id?: string
          is_featured?: boolean | null
          is_remote?: boolean | null
          location_id?: string | null
          location_text?: string | null
          opportunity_type: Database["public"]["Enums"]["opportunity_type"]
          poster_id: string
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          application_email?: string | null
          application_url?: string | null
          category?: Database["public"]["Enums"]["location_category"] | null
          compensation_details?: string | null
          compensation_type?: Database["public"]["Enums"]["compensation_type"]
          created_at?: string
          deadline?: string | null
          description?: string
          experience_level?:
            | Database["public"]["Enums"]["experience_level"]
            | null
          id?: string
          is_featured?: boolean | null
          is_remote?: boolean | null
          location_id?: string | null
          location_text?: string | null
          opportunity_type?: Database["public"]["Enums"]["opportunity_type"]
          poster_id?: string
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_applications: {
        Row: {
          cover_message: string | null
          created_at: string
          id: string
          opportunity_id: string
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_message?: string | null
          created_at?: string
          id?: string
          opportunity_id: string
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_message?: string | null
          created_at?: string
          id?: string
          opportunity_id?: string
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          onboarding_completed: boolean | null
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
          onboarding_completed?: boolean | null
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
          onboarding_completed?: boolean | null
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
      rate_limits: {
        Row: {
          created_at: string | null
          id: string
          identifier: string
          identifier_type: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          identifier: string
          identifier_type: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier?: string
          identifier_type?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      resource_tags: {
        Row: {
          resource_id: string
          tag_id: string
        }
        Insert: {
          resource_id: string
          tag_id: string
        }
        Update: {
          resource_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_tags_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["location_category"] | null
          content: Json | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          external_url: string | null
          id: string
          is_featured: boolean | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category?: Database["public"]["Enums"]["location_category"] | null
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          is_featured?: boolean | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["location_category"] | null
          content?: Json | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          is_featured?: boolean | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      showcases: {
        Row: {
          category: Database["public"]["Enums"]["location_category"] | null
          collaborators: string | null
          cover_image_url: string | null
          created_at: string
          description: string
          gallery_images: string[] | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          linked_location_id: string | null
          project_title: string
          project_url: string | null
          slug: string
          submitted_by: string
          tags: string[] | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["location_category"] | null
          collaborators?: string | null
          cover_image_url?: string | null
          created_at?: string
          description: string
          gallery_images?: string[] | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          linked_location_id?: string | null
          project_title: string
          project_url?: string | null
          slug: string
          submitted_by: string
          tags?: string[] | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["location_category"] | null
          collaborators?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          gallery_images?: string[] | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          linked_location_id?: string | null
          project_title?: string
          project_url?: string | null
          slug?: string
          submitted_by?: string
          tags?: string[] | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "showcases_linked_location_id_fkey"
            columns: ["linked_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showcases_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
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
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
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
      application_status:
        | "submitted"
        | "reviewed"
        | "shortlisted"
        | "rejected"
        | "accepted"
      article_status: "draft" | "published" | "archived"
      article_type: "article" | "update" | "announcement" | "event"
      compensation_type:
        | "paid"
        | "unpaid"
        | "honorarium"
        | "equity"
        | "negotiable"
      discussion_category:
        | "general"
        | "help"
        | "showcase"
        | "opportunities"
        | "events"
        | "introductions"
      event_status: "draft" | "published" | "cancelled" | "completed"
      event_type:
        | "workshop"
        | "concert"
        | "exhibition"
        | "festival"
        | "conference"
        | "meetup"
        | "networking"
        | "other"
      experience_level: "entry" | "mid" | "senior" | "any"
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
      mentorship_match_status:
        | "pending"
        | "accepted"
        | "declined"
        | "active"
        | "completed"
      mentorship_status:
        | "open"
        | "matched"
        | "in_progress"
        | "completed"
        | "closed"
      opportunity_status: "open" | "closed" | "filled"
      opportunity_type:
        | "job"
        | "gig"
        | "residency"
        | "grant"
        | "collaboration"
        | "volunteer"
        | "internship"
      preferred_format: "virtual" | "in_person" | "either"
      resource_type: "guide" | "template" | "tool" | "directory" | "tutorial"
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
      application_status: [
        "submitted",
        "reviewed",
        "shortlisted",
        "rejected",
        "accepted",
      ],
      article_status: ["draft", "published", "archived"],
      article_type: ["article", "update", "announcement", "event"],
      compensation_type: [
        "paid",
        "unpaid",
        "honorarium",
        "equity",
        "negotiable",
      ],
      discussion_category: [
        "general",
        "help",
        "showcase",
        "opportunities",
        "events",
        "introductions",
      ],
      event_status: ["draft", "published", "cancelled", "completed"],
      event_type: [
        "workshop",
        "concert",
        "exhibition",
        "festival",
        "conference",
        "meetup",
        "networking",
        "other",
      ],
      experience_level: ["entry", "mid", "senior", "any"],
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
      mentorship_match_status: [
        "pending",
        "accepted",
        "declined",
        "active",
        "completed",
      ],
      mentorship_status: [
        "open",
        "matched",
        "in_progress",
        "completed",
        "closed",
      ],
      opportunity_status: ["open", "closed", "filled"],
      opportunity_type: [
        "job",
        "gig",
        "residency",
        "grant",
        "collaboration",
        "volunteer",
        "internship",
      ],
      preferred_format: ["virtual", "in_person", "either"],
      resource_type: ["guide", "template", "tool", "directory", "tutorial"],
    },
  },
} as const
