import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Briefcase, Users, GraduationCap } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { BentoCard } from '@/components/ui/bento-card';

type MemberProfile = Database['public']['Tables']['member_profiles']['Row'];

interface MemberCardProps {
  member: MemberProfile;
}

export function MemberCard({ member }: MemberCardProps) {
  const navigate = useNavigate();

  const initials = member.display_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const location = [member.suburb, member.state].filter(Boolean).join(', ');

  return (
    <BentoCard
      className="p-0 overflow-hidden"
      onClick={() => navigate(`/community/profile/${member.id}`)}
    >
      {member.banner_url && (
        <div className="h-24 overflow-hidden">
          <img
            src={member.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={`p-6 ${member.banner_url ? '-mt-8' : ''}`}>
        <div className="flex items-start gap-4">
          <Avatar className={`h-16 w-16 border-4 border-[#1a1a1a] ${member.banner_url ? 'ring-2 ring-[#333]' : ''}`}>
            <AvatarImage src={member.avatar_url || undefined} alt={member.display_name || 'Member'} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-white truncate">
              {member.display_name || 'Anonymous'}
            </h3>
            {member.tagline && (
              <p className="text-sm text-gray-400 line-clamp-1">
                {member.tagline}
              </p>
            )}
          </div>
        </div>

        {member.primary_discipline && (
          <Badge variant="secondary" className="mt-4">
            {member.primary_discipline}
          </Badge>
        )}

        {location && (
          <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {member.is_available_for_hire && (
            <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
              <Briefcase className="h-3 w-3 mr-1" />
              Available for Hire
            </Badge>
          )}
          {member.is_available_for_collaboration && (
            <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
              <Users className="h-3 w-3 mr-1" />
              Open to Collaborate
            </Badge>
          )}
          {member.is_mentor && (
            <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
              <GraduationCap className="h-3 w-3 mr-1" />
              Mentor
            </Badge>
          )}
        </div>

        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-[#333]">
            {member.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-[#222]">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-[#222]">
                +{member.skills.length - 4}
              </Badge>
            )}
          </div>
        )}
      </div>
    </BentoCard>
  );
}
