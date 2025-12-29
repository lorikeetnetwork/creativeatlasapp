import { useState } from 'react';
import { useAllMemberProfiles } from '@/hooks/useCollaboratorContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Loader2, User, CheckCircle, XCircle, Briefcase, Users, GraduationCap } from 'lucide-react';

export function CommunityTab() {
  const { data: members, isLoading } = useAllMemberProfiles();
  const [search, setSearch] = useState('');

  const filteredMembers = members?.filter(member =>
    member.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    member.tagline?.toLowerCase().includes(search.toLowerCase()) ||
    member.primary_discipline?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Member</TableHead>
              <TableHead className="hidden md:table-cell">Discipline</TableHead>
              <TableHead className="hidden sm:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Flags</TableHead>
              <TableHead>Public</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.display_name || 'Unnamed'}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {member.tagline}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {member.primary_discipline ? (
                      <Badge variant="outline" className="text-xs">
                        {member.primary_discipline}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {member.suburb && member.state ? `${member.suburb}, ${member.state}` : '-'}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-1">
                      {member.is_available_for_hire && (
                        <Badge variant="outline" className="text-xs" title="Available for Hire">
                          <Briefcase className="h-3 w-3" />
                        </Badge>
                      )}
                      {member.is_available_for_collaboration && (
                        <Badge variant="outline" className="text-xs" title="Open to Collaborate">
                          <Users className="h-3 w-3" />
                        </Badge>
                      )}
                      {member.is_mentor && (
                        <Badge variant="outline" className="text-xs" title="Mentor">
                          <GraduationCap className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.is_public ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
