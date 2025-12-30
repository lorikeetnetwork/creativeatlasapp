import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { useResources, type ResourceFilters as ResourceFiltersType } from "@/hooks/useResources";
import { supabase } from "@/integrations/supabase/client";
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoFilterCard,
  BentoEmptyState,
  BentoContentCard,
} from "@/components/ui/bento-page-layout";

const Resources = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ResourceFiltersType>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: resources, isLoading } = useResources(filters);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const featuredResources = resources?.filter((r) => r.is_featured);
  const regularResources = resources?.filter((r) => !r.is_featured);

  return (
    <BentoPage>
      <Navbar />

      <BentoMain>
        {/* Header */}
        <BentoPageHeader
          icon={<BookOpen className="h-8 w-8" />}
          title="Resources Library"
          description="Templates, guides, tools, and directories for the creative community"
          actions={
            isAuthenticated && (
              <Button onClick={() => navigate("/resources/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            )
          }
        />

        {/* Filters */}
        <BentoFilterCard>
          <ResourceFilters filters={filters} onFiltersChange={setFilters} />
        </BentoFilterCard>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative p-4 rounded-xl border border-border bg-card space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Featured Resources */}
        {featuredResources && featuredResources.length > 0 && (
          <BentoContentCard title="★ Featured Resources" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredResources.slice(0, 4).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} featured />
              ))}
            </div>
          </BentoContentCard>
        )}

        {/* All Resources Grid */}
        {regularResources && regularResources.length > 0 && (
          <BentoContentCard title="All Resources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </BentoContentCard>
        )}

        {/* Empty State */}
        {!isLoading && (!resources || resources.length === 0) && (
          <BentoEmptyState
            icon={<BookOpen className="h-16 w-16" />}
            title="No resources found"
            description={
              Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more resources."
                : "Be the first to add a resource!"
            }
            action={
              isAuthenticated && (
                <Button onClick={() => navigate("/resources/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              )
            }
          />
        )}
      </BentoMain>
    </BentoPage>
  );
};

export default Resources;
