import { useCollaboratorStats } from '@/hooks/useCollaboratorContent';
import { Calendar, Briefcase, FileText, Users, Award, Loader2 } from 'lucide-react';

export function CollaboratorStats() {
  const { data: stats, isLoading } = useCollaboratorStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Events',
      value: stats?.totalEvents ?? 0,
      subtitle: `${stats?.publishedEvents ?? 0} published, ${stats?.draftEvents ?? 0} drafts`,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      title: 'Opportunities',
      value: stats?.totalOpportunities ?? 0,
      subtitle: `${stats?.openOpportunities ?? 0} open`,
      icon: Briefcase,
      color: 'text-green-400',
    },
    {
      title: 'Articles',
      value: stats?.totalArticles ?? 0,
      subtitle: `${stats?.publishedArticles ?? 0} published, ${stats?.draftArticles ?? 0} drafts`,
      icon: FileText,
      color: 'text-purple-400',
    },
    {
      title: 'Members',
      value: stats?.totalMembers ?? 0,
      subtitle: 'Community profiles',
      icon: Users,
      color: 'text-orange-400',
    },
    {
      title: 'Showcases',
      value: stats?.totalShowcases ?? 0,
      subtitle: `${stats?.pendingShowcases ?? 0} pending approval`,
      icon: Award,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="bg-card border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-sm text-muted-foreground">{stat.title}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
