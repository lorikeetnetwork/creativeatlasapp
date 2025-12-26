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
                <TabsList className="bg-[#222] border border-[#333]">
                  <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-[#333] data-[state=active]:text-white">
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-[#333] data-[state=active]:text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative p-4 rounded-xl border border-[#333] bg-[#1a1a1a] space-y-3">
                <Skeleton className="aspect-video rounded-lg bg-[#333]" />
                <Skeleton className="h-6 w-3/4 bg-[#333]" />
                <Skeleton className="h-4 w-1/2 bg-[#333]" />
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
