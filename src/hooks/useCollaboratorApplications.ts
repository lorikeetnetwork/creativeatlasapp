import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CollaboratorApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  location: string | null;
  disciplines: string[];
  portfolio_url: string | null;
  experience_summary: string | null;
  motivation: string;
  contribution_areas: string[];
  hours_per_week: string | null;
  references_info: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useCollaboratorApplications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all applications (for collaborators/admins)
  const { data: applications, isLoading } = useQuery({
    queryKey: ['collaborator-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CollaboratorApplication[];
    },
  });

  // Fetch user's own application
  const useMyApplication = () => {
    return useQuery({
      queryKey: ['my-collaborator-application'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
          .from('collaborator_applications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        return data as CollaboratorApplication | null;
      },
    });
  };

  // Submit application
  const submitApplication = useMutation({
    mutationFn: async (application: Omit<CollaboratorApplication, 'id' | 'status' | 'reviewed_by' | 'reviewed_at' | 'review_notes' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('collaborator_applications')
        .insert(application)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-collaborator-application'] });
      toast({
        title: 'Application Submitted',
        description: 'Your collaborator application has been submitted for review.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    },
  });

  // Approve application
  const approveApplication = useMutation({
    mutationFn: async ({ applicationId, userId }: { applicationId: string; userId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update application status
      const { error: updateError } = await supabase
        .from('collaborator_applications')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Grant collaborator role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'collaborator',
        });

      if (roleError && !roleError.message.includes('duplicate')) {
        throw roleError;
      }

      return { applicationId, userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-applications'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Application Approved',
        description: 'The applicant has been granted collaborator access.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve application',
        variant: 'destructive',
      });
    },
  });

  // Reject application
  const rejectApplication = useMutation({
    mutationFn: async ({ applicationId, reviewNotes }: { applicationId: string; reviewNotes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('collaborator_applications')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes,
        })
        .eq('id', applicationId);

      if (error) throw error;
      return applicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-applications'] });
      toast({
        title: 'Application Rejected',
        description: 'The application has been rejected.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject application',
        variant: 'destructive',
      });
    },
  });

  return {
    applications,
    isLoading,
    useMyApplication,
    submitApplication,
    approveApplication,
    rejectApplication,
  };
}
