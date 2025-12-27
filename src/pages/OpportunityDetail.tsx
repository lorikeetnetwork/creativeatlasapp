import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  Globe,
  ExternalLink,
  Share2,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import ApplicationForm from "@/components/opportunities/ApplicationForm";
import DeadlineCountdown from "@/components/opportunities/DeadlineCountdown";
import { useOpportunity } from "@/hooks/useOpportunity";
import { useToast } from "@/hooks/use-toast";
import { BentoPage, BentoContentCard, BentoSidebarCard } from "@/components/ui/bento-page-layout";

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

const OpportunityDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: opportunity, isLoading, error } = useOpportunity(slug);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "Opportunity link copied to clipboard." });
    } catch {
      toast({ title: "Error", description: "Failed to copy link.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <BentoPage>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </main>
      </BentoPage>
    );
  }

  if (error || !opportunity) {
    return (
      <BentoPage>
        <Navbar />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Opportunity not found</h1>
          <p className="text-gray-400 mb-6">
            This opportunity may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>
        </main>
      </BentoPage>
    );
  }

  const locationText = opportunity.is_remote
    ? "Remote"
    : opportunity.location_text || opportunity.location?.suburb || "Location flexible";

  return (
    <BentoPage>
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => navigate("/opportunities")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BentoContentCard>
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
                {opportunity.category && (
                  <Badge variant="secondary">
                    {opportunity.category.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{opportunity.title}</h1>

              {/* Organization Info */}
              <div className="flex items-center gap-4 mt-6">
                {opportunity.location?.logo_url ? (
                  <img
                    src={opportunity.location.logo_url}
                    alt={opportunity.location.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-primary" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-lg text-white">
                    {opportunity.location?.name || opportunity.poster?.full_name || "Anonymous"}
                  </p>
                  {opportunity.location && (
                    <Link
                      to={`/business/${opportunity.location.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View organization profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3 text-white">About this opportunity</h2>
                <p className="text-gray-400 whitespace-pre-wrap">
                  {opportunity.description}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {opportunity.experience_level && opportunity.experience_level !== "any" && (
                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <p className="font-medium text-white capitalize">{opportunity.experience_level}</p>
                    </div>
                  </div>
                )}

                {opportunity.compensation_details && (
                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Compensation</p>
                      <p className="font-medium text-white">{opportunity.compensation_details}</p>
                    </div>
                  </div>
                )}

                {opportunity.start_date && (
                  <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-medium text-white">
                        {format(new Date(opportunity.start_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-white">{locationText}</p>
                  </div>
                </div>
              </div>
            </BentoContentCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BentoSidebarCard sticky>
              {/* Deadline */}
              {opportunity.deadline && (
                <>
                  <DeadlineCountdown deadline={opportunity.deadline} className="text-lg font-medium" />
                  <Separator className="my-4 bg-[#333]" />
                </>
              )}

              {/* Apply Button */}
              <ApplicationForm
                opportunityId={opportunity.id}
                opportunityTitle={opportunity.title}
                applicationEmail={opportunity.application_email}
                applicationUrl={opportunity.application_url}
              />

              <Separator className="my-4 bg-[#333]" />

              {/* Share */}
              <Button variant="outline" className="w-full border-[#333] text-white hover:bg-[#222]" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Opportunity
              </Button>

              {/* Organization Website */}
              {opportunity.location?.website && (
                <Button variant="outline" className="w-full mt-3 border-[#333] text-white hover:bg-[#222]" asChild>
                  <a
                    href={opportunity.location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
            </BentoSidebarCard>

            {/* Posted Info */}
            <div className="text-sm text-gray-500 text-center">
              Posted {format(new Date(opportunity.created_at), "MMMM d, yyyy")}
              <br />
              {opportunity.view_count || 0} views
            </div>
          </div>
        </div>
      </main>
    </BentoPage>
  );
};

export default OpportunityDetail;
