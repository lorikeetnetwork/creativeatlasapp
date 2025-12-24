import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  FileText,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import { useMyOpportunities } from "@/hooks/useOpportunities";
import { useMyApplications } from "@/hooks/useApplications";
import { useDeleteOpportunity } from "@/hooks/useOpportunityMutations";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  open: "bg-green-500/20 text-green-400",
  closed: "bg-gray-500/20 text-gray-400",
  filled: "bg-blue-500/20 text-blue-400",
};

const applicationStatusColors: Record<string, string> = {
  submitted: "bg-yellow-500/20 text-yellow-400",
  reviewed: "bg-blue-500/20 text-blue-400",
  shortlisted: "bg-purple-500/20 text-purple-400",
  rejected: "bg-red-500/20 text-red-400",
  accepted: "bg-green-500/20 text-green-400",
};

const MyOpportunities = () => {
  const navigate = useNavigate();
  const [deleteOpportunityId, setDeleteOpportunityId] = useState<string | null>(null);

  const { data: myOpportunities, isLoading: isLoadingOpportunities } = useMyOpportunities();
  const { data: myApplications, isLoading: isLoadingApplications } = useMyApplications();
  const deleteOpportunity = useDeleteOpportunity();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleDelete = async () => {
    if (deleteOpportunityId) {
      await deleteOpportunity.mutateAsync(deleteOpportunityId);
      setDeleteOpportunityId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Opportunities</h1>
            <p className="text-muted-foreground mt-1">
              Manage your posted opportunities and applications
            </p>
          </div>
          <Button onClick={() => navigate("/opportunities/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        </div>

        <Tabs defaultValue="posted" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posted" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Posted Opportunities
              {myOpportunities && myOpportunities.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {myOpportunities.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              My Applications
              {myApplications && myApplications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {myApplications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Posted Opportunities Tab */}
          <TabsContent value="posted">
            {isLoadingOpportunities ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : myOpportunities && myOpportunities.length > 0 ? (
              <div className="space-y-4">
                {myOpportunities.map((opportunity) => {
                  const applicationCount = opportunity.applications?.length || 0;
                  return (
                    <Card key={opportunity.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {opportunity.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={statusColors[opportunity.status] || ""}
                            >
                              {opportunity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.opportunity_type} ·{" "}
                            {format(new Date(opportunity.created_at), "MMM d, yyyy")}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {applicationCount} application{applicationCount !== 1 ? "s" : ""}
                            </span>
                            <span>{opportunity.view_count || 0} views</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/opportunities/${opportunity.slug}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => navigate(`/opportunities/edit/${opportunity.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteOpportunityId(opportunity.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No opportunities yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Post your first opportunity to find creative talent
                  </p>
                  <Button onClick={() => navigate("/opportunities/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Opportunity
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            {isLoadingApplications ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : myApplications && myApplications.length > 0 ? (
              <div className="space-y-4">
                {myApplications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="font-semibold truncate cursor-pointer hover:text-primary"
                            onClick={() =>
                              application.opportunity &&
                              navigate(`/opportunities/${application.opportunity.slug}`)
                            }
                          >
                            {application.opportunity?.title || "Unknown Opportunity"}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={applicationStatusColors[application.status] || ""}
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {application.opportunity?.location?.name ||
                            application.opportunity?.poster?.full_name ||
                            "Unknown"}{" "}
                          · Applied {format(new Date(application.created_at), "MMM d, yyyy")}
                        </p>
                      </div>

                      {/* View Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          application.opportunity &&
                          navigate(`/opportunities/${application.opportunity.slug}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No applications yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Browse opportunities and apply to start tracking your applications
                  </p>
                  <Button onClick={() => navigate("/opportunities")}>
                    Browse Opportunities
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteOpportunityId}
        onOpenChange={() => setDeleteOpportunityId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opportunity? This action cannot be
              undone. All applications will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyOpportunities;
