import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Plus, Shuffle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ArtistCard } from '@/components/discovery/ArtistCard';
import { DiscoveryFilters } from '@/components/discovery/DiscoveryFilters';
import { useArtistDiscovery, type ArtistFilters } from '@/hooks/useArtistDiscovery';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

export default function ArtistDiscovery() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [filters, setFilters] = useState<ArtistFilters>({});
  const [shuffleKey, setShuffleKey] = useState(0);

  const { data: artists, isLoading } = useArtistDiscovery(filters, shuffleKey);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleShuffle = () => {
    setShuffleKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />

      <main className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Artist & Creative Discovery
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover, explore, and connect with artists and creatives across Australia. 
                A community-first directory celebrating the depth and diversity of Australian 
                creative practice—without algorithms, popularity metrics, or social noise.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleShuffle}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
              {session && (
                <Button
                  onClick={() => navigate('/community/edit-profile')}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Submit Your Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <DiscoveryFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        ) : artists && artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted rounded-full mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No artists found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Try adjusting your filters or check back later as more creatives join the directory.
            </p>
            <Button variant="outline" onClick={() => setFilters({})}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Footer CTA */}
        {artists && artists.length > 0 && (
          <div className="mt-16 text-center py-12 border-t border-border">
            <h3 className="text-xl font-semibold mb-2">Know a creative who should be here?</h3>
            <p className="text-muted-foreground mb-4">
              Help us grow the directory by suggesting artists and creatives from your community.
            </p>
            <Button variant="outline" onClick={() => navigate('/collaborate')}>
              Suggest a Creative
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
