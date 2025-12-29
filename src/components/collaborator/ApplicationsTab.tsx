import { useState } from 'react';
import { format } from 'date-fns';
import { useCollaboratorApplications, CollaboratorApplication } from '@/hooks/useCollaboratorApplications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Eye, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
  approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
};

const contributionLabels: Record<string, string> = {
  content: 'Content curation',
  locations: 'Location management',
  community: 'Community engagement',
  showcases: 'Showcase reviews',
  outreach: 'Outreach & partnerships',
  mentorship: 'Mentorship',
};

export function ApplicationsTab() {
  const { applications, isLoading, approveApplication, rejectApplication } = useCollaboratorApplications();
  const [selectedApplication, setSelectedApplication] = useState<CollaboratorApplication | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [applicationToReject, setApplicationToReject] = useState<CollaboratorApplication | null>(null);

  const pendingApplications = applications?.filter(app => app.status === 'pending') || [];
  const reviewedApplications = applications?.filter(app => app.status !== 'pending') || [];

  const handleApprove = async (application: CollaboratorApplication) => {
    await approveApplication.mutateAsync({
      applicationId: application.id,
      userId: application.user_id,
    });
    setSelectedApplication(null);
  };

  const handleRejectClick = (application: CollaboratorApplication) => {
    setApplicationToReject(application);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!applicationToReject) return;
    
    await rejectApplication.mutateAsync({
      applicationId: applicationToReject.id,
      reviewNotes: rejectNotes || undefined,
    });
    
    setRejectDialogOpen(false);
    setRejectNotes('');
    setApplicationToReject(null);
    setSelectedApplication(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Applications ({pendingApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending applications</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.full_name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.location || '-'}</TableCell>
                    <TableCell>{format(new Date(app.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Reviewed Applications ({reviewedApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedApplications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No reviewed applications yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewedApplications.map((app) => {
                  const config = statusConfig[app.status];
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>
                          <config.icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.reviewed_at ? format(new Date(app.reviewed_at), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Application: {selectedApplication.full_name}
                  <Badge variant={statusConfig[selectedApplication.status].variant}>
                    {statusConfig[selectedApplication.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Submitted on {format(new Date(selectedApplication.created_at), 'MMMM d, yyyy')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p>{selectedApplication.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                    <p>{selectedApplication.location || '-'}</p>
                  </div>
                </div>

                {/* Portfolio */}
                {selectedApplication.portfolio_url && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Portfolio</h4>
                    <a 
                      href={selectedApplication.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {selectedApplication.portfolio_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* Disciplines */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Disciplines</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplication.disciplines.map((d) => (
                      <Badge key={d} variant="outline">{d}</Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {selectedApplication.experience_summary && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Experience</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.experience_summary}</p>
                  </div>
                )}

                {/* Motivation */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Motivation</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedApplication.motivation}</p>
                </div>

                {/* Contribution Areas */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Contribution Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplication.contribution_areas.map((c) => (
                      <Badge key={c} variant="secondary">
                        {contributionLabels[c] || c}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Availability</h4>
                  <p>{selectedApplication.hours_per_week || '-'}</p>
                </div>

                {/* References */}
                {selectedApplication.references_info && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">References</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.references_info}</p>
                  </div>
                )}

                {/* Review Notes */}
                {selectedApplication.review_notes && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Review Notes</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedApplication.review_notes}</p>
                  </div>
                )}
              </div>

              {selectedApplication.status === 'pending' && (
                <DialogFooter className="flex gap-2 mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectClick(selectedApplication)}
                    disabled={rejectApplication.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedApplication)}
                    disabled={approveApplication.isPending}
                  >
                    {approveApplication.isPending ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this application? You can optionally add notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Optional notes about the rejection..."
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectNotes('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectApplication.isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : null}
              Reject Application
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
