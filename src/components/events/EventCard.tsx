import { format } from "date-fns";
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    cover_image_url?: string | null;
    event_type: string;
    start_date: string;
    start_time?: string | null;
    end_time?: string | null;
    venue_name?: string | null;
    is_online: boolean | null;
    is_free: boolean | null;
    ticket_price_min?: number | null;
    ticket_price_max?: number | null;
    category?: string | null;
    location?: {
      name: string;
      suburb: string;
      state: string;
    } | null;
    rsvps?: { status: string }[];
  };
  compact?: boolean;
}

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

const EventCard = ({ event, compact = false }: EventCardProps) => {
  const navigate = useNavigate();
  
  const goingCount = event.rsvps?.filter((r) => r.status === "going").length || 0;
  const interestedCount = event.rsvps?.filter((r) => r.status === "interested").length || 0;

  const formatTime = (time: string | null) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, "h:mm a");
  };

  const formatPrice = () => {
    if (event.is_free) return "Free";
    if (event.ticket_price_min && event.ticket_price_max) {
      if (event.ticket_price_min === event.ticket_price_max) {
        return `$${event.ticket_price_min}`;
      }
      return `$${event.ticket_price_min} - $${event.ticket_price_max}`;
    }
    if (event.ticket_price_min) return `From $${event.ticket_price_min}`;
    return null;
  };

  const locationText = event.is_online
    ? "Online Event"
    : event.venue_name || event.location?.name || "Location TBA";

  if (compact) {
    return (
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors bg-card/50"
        onClick={() => navigate(`/events/${event.slug}`)}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground uppercase">
                {format(new Date(event.start_date), "MMM")}
              </span>
              <span className="text-lg font-bold text-primary">
                {format(new Date(event.start_date), "d")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{event.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {locationText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all group bg-card/50"
      onClick={() => navigate(`/events/${event.slug}`)}
    >
      {event.cover_image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {!event.cover_image_url && (
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-primary/40" />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
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
              Online
            </Badge>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          {event.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {event.excerpt}
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              {format(new Date(event.start_date), "EEE, MMM d, yyyy")}
              {event.start_time && ` at ${formatTime(event.start_time)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {goingCount > 0 && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {goingCount} going
            </span>
          )}
          {interestedCount > 0 && (
            <span>{interestedCount} interested</span>
          )}
        </div>
        {formatPrice() && !event.is_free && (
          <span className="text-sm font-medium">{formatPrice()}</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
