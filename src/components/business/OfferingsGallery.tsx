import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Star } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface OfferingsGalleryProps {
  locationId: string;
}

type BusinessOffering = Tables<"business_offerings">;

const OfferingsGallery = ({ locationId }: OfferingsGalleryProps) => {
  const [offerings, setOfferings] = useState<BusinessOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchOfferings();
  }, [locationId]);

  const fetchOfferings = async () => {
    try {
      const { data, error } = await supabase
        .from("business_offerings")
        .select("*")
        .eq("location_id", locationId)
        .order("is_featured", { ascending: false })
        .order("display_order", { ascending: true });

      if (error) throw error;
      setOfferings(data || []);
    } catch (error) {
      console.error("Error fetching offerings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(
    new Set(offerings.map((o) => o.category).filter(Boolean))
  );

  const filteredOfferings = selectedCategory
    ? offerings.filter((o) => o.category === selectedCategory)
    : offerings;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted"></div>
            <CardContent className="pt-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (offerings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No offerings available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfferings.map((offering) => (
          <Card
            key={offering.id}
            className="overflow-hidden hover-scale cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={offering.image_url}
                alt={offering.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              {offering.is_featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary/90 backdrop-blur-sm">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
              {offering.category && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {offering.category}
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{offering.title}</CardTitle>
              {offering.price_range && (
                <CardDescription className="flex items-center gap-1 text-base font-medium text-primary">
                  <DollarSign className="w-4 h-4" />
                  {offering.price_range}
                </CardDescription>
              )}
            </CardHeader>
            {offering.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {offering.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OfferingsGallery;
