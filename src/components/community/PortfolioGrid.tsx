import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type PortfolioItem = Database['public']['Tables']['member_portfolio_items']['Row'];

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No portfolio items yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden group cursor-pointer bg-card border-border hover:shadow-lg transition-all duration-300"
          onClick={() => item.project_url && window.open(item.project_url, '_blank')}
        >
          <div className="aspect-video overflow-hidden relative">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item.project_url && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h4 className="font-semibold text-foreground line-clamp-1">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
