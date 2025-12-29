import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCollaboratorRole() {
  const [isCollaborator, setIsCollaborator] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isMaster, setIsMaster] = useState<boolean | null>(null);
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
        setIsMaster(false);
        setLoading(false);
        return;
      }

      // Check all roles in parallel
      const [collaboratorResult, adminResult, masterResult] = await Promise.all([
        supabase.rpc('has_role', { _user_id: user.id, _role: 'collaborator' }),
        supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }),
        supabase.rpc('is_master', { _user_id: user.id })
      ]);

      setIsCollaborator(collaboratorResult.data ?? false);
      setIsAdmin(adminResult.data ?? false);
      setIsMaster(masterResult.data ?? false);
    } catch (error) {
      console.error('Error checking roles:', error);
      setIsCollaborator(false);
      setIsAdmin(false);
      setIsMaster(false);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = isCollaborator || isAdmin || isMaster;

  return { isCollaborator, isAdmin, isMaster, hasAccess, loading, refetch: checkRoles };
}
