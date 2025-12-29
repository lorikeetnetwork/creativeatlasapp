import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCollaboratorRole() {
  const [isCollaborator, setIsCollaborator] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRoles();
  }, []);

  const checkRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsCollaborator(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check both roles in parallel
      const [collaboratorResult, adminResult] = await Promise.all([
        supabase.rpc('has_role', { _user_id: user.id, _role: 'collaborator' }),
        supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
      ]);

      setIsCollaborator(collaboratorResult.data ?? false);
      setIsAdmin(adminResult.data ?? false);
    } catch (error) {
      console.error('Error checking roles:', error);
      setIsCollaborator(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = isCollaborator || isAdmin;

  return { isCollaborator, isAdmin, hasAccess, loading, refetch: checkRoles };
}
