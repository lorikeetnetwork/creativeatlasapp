import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Ticket,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/events/EventCard";
import { useMyEvents, useMyRSVPs } from "@/hooks/useEvents";
import { useDeleteEvent } from "@/hooks/useEventMutations";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/20 text-yellow-400",
  published: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  completed: "bg-gray-500/20 text-gray-400",
};

const MyEvents = () => {
  const navigate = useNavigate();
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  
  const { data: myEvents, isLoading: isLoadingEvents } = useMyEvents();
  const { data: myRSVPs, isLoading: isLoadingRSVPs } = useMyRSVPs();
  const deleteEvent = useDeleteEvent();

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleDelete = async () => {
    if (deleteEventId) {
      await deleteEvent.mutateAsync(deleteEventId);
      setDeleteEventId(null);
    }
  };

  const upcomingRSVPs = myRSVPs?.filter(
    (rsvp) =>
      rsvp.event &&
      new Date(rsvp.event.start_date) >= new Date() &&
      rsvp.status !== "not_going"
  );

  const pastRSVPs = myRSVPs?.filter(
    (rsvp) =>
      rsvp.event &&
      new Date(rsvp.event.start_date) < new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground mt-1">
              Manage your events and RSVPs
            </p>
          </div>
          <Button onClick={() => navigate("/events/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        <Tabs defaultValue="created" className="space-y-6">
          <TabsList>
            <TabsTrigger value="created" className="gap-2">
              <Calendar className="h-4 w-4" />
              My Created Events
              {myEvents && myEvents.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {myEvents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="attending" className="gap-2">
              <Ticket className="h-4 w-4" />
              Attending
              {upcomingRSVPs && upcomingRSVPs.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {upcomingRSVPs.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Created Events Tab */}
          <TabsContent value="created">
            {isLoadingEvents ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            ) : myEvents && myEvents.length > 0 ? (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-muted">
                        {event.cover_image_url ? (
                          <img
                            src={event.cover_image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {event.title}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={statusColors[event.status] || ""}
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.start_date), "EEE, MMM d, yyyy")}
                          {event.venue_name && ` · ${event.venue_name}`}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>
                            {event.rsvps?.filter((r) => r.status === "going").length || 0} going
                          </span>
                          <span>{event.view_count || 0} views</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/events/${event.slug}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/events/edit/${event.id}`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteEventId(event.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No events yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Create your first event to get started
                  </p>
                  <Button onClick={() => navigate("/events/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Attending Tab */}
          <TabsContent value="attending" className="space-y-8">
            {isLoadingRSVPs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                {/* Upcoming */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                  {upcomingRSVPs && upcomingRSVPs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingRSVPs.map((rsvp) =>
                        rsvp.event ? (
                          <div key={rsvp.id} className="relative">
                            <Badge
                              className="absolute top-2 right-2 z-10"
                              variant={rsvp.status === "going" ? "default" : "secondary"}
                            >
                              {rsvp.status === "going" ? "Going" : "Interested"}
                            </Badge>
                            <EventCard event={rsvp.event} />
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">
                          No upcoming events. Browse events to find something interesting!
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => navigate("/events")}
                        >
                          Browse Events
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Past */}
                {pastRSVPs && pastRSVPs.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                      {pastRSVPs.map((rsvp) =>
                        rsvp.event ? (
                          <EventCard key={rsvp.id} event={rsvp.event} />
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
              All RSVPs will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyEvents;
