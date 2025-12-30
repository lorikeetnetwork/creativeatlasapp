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
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoFilterCard,
  BentoEmptyState,
} from "@/components/ui/bento-page-layout";

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
    <BentoPage>
      <Navbar session={session} />

      <BentoMain>
        <BentoPageHeader
          icon={<Users className="h-8 w-8" />}
          title="Community Directory"
          description="Discover and connect with creative professionals in the community"
          actions={
            session && (
              <Button 
                onClick={() => navigate('/community/edit-profile')} 
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {currentProfile ? 'Edit Profile' : <><Plus className="h-4 w-4" /> Create Profile</>}
              </Button>
            )
          }
        />

        <BentoFilterCard>
          <MemberFilters filters={filters} onFiltersChange={setFilters} />
        </BentoFilterCard>

        <div className="mt-2">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="relative border-2 border-neutral-800 bg-card overflow-hidden">
                  <Skeleton className="h-24 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <BentoEmptyState
              icon={<Users className="h-16 w-16" />}
              title="No members found"
              description={
                Object.keys(filters).length > 0
                  ? 'Try adjusting your filters to find more members.'
                  : 'Be the first to create a profile and join the community!'
              }
              action={
                session && !currentProfile && (
                  <Button onClick={() => navigate('/community/edit-profile')} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Create Your Profile
                  </Button>
                )
              }
            />
          )}
        </div>
      </BentoMain>
    </BentoPage>
  );
}
