import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin,
  Briefcase,
  Users,
  GraduationCap,
  Globe,
  Instagram,
  Linkedin,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Edit,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { PortfolioGrid } from '@/components/community/PortfolioGrid';
import { SkillBadges } from '@/components/community/SkillBadges';
import { useMemberProfile, useMemberPortfolioItems } from '@/hooks/useMemberProfiles';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { BentoPage, BentoContentCard } from '@/components/ui/bento-page-layout';

export default function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  const { data: member, isLoading } = useMemberProfile(id || '');
  const { data: portfolioItems = [] } = useMemberPortfolioItems(id || '');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isOwner = session?.user?.id === member?.user_id;

  if (isLoading) {
    return (
      <BentoPage>
        <Navbar session={session} />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-48 w-full mb-8" />
          <div className="flex items-start gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </main>
      </BentoPage>
    );
  }

  if (!member) {
    return (
      <BentoPage>
        <Navbar session={session} />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Member not found</h1>
          <Button onClick={() => navigate('/community')}>Back to Community</Button>
        </main>
      </BentoPage>
    );
  }

  const initials = member.display_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const location = member.show_location !== false ? [member.suburb, member.state].filter(Boolean).join(', ') : '';

  return (
    <BentoPage>
      <Navbar session={session} />

      {member.banner_url && (
        <div className="h-48 md:h-64 overflow-hidden">
          <img
            src={member.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/community')}
          className="mb-6 gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Button>

        <BentoContentCard className={member.banner_url ? '-mt-20 md:-mt-16' : ''}>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className={`h-32 w-32 border-4 border-[#1a1a1a] ${member.banner_url ? 'ring-4 ring-[#333]' : ''}`}>
              <AvatarImage src={member.avatar_url || undefined} alt={member.display_name || 'Member'} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {member.display_name || 'Anonymous'}
                  </h1>
                  {member.tagline && (
                    <p className="text-lg text-gray-400 mt-1">
                      {member.tagline}
                    </p>
                  )}
                </div>
                {isOwner && (
                  <Button onClick={() => navigate('/community/edit-profile')} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {member.primary_discipline && (
                  <Badge variant="secondary" className="text-sm">
                    {member.primary_discipline}
                  </Badge>
                )}
                {member.experience_years && (
                  <Badge variant="outline" className="text-sm gap-1 border-[#333] text-gray-300">
                    <Calendar className="h-3 w-3" />
                    {member.experience_years}+ years
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {member.is_available_for_hire && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                    <Briefcase className="h-3 w-3 mr-1" />
                    Available for Hire
                  </Badge>
                )}
                {member.is_available_for_collaboration && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                    <Users className="h-3 w-3 mr-1" />
                    Open to Collaborate
                  </Badge>
                )}
                {member.is_mentor && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Mentor
                  </Badge>
                )}
              </div>

              {location && (
                <div className="flex items-center gap-2 mt-4 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                {member.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(member.website!, '_blank')}
                    className="gap-1.5 border-[#333] text-white hover:bg-[#222]"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </Button>
                )}
                {member.portfolio_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(member.portfolio_url!, '_blank')}
                    className="gap-1.5 border-[#333] text-white hover:bg-[#222]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Portfolio
                  </Button>
                )}
                {member.instagram && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://instagram.com/${member.instagram}`, '_blank')}
                    className="gap-1.5 border-[#333] text-white hover:bg-[#222]"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Button>
                )}
                {member.linkedin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(member.linkedin!, '_blank')}
                    className="gap-1.5 border-[#333] text-white hover:bg-[#222]"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </div>
        </BentoContentCard>

        {member.bio && (
          <BentoContentCard title="About" className="mt-6">
            <p className="text-gray-400 whitespace-pre-wrap">{member.bio}</p>
          </BentoContentCard>
        )}

        {member.skills && member.skills.length > 0 && (
          <BentoContentCard title="Skills" className="mt-6">
            <SkillBadges skills={member.skills} />
          </BentoContentCard>
        )}

        {portfolioItems.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-6 text-white">Portfolio</h2>
            <PortfolioGrid items={portfolioItems} />
          </section>
        )}
      </main>
    </BentoPage>
  );
}
