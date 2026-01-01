import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import type { ArtistFilters } from '@/hooks/useArtistDiscovery';

const ARTIST_DISCIPLINES = [
  'Music',
  'Visual Art',
  'Design',
  'Film & Video',
  'Writing',
  'Performance',
  'Creative Technology',
  'Photography',
  'Architecture',
  'Craft & Making',
  'Dance',
  'Theatre',
  'Animation',
  'Illustration',
  'Sound Art',
  'Other',
] as const;

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

const CAREER_STAGES = [
  { value: 'emerging', label: 'Emerging' },
  { value: 'mid_career', label: 'Mid-Career' },
  { value: 'established', label: 'Established' },
];

interface DiscoveryFiltersProps {
  filters: ArtistFilters;
  onFiltersChange: (filters: ArtistFilters) => void;
}

export function DiscoveryFilters({ filters, onFiltersChange }: DiscoveryFiltersProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput || undefined });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const removeFilter = (key: keyof ArtistFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    if (key === 'search') setSearchInput('');
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="space-y-4">
      {/* Main filter row */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, bio, or skills..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="secondary">
            Search
          </Button>
        </div>

        {/* Filter selects */}
        <div className="flex flex-wrap gap-2">
          {/* Discipline */}
          <Select
            value={filters.discipline || '__all__'}
            onValueChange={(v) =>
              onFiltersChange({ ...filters, discipline: v === '__all__' ? undefined : v })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Discipline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Disciplines</SelectItem>
              {ARTIST_DISCIPLINES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* State/Region */}
          <Select
            value={filters.state || '__all__'}
            onValueChange={(v) =>
              onFiltersChange({ ...filters, state: v === '__all__' ? undefined : v })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Locations</SelectItem>
              {STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Career Stage */}
          <Select
            value={filters.careerStage || '__all__'}
            onValueChange={(v) =>
              onFiltersChange({
                ...filters,
                careerStage: v === '__all__' ? undefined : (v as ArtistFilters['careerStage']),
              })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Career Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Stages</SelectItem>
              {CAREER_STAGES.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-2">
          <Button
            variant={filters.availableForHire ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              onFiltersChange({
                ...filters,
                availableForHire: filters.availableForHire ? undefined : true,
              })
            }
          >
            For Hire
          </Button>
          <Button
            variant={filters.availableForCollaboration ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              onFiltersChange({
                ...filters,
                availableForCollaboration: filters.availableForCollaboration ? undefined : true,
              })
            }
          >
            Collaborators
          </Button>
          <Button
            variant={filters.isMentor ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              onFiltersChange({
                ...filters,
                isMentor: filters.isMentor ? undefined : true,
              })
            }
          >
            Mentors
          </Button>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('search')}
              />
            </Badge>
          )}
          
          {filters.discipline && (
            <Badge variant="secondary" className="gap-1">
              {filters.discipline}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('discipline')}
              />
            </Badge>
          )}
          
          {filters.state && (
            <Badge variant="secondary" className="gap-1">
              {filters.state}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('state')}
              />
            </Badge>
          )}
          
          {filters.careerStage && (
            <Badge variant="secondary" className="gap-1">
              {CAREER_STAGES.find((s) => s.value === filters.careerStage)?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('careerStage')}
              />
            </Badge>
          )}
          
          {filters.availableForHire && (
            <Badge variant="secondary" className="gap-1">
              For Hire
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('availableForHire')}
              />
            </Badge>
          )}
          
          {filters.availableForCollaboration && (
            <Badge variant="secondary" className="gap-1">
              Collaborators
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('availableForCollaboration')}
              />
            </Badge>
          )}
          
          {filters.isMentor && (
            <Badge variant="secondary" className="gap-1">
              Mentors
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeFilter('isMentor')}
              />
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
