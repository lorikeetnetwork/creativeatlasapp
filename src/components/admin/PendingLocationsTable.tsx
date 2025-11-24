import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocationReviewCard } from "./LocationReviewCard";
import { Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Location {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  suburb: string;
  state: string;
  status: string;
  created_at: string;
  logo_url: string | null;
  owner_user_id: string | null;
}

interface PendingLocationsTableProps {
  status: string;
}

export function PendingLocationsTable({ status }: PendingLocationsTableProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLocations();
  }, [status]);

  const fetchLocations = async () => {
    try {
      let query = supabase.from('locations').select('*').order('created_at', { ascending: false });
      
      if (status !== 'all') {
        query = query.eq('status', status as any);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast({
        title: "Error",
        description: "Failed to load locations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (locationId: string, newStatus: 'Active' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ status: newStatus })
        .eq('id', locationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Location ${newStatus.toLowerCase()} successfully.`,
      });

      fetchLocations();
    } catch (error) {
      console.error("Error updating location:", error);
      toast({
        title: "Error",
        description: "Failed to update location status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      Pending: "secondary",
      Active: "default",
      Rejected: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No locations found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  {location.logo_url ? (
                    <img
                      src={location.logo_url}
                      alt={location.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs">
                      No Logo
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{location.category}</div>
                    {location.subcategory && (
                      <div className="text-xs text-muted-foreground">{location.subcategory}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{location.suburb}, {location.state}</TableCell>
                <TableCell>{getStatusBadge(location.status)}</TableCell>
                <TableCell>{format(new Date(location.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLocation(location)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  {location.status === 'Pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleQuickAction(location.id, 'Active')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleQuickAction(location.id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedLocation && (
        <LocationReviewCard
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onUpdate={fetchLocations}
        />
      )}
    </>
  );
}
