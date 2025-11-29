import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LocationReviewCard } from "./LocationReviewCard";
import { Loader2, Eye, Check, X } from "lucide-react";
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
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500 text-white text-xs">Active</Badge>;
      case "Pending":
        return <Badge variant="secondary" className="bg-yellow-500 text-black text-xs">Pending</Badge>;
      case "Rejected":
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
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
      <Card className="border-[#333] bg-[#1a1a1a]">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400">No locations found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {locations.map((location) => (
          <Card key={location.id} className="border-[#333] bg-[#1a1a1a]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {location.logo_url ? (
                  <img src={location.logo_url} alt={location.name} className="w-12 h-12 object-cover rounded-lg border border-[#333] flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-[#333] flex items-center justify-center text-gray-500 text-xs flex-shrink-0">No img</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{location.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{location.suburb}, {location.state} • {location.category}</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(location.status)}
                    <span className="text-xs text-gray-500">{format(new Date(location.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-[#333]">
                <Button size="sm" variant="outline" className="flex-1 h-9 text-xs border-[#333] text-white hover:bg-[#222]" onClick={() => setSelectedLocation(location)}>
                  <Eye className="w-3 h-3 mr-1" />Review
                </Button>
                {location.status === 'Pending' && (
                  <>
                    <Button size="sm" variant="outline" className="h-9 px-3 border-green-600 text-green-500 hover:bg-green-500/10" onClick={() => handleQuickAction(location.id, 'Active')}><Check className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" className="h-9 px-3 border-red-600 text-red-500 hover:bg-red-500/10" onClick={() => handleQuickAction(location.id, 'Rejected')}><X className="w-3 h-3" /></Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border border-[#333] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#333]">
              <TableHead className="text-gray-400">Logo</TableHead>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Location</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Submitted</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id} className="border-[#333]">
                <TableCell>
                  {location.logo_url ? (
                    <img src={location.logo_url} alt={location.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-[#333] rounded flex items-center justify-center text-xs text-gray-500">No Logo</div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-white">{location.name}</TableCell>
                <TableCell className="text-gray-400">{location.category}</TableCell>
                <TableCell className="text-gray-400">{location.suburb}, {location.state}</TableCell>
                <TableCell>{getStatusBadge(location.status)}</TableCell>
                <TableCell className="text-gray-400">{format(new Date(location.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedLocation(location)}><Eye className="h-4 w-4 mr-1" />Review</Button>
                  {location.status === 'Pending' && (
                    <>
                      <Button size="sm" variant="default" onClick={() => handleQuickAction(location.id, 'Active')}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleQuickAction(location.id, 'Rejected')}>Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedLocation && (
        <LocationReviewCard location={selectedLocation} onClose={() => setSelectedLocation(null)} onUpdate={fetchLocations} />
      )}
    </>
  );
}
