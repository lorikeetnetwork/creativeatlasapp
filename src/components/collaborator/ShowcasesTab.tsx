import { useState } from 'react';
import { useAllShowcases } from '@/hooks/useCollaboratorContent';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
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
import { Search, MoreHorizontal, CheckCircle, XCircle, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ShowcasesTab() {
  const { data: showcases, isLoading } = useAllShowcases();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const filteredShowcases = showcases?.filter(showcase =>
    showcase.project_title.toLowerCase().includes(search.toLowerCase()) ||
    showcase.submitter?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('showcases')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to approve showcase', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Showcase approved' });
      queryClient.invalidateQueries({ queryKey: ['collaborator-showcases'] });
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('showcases')
      .update({ is_approved: false })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to reject showcase', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Showcase rejected' });
      queryClient.invalidateQueries({ queryKey: ['collaborator-showcases'] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('showcases')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete showcase', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Showcase deleted' });
      queryClient.invalidateQueries({ queryKey: ['collaborator-showcases'] });
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
            placeholder="Search showcases..."
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
              <TableHead>Project</TableHead>
              <TableHead className="hidden md:table-cell">Submitted By</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShowcases?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No showcases found
                </TableCell>
              </TableRow>
            ) : (
              filteredShowcases?.map((showcase) => (
                <TableRow key={showcase.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{showcase.project_title}</span>
                      {showcase.project_url && (
                        <a
                          href={showcase.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {showcase.submitter?.full_name || showcase.submitter?.email || 'Unknown'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {showcase.category ? (
                      <Badge variant="outline" className="text-xs">
                        {showcase.category}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {showcase.view_count ?? 0}
                  </TableCell>
                  <TableCell>
                    {showcase.is_approved ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!showcase.is_approved && (
                          <DropdownMenuItem onClick={() => handleApprove(showcase.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {showcase.is_approved && (
                          <DropdownMenuItem onClick={() => handleReject(showcase.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(showcase.id)}
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
