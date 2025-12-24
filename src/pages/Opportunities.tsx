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
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground mt-1">
              Find jobs, gigs, grants, and collaborations in the creative industry
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => navigate("/opportunities/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Opportunity
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <OpportunityFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 rounded-lg" />
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
          <div className="text-center py-16">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No opportunities found</h2>
            <p className="text-muted-foreground mb-6">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more opportunities."
                : "Be the first to post an opportunity!"}
            </p>
            {isAuthenticated && (
              <Button onClick={() => navigate("/opportunities/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Post Opportunity
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Opportunities;
