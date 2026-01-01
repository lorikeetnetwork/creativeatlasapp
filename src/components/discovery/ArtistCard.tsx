import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type MemberProfile = Database['public']['Tables']['member_profiles']['Row'] & {
  career_stage?: 'emerging' | 'mid_career' | 'established' | null;
  artist_disciplines?: string[] | null;
  creative_tags?: string[] | null;
};

interface ArtistCardProps {
  artist: MemberProfile;
}

const CAREER_STAGE_LABELS: Record<string, string> = {
  emerging: 'Emerging',
  mid_career: 'Mid-Career',
  established: 'Established',
};

const CAREER_STAGE_COLORS: Record<string, string> = {
  emerging: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  mid_career: 'bg-primary/10 text-primary border-primary/20',
  established: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
};

export function ArtistCard({ artist }: ArtistCardProps) {
  const navigate = useNavigate();

  const initials = artist.display_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const location = [artist.suburb, artist.state].filter(Boolean).join(', ');
  const disciplines = artist.artist_disciplines?.slice(0, 2) || [];
  const tags = artist.creative_tags?.slice(0, 3) || [];

  return (
    <div
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/community/profile/${artist.id}`)}
    >
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/30" />

      {/* Banner area */}
      <div className="h-20 bg-gradient-to-br from-muted to-muted/50 relative">
        {artist.banner_url && (
          <img
            src={artist.banner_url}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar - overlapping banner */}
      <div className="px-4 -mt-8 relative z-10">
        <Avatar className="h-16 w-16 border-4 border-card">
          <AvatarImage src={artist.avatar_url || undefined} alt={artist.display_name || ''} />
          <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="p-4 pt-3 space-y-3">
        {/* Name and career stage */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
              {artist.display_name || 'Unnamed Creative'}
            </h3>
            {artist.tagline && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {artist.tagline}
              </p>
            )}
          </div>
          {artist.career_stage && (
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${CAREER_STAGE_COLORS[artist.career_stage] || ''}`}
            >
              {CAREER_STAGE_LABELS[artist.career_stage]}
            </Badge>
          )}
        </div>

        {/* Disciplines */}
        {disciplines.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {disciplines.map((discipline) => (
              <Badge key={discipline} variant="secondary" className="text-xs">
                {discipline}
              </Badge>
            ))}
            {(artist.artist_disciplines?.length || 0) > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{(artist.artist_disciplines?.length || 0) - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Location */}
        {location && artist.show_location && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Availability badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {artist.is_available_for_hire && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>For Hire</span>
            </div>
          )}
          {artist.is_available_for_collaboration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Collaborates</span>
            </div>
          )}
          {artist.is_mentor && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <GraduationCap className="h-3 w-3" />
              <span>Mentor</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/community/profile/${artist.id}`);
          }}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}
