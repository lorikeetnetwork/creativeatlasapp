import { formatDistanceToNow, differenceInDays, isPast } from "date-fns";
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  DollarSign,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BentoCard } from "@/components/ui/bento-card";

interface OpportunityCardProps {
  opportunity: {
    id: string;
    slug: string;
    title: string;
    description: string;
    opportunity_type: string;
    compensation_type: string;
    compensation_details?: string | null;
    experience_level?: string | null;
    is_remote: boolean | null;
    location_text?: string | null;
    deadline?: string | null;
    category?: string | null;
    created_at: string;
    location?: {
      name: string;
      suburb: string;
      state: string;
      logo_url?: string | null;
    } | null;
    poster?: {
      full_name: string | null;
    } | null;
  };
  compact?: boolean;
}

const opportunityTypeColors: Record<string, string> = {
  job: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  gig: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  residency: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  grant: "bg-green-500/20 text-green-400 border-green-500/30",
  collaboration: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  volunteer: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  internship: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const compensationColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  unpaid: "bg-gray-500/20 text-gray-400",
  honorarium: "bg-blue-500/20 text-blue-400",
  equity: "bg-purple-500/20 text-purple-400",
  negotiable: "bg-yellow-500/20 text-yellow-400",
};

const OpportunityCard = ({ opportunity, compact = false }: OpportunityCardProps) => {
  const navigate = useNavigate();

  const getDeadlineStatus = () => {
    if (!opportunity.deadline) return null;
    const deadlineDate = new Date(opportunity.deadline);
    if (isPast(deadlineDate)) {
      return { text: "Closed", urgent: true };
    }
    const daysLeft = differenceInDays(deadlineDate, new Date());
    if (daysLeft <= 3) {
      return { text: `${daysLeft} days left`, urgent: true };
    }
    if (daysLeft <= 7) {
      return { text: `${daysLeft} days left`, urgent: false };
    }
    return { text: formatDistanceToNow(deadlineDate, { addSuffix: true }), urgent: false };
  };

  const deadlineStatus = getDeadlineStatus();
  const locationText = opportunity.is_remote
    ? "Remote"
    : opportunity.location_text || opportunity.location?.suburb || "Location flexible";

  if (compact) {
    return (
      <BentoCard
        className="p-4"
        onClick={() => navigate(`/opportunities/${opportunity.slug}`)}
      >
        <div className="flex items-start gap-3">
          {opportunity.location?.logo_url ? (
            <img
              src={opportunity.location.logo_url}
              alt={opportunity.location.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-white">{opportunity.title}</h3>
            <p className="text-sm text-gray-400 truncate">
              {opportunity.location?.name || opportunity.poster?.full_name}
            </p>
          </div>
          <Badge
            variant="outline"
            className={opportunityTypeColors[opportunity.opportunity_type] || ""}
          >
            {opportunity.opportunity_type}
          </Badge>
        </div>
      </BentoCard>
    );
  }

  return (
    <BentoCard
      className="p-5"
      onClick={() => navigate(`/opportunities/${opportunity.slug}`)}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {opportunity.location?.logo_url ? (
          <img
            src={opportunity.location.logo_url}
            alt={opportunity.location.name}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge
              variant="outline"
              className={opportunityTypeColors[opportunity.opportunity_type] || ""}
            >
              {opportunity.opportunity_type.charAt(0).toUpperCase() +
                opportunity.opportunity_type.slice(1)}
            </Badge>
            <Badge
              variant="secondary"
              className={compensationColors[opportunity.compensation_type] || ""}
            >
              {opportunity.compensation_type.charAt(0).toUpperCase() +
                opportunity.compensation_type.slice(1)}
            </Badge>
            {opportunity.is_remote && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                <Globe className="h-3 w-3 mr-1" />
                Remote
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1 text-white">
            {opportunity.title}
          </h3>
          <p className="text-sm text-gray-400">
            {opportunity.location?.name || opportunity.poster?.full_name || "Anonymous"}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 line-clamp-2 mt-4">
        {opportunity.description}
      </p>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{locationText}</span>
        </div>
        {opportunity.experience_level && opportunity.experience_level !== "any" && (
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span className="capitalize">{opportunity.experience_level} level</span>
          </div>
        )}
        {opportunity.compensation_details && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{opportunity.compensation_details}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#333]">
        <span className="text-xs text-gray-500">
          Posted {formatDistanceToNow(new Date(opportunity.created_at), { addSuffix: true })}
        </span>
        {deadlineStatus && (
          <Badge
            variant={deadlineStatus.urgent ? "destructive" : "secondary"}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            {deadlineStatus.text}
          </Badge>
        )}
      </div>
    </BentoCard>
  );
};

export default OpportunityCard;
