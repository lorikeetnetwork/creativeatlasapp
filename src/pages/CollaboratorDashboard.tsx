import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoContentCard,
} from '@/components/ui/bento-page-layout';
import { useCollaboratorRole } from '@/hooks/useCollaboratorRole';
import { CollaboratorStats } from '@/components/collaborator/CollaboratorStats';
import { EventsTab } from '@/components/collaborator/EventsTab';
import { OpportunitiesTab } from '@/components/collaborator/OpportunitiesTab';
import { ArticlesTab } from '@/components/collaborator/ArticlesTab';
import { CommunityTab } from '@/components/collaborator/CommunityTab';
import { ShowcasesTab } from '@/components/collaborator/ShowcasesTab';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Palette, Calendar, Briefcase, FileText, Users, Award } from 'lucide-react';

export default function CollaboratorDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAccess, loading, isAdmin } = useCollaboratorRole();

  useEffect(() => {
    if (!loading && !hasAccess) {
      toast({
        title: 'Access Denied',
        description: "You don't have permission to access the collaborator dashboard.",
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [loading, hasAccess, navigate, toast]);

  if (loading) {
    return (
      <BentoPage>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BentoPage>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <BentoPage>
      <BentoMain className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <BentoPageHeader
          icon={<Palette className="h-8 w-8" />}
          title="Collaborator Dashboard"
          description="Manage events, opportunities, articles, and community content"
          actions={
            isAdmin && (
              <Button variant="outline" onClick={() => navigate('/admin')}>
                Admin Dashboard
              </Button>
            )
          }
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="relative">
            <ScrollArea className="w-full">
              <TabsList className="inline-flex w-auto min-w-full bg-[#1a1a1a] border border-[#333] p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Events</span>
                </TabsTrigger>
                <TabsTrigger value="opportunities" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Opportunities</span>
                </TabsTrigger>
                <TabsTrigger value="articles" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Blog</span>
                </TabsTrigger>
                <TabsTrigger value="community" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Community</span>
                </TabsTrigger>
                <TabsTrigger value="showcases" className="data-[state=active]:bg-[#333] data-[state=active]:text-white text-gray-400 whitespace-nowrap px-4 text-sm gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Showcases</span>
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none lg:hidden" />
          </div>

          <TabsContent value="overview" className="space-y-6">
            <CollaboratorStats />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <BentoContentCard title="Quick Actions" className="p-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/events/new')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/opportunities/new')}>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post Opportunity
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/blog/new')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Write Article
                  </Button>
                </div>
              </BentoContentCard>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <BentoContentCard>
              <EventsTab />
            </BentoContentCard>
          </TabsContent>

          <TabsContent value="opportunities">
            <BentoContentCard>
              <OpportunitiesTab />
            </BentoContentCard>
          </TabsContent>

          <TabsContent value="articles">
            <BentoContentCard>
              <ArticlesTab />
            </BentoContentCard>
          </TabsContent>

          <TabsContent value="community">
            <BentoContentCard>
              <CommunityTab />
            </BentoContentCard>
          </TabsContent>

          <TabsContent value="showcases">
            <BentoContentCard>
              <ShowcasesTab />
            </BentoContentCard>
          </TabsContent>
        </Tabs>
      </BentoMain>
    </BentoPage>
  );
}
