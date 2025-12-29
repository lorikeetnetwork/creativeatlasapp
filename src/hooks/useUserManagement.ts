import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  isCollaborator: boolean;
  isMaster: boolean;
}

interface InviteUserParams {
  email: string;
  fullName: string;
  role: string;
}

interface InviteResult {
  success: boolean;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  password: string;
  warning?: string;
}

export function useUserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const collaboratorUserIds = new Set(
        roles?.filter(r => r.role === 'collaborator').map(r => r.user_id) || []
      );
      const masterUserIds = new Set(
        roles?.filter(r => r.role === 'master').map(r => r.user_id) || []
      );

      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        created_at: profile.created_at,
        isCollaborator: collaboratorUserIds.has(profile.id),
        isMaster: masterUserIds.has(profile.id),
      }));

      return usersWithRoles;
    },
  });

  const grantCollaboratorRole = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'collaborator' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({
        title: 'Role granted',
        description: 'User has been granted collaborator access.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to grant role',
        variant: 'destructive',
      });
    },
  });

  const revokeCollaboratorRole = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'collaborator');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({
        title: 'Role revoked',
        description: 'Collaborator access has been revoked.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to revoke role',
        variant: 'destructive',
      });
    },
  });

  const inviteUser = useMutation({
    mutationFn: async (params: InviteUserParams): Promise<InviteResult> => {
      const { data, error } = await supabase.functions.invoke('invite-user', {
        body: params,
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      return data as InviteResult;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      if (data.warning) {
        toast({
          title: 'User created with warning',
          description: data.warning,
          variant: 'default',
        });
      } else {
        toast({
          title: 'User invited successfully',
          description: `${data.email} has been invited as a ${data.role}.`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to invite user',
        variant: 'destructive',
      });
    },
  });

  return {
    users,
    isLoading,
    grantCollaboratorRole,
    revokeCollaboratorRole,
    inviteUser,
  };
}
