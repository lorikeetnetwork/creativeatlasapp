import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Plus, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShowcaseCard } from "@/components/showcases/ShowcaseCard";
import { ShowcaseFilters } from "@/components/showcases/ShowcaseFilters";
import { useShowcases, type ShowcaseFilters as ShowcaseFiltersType } from "@/hooks/useShowcases";
import { supabase } from "@/integrations/supabase/client";
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoFilterCard,
  BentoEmptyState,
  BentoContentCard,
} from "@/components/ui/bento-page-layout";

const Showcases = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ShowcaseFiltersType>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: showcases, isLoading } = useShowcases(filters);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const featuredShowcases = showcases?.filter((s) => s.is_featured);
  const regularShowcases = showcases?.filter((s) => !s.is_featured);

  return (
    <BentoPage>
      <Navbar />

      <BentoMain>
        {/* Header */}
        <BentoPageHeader
          icon={<Award className="h-8 w-8" />}
          title="Creative Showcase"
          description="Discover amazing work from the creative community"
          actions={
            isAuthenticated && (
              <Button onClick={() => navigate("/showcases/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Submit Your Work
              </Button>
            )
          }
        />

        {/* Filters */}
        <BentoFilterCard>
          <ShowcaseFilters filters={filters} onFiltersChange={setFilters} />
        </BentoFilterCard>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative rounded-xl border border-border bg-card overflow-hidden">
                <Skeleton className="aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Showcases */}
        {featuredShowcases && featuredShowcases.length > 0 && (
          <BentoContentCard title="★ Featured Work" className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredShowcases.slice(0, 6).map((showcase) => (
                <ShowcaseCard key={showcase.id} showcase={showcase} />
              ))}
            </div>
          </BentoContentCard>
        )}

        {/* All Showcases Gallery */}
        {regularShowcases && regularShowcases.length > 0 && (
          <BentoContentCard title="Gallery">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularShowcases.map((showcase) => (
                <ShowcaseCard key={showcase.id} showcase={showcase} />
              ))}
            </div>
          </BentoContentCard>
        )}

        {/* Empty State */}
        {!isLoading && (!showcases || showcases.length === 0) && (
          <BentoEmptyState
            icon={<Award className="h-16 w-16" />}
            title="No showcases yet"
            description={
              Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more work."
                : "Be the first to showcase your creative work!"
            }
            action={
              isAuthenticated && (
                <Button onClick={() => navigate("/showcases/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your Work
                </Button>
              )
            }
          />
        )}
      </BentoMain>
    </BentoPage>
  );
};

export default Showcases;
