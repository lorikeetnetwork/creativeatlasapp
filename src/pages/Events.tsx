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
import {
  BentoPage,
  BentoMain,
  BentoPageHeader,
  BentoFilterCard,
  BentoEmptyState,
} from "@/components/ui/bento-page-layout";

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
    <BentoPage>
      <Navbar />
      
      <BentoMain>
        {/* Header */}
        <BentoPageHeader
          icon={<Calendar className="h-8 w-8" />}
          title="Events"
          description="Discover creative industry events across Australia"
          actions={
            <div className="flex items-center gap-3">
              <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
                <TabsList className="bg-card border border-neutral-800">
                  <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground">
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {isAuthenticated && (
                <Button onClick={() => navigate("/events/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          }
        />

        {/* Filters */}
        <BentoFilterCard>
          <EventFilters filters={filters} onFiltersChange={setFilters} />
        </BentoFilterCard>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative border-2 border-neutral-800 bg-card overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : view === "list" ? (
          <>
            {events && events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <BentoEmptyState
                icon={<Calendar className="h-16 w-16" />}
                title="No events found"
                description={
                  Object.keys(filters).length > 0
                    ? "Try adjusting your filters to see more events."
                    : "Be the first to create an event!"
                }
                action={
                  isAuthenticated && (
                    <Button onClick={() => navigate("/events/new")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  )
                }
              />
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
      </BentoMain>
    </BentoPage>
  );
};

export default Events;
