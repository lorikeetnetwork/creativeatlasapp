import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import OpportunityFilters from "@/components/opportunities/OpportunityFilters";
import { useOpportunities, type OpportunityFilters as OpportunityFiltersType } from "@/hooks/useOpportunities";
import { supabase } from "@/integrations/supabase/client";
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoFilterCard,
  BentoEmptyState,
} from "@/components/ui/bento-page-layout";

const Opportunities = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<OpportunityFiltersType>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: opportunities, isLoading } = useOpportunities(filters);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  return (
    <BentoPage>
      <Navbar />

      <BentoMain>
        {/* Header */}
        <BentoPageHeader
          icon={<Briefcase className="h-8 w-8" />}
          title="Opportunities"
          description="Find jobs, gigs, grants, and collaborations in the creative industry"
          actions={
            isAuthenticated && (
              <Button onClick={() => navigate("/opportunities/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Post Opportunity
              </Button>
            )
          }
        />

        {/* Filters */}
        <BentoFilterCard>
          <OpportunityFilters filters={filters} onFiltersChange={setFilters} />
        </BentoFilterCard>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative p-4 rounded-xl border border-[#333] bg-[#1a1a1a]">
                <Skeleton className="h-48 rounded-lg bg-[#333]" />
              </div>
            ))}
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <BentoEmptyState
            icon={<Briefcase className="h-16 w-16" />}
            title="No opportunities found"
            description={
              Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more opportunities."
                : "Be the first to post an opportunity!"
            }
            action={
              isAuthenticated && (
                <Button onClick={() => navigate("/opportunities/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Opportunity
                </Button>
              )
            }
          />
        )}
      </BentoMain>
    </BentoPage>
  );
};

export default Opportunities;
