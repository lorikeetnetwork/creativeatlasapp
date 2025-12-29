import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, MapPin, Image, MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoContentCard,
  BentoSidebarCard,
} from '@/components/ui/bento-page-layout';

interface Location {
  id: string;
  name: string;
  status: string;
  category: string;
  suburb: string;
  state: string;
}

export default function EntityDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  const checkAccessAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check if user has creative_entity account type
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .single();

      if (profile?.account_type !== 'creative_entity') {
        toast({
          title: 'Access Denied',
          description: 'This dashboard is for Creative Entities only.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setHasAccess(true);

      // Fetch user's locations
      const { data: userLocations, error } = await supabase
        .from('locations')
        .select('id, name, status, category, suburb, state')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(userLocations || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
      <Navbar />
      <BentoMain className="container mx-auto max-w-6xl">
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
          icon={<Building2 className="h-8 w-8" />}
          title="Creative Entity Dashboard"
          description="Manage your business listings and profile"
        />

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <BentoContentCard title="Your Locations" className="md:col-span-2">
            {locations.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No locations yet</p>
                <Button onClick={() => navigate('/submit-location')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Location
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{location.name}</h3>
                        {getStatusBadge(location.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {location.category} • {location.suburb}, {location.state}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/business/${location.id}`)}
                      >
                        View Profile
                      </Button>
                      {location.status === 'Active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/location/${location.id}`)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </BentoContentCard>

          <BentoSidebarCard title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/submit-location')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Location
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/map')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
            </div>
          </BentoSidebarCard>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <BentoContentCard title="Analytics" headerActions={<Image className="w-5 h-5 text-muted-foreground" />}>
            <div className="text-center py-8">
              <p className="text-2xl font-bold text-primary">
                {locations.filter(l => l.status === 'Active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
          </BentoContentCard>

          <BentoContentCard title="Profile Views" headerActions={<Building2 className="w-5 h-5 text-muted-foreground" />}>
            <div className="text-center py-8">
              <p className="text-2xl font-bold text-primary">-</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </BentoContentCard>

          <BentoContentCard title="Inquiries" headerActions={<MessageSquare className="w-5 h-5 text-muted-foreground" />}>
            <div className="text-center py-8">
              <p className="text-2xl font-bold text-primary">-</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </BentoContentCard>
        </div>
      </BentoMain>
    </BentoPage>
  );
}
