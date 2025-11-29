import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/AdminStats";
import { PendingLocationsTable } from "@/components/admin/PendingLocationsTable";
import { BulkImport } from "@/components/admin/BulkImport";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Access Denied",
          description: "You must be logged in to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Check if user has admin role
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (error) throw error;

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast({
        title: "Error",
        description: "Failed to verify admin access.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage locations and review submissions</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#1a1a1a] border border-[#333]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400">Overview</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400">Pending Reviews</TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400">All Locations</TabsTrigger>
            <TabsTrigger value="bulk-import" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="pending">
            <PendingLocationsTable status="Pending" />
          </TabsContent>

          <TabsContent value="all">
            <PendingLocationsTable status="all" />
          </TabsContent>

          <TabsContent value="bulk-import">
            <BulkImport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
