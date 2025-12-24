import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { MemberCard } from '@/components/community/MemberCard';
import { MemberFilters } from '@/components/community/MemberFilters';
import { useMemberProfiles, useCurrentUserMemberProfile } from '@/hooks/useMemberProfiles';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export default function Community() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [filters, setFilters] = useState<{
    discipline?: string;
    availableForHire?: boolean;
    availableForCollaboration?: boolean;
    isMentor?: boolean;
    state?: string;
    search?: string;
  }>({});

  const { data: members, isLoading } = useMemberProfiles(filters);
  const { data: currentProfile } = useCurrentUserMemberProfile();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="px-4 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Community Directory
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover and connect with creative professionals in the community
            </p>
          </div>

          {session && (
            <Button onClick={() => navigate('/community/edit-profile')} className="gap-2">
              {currentProfile ? 'Edit Profile' : <><Plus className="h-4 w-4" /> Create Profile</>}
            </Button>
          )}
        </div>

        <MemberFilters filters={filters} onFiltersChange={setFilters} />

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No members found</h3>
              <p className="text-muted-foreground mb-6">
                {Object.keys(filters).length > 0
                  ? 'Try adjusting your filters to find more members.'
                  : 'Be the first to create a profile and join the community!'}
              </p>
              {session && !currentProfile && (
                <Button onClick={() => navigate('/community/edit-profile')}>
                  Create Your Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
