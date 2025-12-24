import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, List, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import CalendarView from "@/components/events/CalendarView";
import { useEvents, type EventFilters as EventFiltersType } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Events = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [filters, setFilters] = useState<EventFiltersType>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: events, isLoading } = useEvents(filters);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover creative industry events across Australia
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {isAuthenticated && (
              <Button onClick={() => navigate("/events/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : view === "list" ? (
          <>
            {events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No events found</h2>
                <p className="text-muted-foreground mb-6">
                  {Object.keys(filters).length > 0
                    ? "Try adjusting your filters to see more events."
                    : "Be the first to create an event!"}
                </p>
                {isAuthenticated && (
                  <Button onClick={() => navigate("/events/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <CalendarView
            events={events || []}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onEventClick={(event) => navigate(`/events/${event.slug}`)}
          />
        )}
      </main>
    </div>
  );
};

export default Events;
