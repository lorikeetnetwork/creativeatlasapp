import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Calendar,
  Users,
  Eye,
  Share2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PhotoGallery } from "@/components/PhotoGallery";
import ContactForm from "@/components/business/ContactForm";
import OfferingsGallery from "@/components/business/OfferingsGallery";
import VideosSection from "@/components/business/VideosSection";
import CurrentProjectCard from "@/components/business/CurrentProjectCard";
import { ContactDetailsGate, useContactAccess } from "@/components/ContactDetailsGate";
import type { Tables } from "@/integrations/supabase/types";

type Location = Tables<"locations">;
type BusinessProfileType = Tables<"business_profiles">;
type LocationPhoto = Tables<"location_photos">;

const BusinessProfile = () => {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess } = useContactAccess();
  const [location, setLocation] = useState<Location | null>(null);
  const [profile, setProfile] = useState<BusinessProfileType | null>(null);
  const [photos, setPhotos] = useState<LocationPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (locationId) {
      fetchBusinessProfile();
    }
  }, [locationId]);

  const fetchBusinessProfile = async () => {
    try {
      // Fetch location
      const { data: locationData, error: locationError } = await supabase
        .from("locations")
        .select("*")
        .eq("id", locationId)
        .eq("status", "Active")
        .single();

      if (locationError) throw locationError;
      setLocation(locationData);

      // Fetch business profile
      const { data: profileData } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("location_id", locationId)
        .single();

      setProfile(profileData);

      // Fetch photos
      const { data: photosData } = await supabase
        .from("location_photos")
        .select("*")
        .eq("location_id", locationId)
        .order("display_order", { ascending: true });

      setPhotos(photosData || []);

      // Increment profile views
      if (profileData) {
        await supabase
          .from("business_profiles")
          .update({ profile_views: (profileData.profile_views || 0) + 1 })
          .eq("id", profileData.id);
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
      toast({
        title: "Error",
        description: "Could not load business profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: location?.name,
          text: profile?.tagline || location?.description,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <Card className="border-[#333] bg-[#1a1a1a]">
          <CardContent className="pt-6">
            <p className="text-gray-400">Business not found</p>
            <Button onClick={() => navigate("/map")} className="mt-4">
              Back to Map
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Priority: og_image_url > logo_url > first photo > placeholder
  const coverPhoto = location.og_image_url || location.logo_url || photos[0]?.photo_url || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
        <img
          src={coverPhoto}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate("/map")}
            className="backdrop-blur-sm bg-[#1a1a1a]/80 border-[#333] hover:bg-[#222] h-10 w-10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleShare}
            className="backdrop-blur-sm bg-[#1a1a1a]/80 border-[#333] hover:bg-[#222] h-10 w-10"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 md:p-6 shadow-lg mb-6 md:mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 md:gap-4">
              {location.logo_url && (
                <img
                  src={location.logo_url}
                  alt={`${location.name} logo`}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-lg border border-[#333] flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-white truncate">{location.name}</h1>
                {profile?.tagline && (
                  <p className="text-sm md:text-lg text-gray-400 line-clamp-2">{profile.tagline}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="bg-[#333] text-white">{location.category}</Badge>
              {location.subcategory && <Badge variant="outline" className="border-[#444] text-gray-300">{location.subcategory}</Badge>}
              <div className="flex items-center gap-1 text-xs md:text-sm text-gray-400">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span>
                  {location.suburb}, {location.state}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
              {profile?.founded_year && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Est. {profile.founded_year}</span>
                </div>
              )}
              {profile?.team_size && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{profile.team_size}</span>
                </div>
              )}
              {profile?.profile_views && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{profile.profile_views} views</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Contact Card - Shows at top on mobile */}
        <div className="lg:hidden mb-6">
          <Card className="border-[#333] bg-[#1a1a1a]">
            <CardContent className="pt-4 pb-4 space-y-3">
              <h3 className="font-semibold text-white text-sm">Contact Information</h3>
              
              {/* Gated contact details for email/phone */}
              {(location.email || location.phone) && !hasAccess ? (
                <ContactDetailsGate 
                  email={location.email} 
                  phone={location.phone} 
                  showAs="card" 
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {location.email && (
                    <a
                      href={`mailto:${location.email}`}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors p-2 rounded-lg bg-[#222]"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                  )}
                  {location.phone && (
                    <a
                      href={`tel:${location.phone}`}
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors p-2 rounded-lg bg-[#222]"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </a>
                  )}
                  {location.website && (
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors p-2 rounded-lg bg-[#222]"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  {location.instagram && (
                    <a
                      href={`https://instagram.com/${location.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors p-2 rounded-lg bg-[#222]"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              )}
              
              {/* Website and Instagram always visible (not PII) */}
              {!hasAccess && (location.website || location.instagram) && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {location.website && (
                    <a
                      href={location.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors p-2 rounded-lg bg-[#222]"
                    >
                      <Globe className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                  {location.instagram && (
                    <a
                      href={`https://instagram.com/${location.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors p-2 rounded-lg bg-[#222]"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              )}
              
              <Button className="w-full" size="sm" onClick={() => navigate(`/map?location=${locationId}`)}>
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              {/* Scrollable Tabs for Mobile with fade indicator */}
              <div className="relative">
                <ScrollArea className="w-full">
                  <TabsList className="inline-flex w-auto min-w-full lg:grid lg:grid-cols-6 bg-[#1a1a1a] border border-[#333] p-1">
                    <TabsTrigger value="about" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4">About</TabsTrigger>
                    <TabsTrigger value="gallery" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4">Gallery</TabsTrigger>
                    <TabsTrigger value="offerings" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4">Offerings</TabsTrigger>
                    <TabsTrigger value="videos" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4">Videos</TabsTrigger>
                    <TabsTrigger value="project" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4">Project</TabsTrigger>
                    <TabsTrigger value="contact" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4">Contact</TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
                {/* Fade indicator for more tabs on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#121212] to-transparent pointer-events-none lg:hidden" />
              </div>

              <TabsContent value="about" className="space-y-4 md:space-y-6 mt-4 md:mt-6">
                <Card className="border-[#333] bg-[#1a1a1a]">
                  <CardContent className="pt-4 md:pt-6">
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {profile?.about || location.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>

                {profile?.specialties && profile.specialties.length > 0 && (
                  <Card className="border-[#333] bg-[#1a1a1a]">
                    <CardContent className="pt-4 md:pt-6">
                      <h3 className="font-semibold mb-3 text-white text-sm md:text-base">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-[#333] text-white text-xs md:text-sm">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {profile?.awards_recognition && profile.awards_recognition.length > 0 && (
                  <Card className="border-[#333] bg-[#1a1a1a]">
                    <CardContent className="pt-4 md:pt-6">
                      <h3 className="font-semibold mb-3 text-white text-sm md:text-base">Awards & Recognition</h3>
                      <ul className="space-y-2">
                        {profile.awards_recognition.map((award, idx) => (
                          <li key={idx} className="text-sm md:text-base text-gray-400 flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{award}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="mt-4 md:mt-6">
                {photos.length > 0 ? (
                  <PhotoGallery photos={photos} />
                ) : (
                  <Card className="border-[#333] bg-[#1a1a1a]">
                    <CardContent className="pt-6 text-center text-gray-400">
                      No photos available yet.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="offerings" className="mt-4 md:mt-6">
                <OfferingsGallery locationId={locationId!} />
              </TabsContent>

              <TabsContent value="videos" className="mt-4 md:mt-6">
                <VideosSection locationId={locationId!} />
              </TabsContent>

              <TabsContent value="project" className="mt-4 md:mt-6">
                <CurrentProjectCard locationId={locationId!} />
              </TabsContent>

              <TabsContent value="contact" className="mt-4 md:mt-6">
                <ContactForm locationId={locationId!} businessName={location.name} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar (Desktop only) */}
          <div className="hidden lg:block space-y-6">
            <Card className="sticky top-4 border-[#333] bg-[#1a1a1a]">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-white">Contact Information</h3>
                
                {/* Gated email/phone for non-subscribers */}
                {(location.email || location.phone) && !hasAccess ? (
                  <ContactDetailsGate 
                    email={location.email} 
                    phone={location.phone} 
                    showAs="card" 
                  />
                ) : (
                  <>
                    {location.email && (
                      <a
                        href={`mailto:${location.email}`}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{location.email}</span>
                      </a>
                    )}
                    {location.phone && (
                      <a
                        href={`tel:${location.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{location.phone}</span>
                      </a>
                    )}
                  </>
                )}
                
                {/* Website and Instagram always visible */}
                {location.website && (
                  <a
                    href={location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Visit Website</span>
                  </a>
                )}
                {location.instagram && (
                  <a
                    href={`https://instagram.com/${location.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>{location.instagram}</span>
                  </a>
                )}
                <Button className="w-full" onClick={() => navigate(`/map?location=${locationId}`)}>
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
