import { useNavigate } from "react-router-dom";
import { useMyShowcases } from "@/hooks/useShowcases";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Plus, MoreHorizontal, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const MyShowcases = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: showcases, isLoading } = useMyShowcases();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("showcases").delete().eq("id", id);
    if (error) toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    else { toast({ title: "Deleted" }); queryClient.invalidateQueries({ queryKey: ["my-showcases"] }); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/showcases")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
            <h1 className="text-2xl font-bold">My Showcases</h1>
          </div>
          <Button onClick={() => navigate("/showcases/new")} className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />New Showcase</Button>
        </div>
        {isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : !showcases?.length ? (
          <div className="text-center py-16"><p className="text-muted-foreground mb-4">No showcases yet.</p><Button onClick={() => navigate("/showcases/new")} className="bg-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" />Create Your First</Button></div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader><TableRow className="bg-muted/50"><TableHead>Project</TableHead><TableHead className="hidden sm:table-cell">Status</TableHead><TableHead className="hidden lg:table-cell">Views</TableHead><TableHead className="hidden md:table-cell">Created</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
              <TableBody>
                {showcases.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell><span className="font-medium">{s.project_title}</span></TableCell>
                    <TableCell className="hidden sm:table-cell">{s.is_approved ? <Badge className="bg-green-500/20 text-green-400">Approved</Badge> : <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{s.view_count ?? 0}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{format(new Date(s.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {s.is_approved && <DropdownMenuItem onClick={() => navigate(`/showcases/${s.slug}`)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>}
                          <DropdownMenuItem onClick={() => navigate(`/showcases/edit/${s.id}`)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(s.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyShowcases;
