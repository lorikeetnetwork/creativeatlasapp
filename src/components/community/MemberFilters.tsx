import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Briefcase, Users, GraduationCap } from 'lucide-react';

const DISCIPLINES = [
  'Music Venues',
  'Recording Studios',
  'Art Galleries',
  'Design Studios',
  'Film & TV Production Companies',
  'Photography Studios',
  'Education & Training Providers',
  'Other',
];

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

interface MemberFiltersProps {
  filters: {
    discipline?: string;
    availableForHire?: boolean;
    availableForCollaboration?: boolean;
    isMentor?: boolean;
    state?: string;
    search?: string;
  };
  onFiltersChange: (filters: MemberFiltersProps['filters']) => void;
}

export function MemberFilters({ filters, onFiltersChange }: MemberFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleFilter = (key: 'availableForHire' | 'availableForCollaboration' | 'isMentor') => {
    onFiltersChange({ ...filters, [key]: filters[key] ? undefined : true });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.discipline ||
    filters.availableForHire ||
    filters.availableForCollaboration ||
    filters.isMentor ||
    filters.state ||
    filters.search;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <Select
          value={filters.discipline || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, discipline: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Discipline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Disciplines</SelectItem>
            {DISCIPLINES.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.state || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, state: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={filters.availableForHire ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('availableForHire')}
          className="gap-1.5"
          title="Available for Hire"
        >
          <Briefcase className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Hire</span>
        </Button>

        <Button
          variant={filters.availableForCollaboration ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('availableForCollaboration')}
          className="gap-1.5"
          title="Open to Collaborate"
        >
          <Users className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Collab</span>
        </Button>

        <Button
          variant={filters.isMentor ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('isMentor')}
          className="gap-1.5"
          title="Mentors"
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Mentors</span>
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="col-span-2 sm:col-span-1 gap-1.5">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearchInput('');
                  onFiltersChange({ ...filters, search: undefined });
                }}
              />
            </Badge>
          )}
          {filters.discipline && (
            <Badge variant="secondary" className="gap-1">
              {filters.discipline}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, discipline: undefined })}
              />
            </Badge>
          )}
          {filters.state && (
            <Badge variant="secondary" className="gap-1">
              {filters.state}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, state: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
