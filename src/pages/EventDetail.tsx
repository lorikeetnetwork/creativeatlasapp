import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  ArrowLeft,
  Share2,
  Globe,
  Ticket,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import RSVPButton from "@/components/events/RSVPButton";
import { useEvent } from "@/hooks/useEvent";
import { useEventRSVPCounts } from "@/hooks/useEventRSVP";
import { useToast } from "@/hooks/use-toast";
import { BentoPage, BentoContentCard, BentoSidebarCard } from "@/components/ui/bento-page-layout";

const eventTypeColors: Record<string, string> = {
  workshop: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  concert: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  exhibition: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  festival: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  conference: "bg-green-500/20 text-green-400 border-green-500/30",
  meetup: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  networking: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: event, isLoading, error } = useEvent(slug);
  const { data: rsvpCounts } = useEventRSVPCounts(event?.id);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "Event link copied to clipboard." });
    } catch {
      toast({ title: "Error", description: "Failed to copy link.", variant: "destructive" });
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  const formatPrice = () => {
    if (event?.is_free) return "Free";
    if (event?.ticket_price_min && event?.ticket_price_max) {
      if (event.ticket_price_min === event.ticket_price_max) {
        return `$${event.ticket_price_min}`;
      }
      return `$${event.ticket_price_min} - $${event.ticket_price_max}`;
    }
    if (event?.ticket_price_min) return `From $${event.ticket_price_min}`;
    return null;
  };

  if (isLoading) {
    return (
      <BentoPage>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="aspect-video max-w-4xl rounded-lg mb-8" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3" />
        </main>
      </BentoPage>
    );
  }

  if (error || !event) {
    return (
      <BentoPage>
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Event not found</h1>
          <p className="text-gray-400 mb-6">
            This event may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate("/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </main>
      </BentoPage>
    );
  }

  return (
    <BentoPage>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            {event.cover_image_url && (
              <div className="aspect-video rounded-lg overflow-hidden border border-[#333]">
                <img
                  src={event.cover_image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <BentoContentCard>
              {/* Title & Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className={eventTypeColors[event.event_type] || eventTypeColors.other}
                >
                  {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                </Badge>
                {event.is_free && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Free
                  </Badge>
                )}
                {event.is_online && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    <Globe className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                )}
                {event.category && (
                  <Badge variant="secondary">
                    {event.category.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>

              {/* Description */}
              {event.description && (
                <div className="mt-6">
                  <p className="text-gray-400 whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Organizer */}
              {event.creator && (
                <div className="pt-6 mt-6 border-t border-[#333]">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Organized by
                  </h3>
                  <p className="font-medium text-white">{event.creator.full_name || event.creator.email}</p>
                </div>
              )}
            </BentoContentCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BentoSidebarCard sticky>
              <RSVPButton eventId={event.id} size="lg" />

              <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-4">
                {rsvpCounts && rsvpCounts.going > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {rsvpCounts.going} going
                  </span>
                )}
                {rsvpCounts && rsvpCounts.interested > 0 && (
                  <span>{rsvpCounts.interested} interested</span>
                )}
              </div>

              <Separator className="my-4 bg-[#333]" />

              {/* Date & Time */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-white">
                    {format(new Date(event.start_date), "EEEE, MMMM d, yyyy")}
                  </p>
                  {event.start_time && (
                    <p className="text-sm text-gray-400">
                      {formatTime(event.start_time)}
                      {event.end_time && ` - ${formatTime(event.end_time)}`}
                    </p>
                  )}
                  {event.end_date && event.end_date !== event.start_date && (
                    <p className="text-sm text-gray-400">
                      to {format(new Date(event.end_date), "MMMM d, yyyy")}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  {event.is_online ? (
                    <>
                      <p className="font-medium text-white">Online Event</p>
                      {event.online_url && (
                        <a
                          href={event.online_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Join online
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-white">
                        {event.venue_name || event.location?.name || "Location TBA"}
                      </p>
                      {event.venue_address && (
                        <p className="text-sm text-gray-400">
                          {event.venue_address}
                        </p>
                      )}
                      {event.location && (
                        <Link
                          to={`/business/${event.location.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View venue details
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              {formatPrice() && (
                <div className="flex items-start gap-3 mt-4">
                  <Ticket className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{formatPrice()}</p>
                    {event.ticket_url && (
                      <a
                        href={event.ticket_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        Get tickets
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <Separator className="my-4 bg-[#333]" />

              {/* Share */}
              <Button variant="outline" className="w-full border-[#333] text-white hover:bg-[#222]" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </BentoSidebarCard>
          </div>
        </div>
      </main>
    </BentoPage>
  );
};

export default EventDetail;
