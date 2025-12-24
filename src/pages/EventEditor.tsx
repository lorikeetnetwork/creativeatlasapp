import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EventImageUpload from "@/components/events/EventImageUpload";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEventMutations";
import { useEventById } from "@/hooks/useEvent";
import { Constants } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const eventTypes = Constants.public.Enums.event_type;
const eventStatuses = Constants.public.Enums.event_status;
const categories = Constants.public.Enums.location_category;

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  excerpt: z.string().optional(),
  description: z.string().optional(),
  cover_image_url: z.string().optional(),
  event_type: z.enum(eventTypes as unknown as [string, ...string[]]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  is_online: z.boolean().default(false),
  online_url: z.string().optional(),
  is_free: z.boolean().default(true),
  ticket_url: z.string().optional(),
  ticket_price_min: z.number().optional(),
  ticket_price_max: z.number().optional(),
  category: z.string().optional(),
  status: z.enum(eventStatuses as unknown as [string, ...string[]]).default("draft"),
});

type EventFormValues = z.infer<typeof eventSchema>;

const EventEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: existingEvent, isLoading: isLoadingEvent } = useEventById(id);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      description: "",
      event_type: "other",
      start_date: "",
      is_online: false,
      is_free: true,
      status: "draft",
    },
  });

  // Check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  // Populate form with existing event data
  useEffect(() => {
    if (existingEvent) {
      form.reset({
        title: existingEvent.title,
        excerpt: existingEvent.excerpt || "",
        description: existingEvent.description || "",
        cover_image_url: existingEvent.cover_image_url || "",
        event_type: existingEvent.event_type,
        start_date: existingEvent.start_date,
        end_date: existingEvent.end_date || "",
        start_time: existingEvent.start_time || "",
        end_time: existingEvent.end_time || "",
        venue_name: existingEvent.venue_name || "",
        venue_address: existingEvent.venue_address || "",
        is_online: existingEvent.is_online || false,
        online_url: existingEvent.online_url || "",
        is_free: existingEvent.is_free ?? true,
        ticket_url: existingEvent.ticket_url || "",
        ticket_price_min: existingEvent.ticket_price_min || undefined,
        ticket_price_max: existingEvent.ticket_price_max || undefined,
        category: existingEvent.category || "",
        status: existingEvent.status,
      });
    }
  }, [existingEvent, form]);

  const onSubmit = async (data: EventFormValues) => {
    const eventData = {
      ...data,
      category: data.category || null,
      ticket_price_min: data.ticket_price_min || null,
      ticket_price_max: data.ticket_price_max || null,
      end_date: data.end_date || null,
      start_time: data.start_time || null,
      end_time: data.end_time || null,
      venue_name: data.venue_name || null,
      venue_address: data.venue_address || null,
      online_url: data.online_url || null,
      ticket_url: data.ticket_url || null,
      excerpt: data.excerpt || null,
      description: data.description || null,
      cover_image_url: data.cover_image_url || null,
    };

    if (isEditing && id) {
      await updateEvent.mutateAsync({ id, ...eventData } as any);
      navigate(`/events/${existingEvent?.slug}`);
    } else {
      const newEvent = await createEvent.mutateAsync(eventData as any);
      navigate(`/events/${newEvent.slug}`);
    }
  };

  const isOnline = form.watch("is_online");
  const isFree = form.watch("is_free");
  const status = form.watch("status");

  if (isEditing && isLoadingEvent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit Event" : "Create Event"}
            </h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <EventImageUpload
                  currentImage={form.watch("cover_image_url")}
                  onImageUploaded={(url) => form.setValue("cover_image_url", url)}
                  onImageRemoved={() => form.setValue("cover_image_url", "")}
                />
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief summary for event cards"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This appears on event cards (max 150 characters recommended)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed event description..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="event_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          For multi-day events
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_online"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Online Event</FormLabel>
                        <FormDescription>
                          This event takes place online
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isOnline ? (
                  <FormField
                    control={form.control}
                    name="online_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Online Event URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://zoom.us/j/..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Link to join the online event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="venue_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter venue name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="venue_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter full address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Tickets & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Tickets & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="is_free"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Free Event</FormLabel>
                        <FormDescription>
                          This event is free to attend
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!isFree && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ticket_price_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value) || undefined)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ticket_price_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value) || undefined)
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty if single price
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="ticket_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://eventbrite.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Link to purchase tickets
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Publishing */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Only published events are visible to the public
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createEvent.isPending || updateEvent.isPending}
              >
                {(createEvent.isPending || updateEvent.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default EventEditor;
