import { Badge } from '@/components/ui/badge';

interface SkillBadgesProps {
  skills: string[];
  maxDisplay?: number;
  size?: 'sm' | 'default';
}

export function SkillBadges({ skills, maxDisplay, size = 'default' }: SkillBadgesProps) {
  const displaySkills = maxDisplay ? skills.slice(0, maxDisplay) : skills;
  const remaining = maxDisplay ? skills.length - maxDisplay : 0;

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displaySkills.map((skill) => (
        <Badge
          key={skill}
          variant="secondary"
          className={size === 'sm' ? 'text-xs px-2 py-0.5' : 'px-3 py-1'}
        >
          {skill}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge
          variant="outline"
          className={size === 'sm' ? 'text-xs px-2 py-0.5' : 'px-3 py-1'}
        >
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}
