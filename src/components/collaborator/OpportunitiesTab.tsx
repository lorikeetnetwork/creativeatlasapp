import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllOpportunities } from '@/hooks/useCollaboratorContent';
import { useDeleteOpportunity, useUpdateOpportunity } from '@/hooks/useOpportunityMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function OpportunitiesTab() {
  const navigate = useNavigate();
  const { data: opportunities, isLoading } = useAllOpportunities();
  const deleteOpportunity = useDeleteOpportunity();
  const updateOpportunity = useUpdateOpportunity();
  const [search, setSearch] = useState('');

  const filteredOpportunities = opportunities?.filter(opp =>
    opp.title.toLowerCase().includes(search.toLowerCase()) ||
    opp.poster?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (opp: any) => {
    const newStatus = opp.status === 'open' ? 'closed' : 'open';
    updateOpportunity.mutate({
      id: opp.id,
      status: newStatus,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Open</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Closed</Badge>;
      case 'filled':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Filled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => navigate('/opportunities/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Opportunity
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Poster</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpportunities?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No opportunities found
                </TableCell>
              </TableRow>
            ) : (
              filteredOpportunities?.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">{opp.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {opp.poster?.full_name || opp.poster?.email || 'Unknown'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="capitalize">
                      {opp.opportunity_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {opp.applications?.length ?? 0}
                  </TableCell>
                  <TableCell>{getStatusBadge(opp.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/opportunities/edit/${opp.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(opp)}>
                          {opp.status === 'open' ? (
                            <>
                              <XCircle className="h-4 w-4 mr-2" />
                              Close
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Reopen
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteOpportunity.mutate(opp.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
