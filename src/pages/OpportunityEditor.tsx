import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateOpportunity, useUpdateOpportunity } from "@/hooks/useOpportunityMutations";
import { useOpportunityById } from "@/hooks/useOpportunity";
import { Constants } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const opportunityTypes = Constants.public.Enums.opportunity_type;
const compensationTypes = Constants.public.Enums.compensation_type;
const experienceLevels = Constants.public.Enums.experience_level;
const opportunityStatuses = Constants.public.Enums.opportunity_status;
const categories = Constants.public.Enums.location_category;

const opportunitySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  opportunity_type: z.enum(opportunityTypes as unknown as [string, ...string[]]),
  category: z.string().optional(),
  compensation_type: z.enum(compensationTypes as unknown as [string, ...string[]]),
  compensation_details: z.string().max(200).optional(),
  application_url: z.string().url().optional().or(z.literal("")),
  application_email: z.string().email().optional().or(z.literal("")),
  deadline: z.string().optional(),
  start_date: z.string().optional(),
  is_remote: z.boolean().default(false),
  location_text: z.string().max(200).optional(),
  experience_level: z.enum(experienceLevels as unknown as [string, ...string[]]).default("any"),
  status: z.enum(opportunityStatuses as unknown as [string, ...string[]]).default("open"),
});

type OpportunityFormValues = z.infer<typeof opportunitySchema>;

const OpportunityEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: existingOpportunity, isLoading: isLoadingOpportunity } = useOpportunityById(id);
  const createOpportunity = useCreateOpportunity();
  const updateOpportunity = useUpdateOpportunity();

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: "",
      description: "",
      opportunity_type: "job",
      compensation_type: "negotiable",
      is_remote: false,
      experience_level: "any",
      status: "open",
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

  // Populate form with existing data
  useEffect(() => {
    if (existingOpportunity) {
      form.reset({
        title: existingOpportunity.title,
        description: existingOpportunity.description,
        opportunity_type: existingOpportunity.opportunity_type,
        category: existingOpportunity.category || "",
        compensation_type: existingOpportunity.compensation_type,
        compensation_details: existingOpportunity.compensation_details || "",
        application_url: existingOpportunity.application_url || "",
        application_email: existingOpportunity.application_email || "",
        deadline: existingOpportunity.deadline || "",
        start_date: existingOpportunity.start_date || "",
        is_remote: existingOpportunity.is_remote || false,
        location_text: existingOpportunity.location_text || "",
        experience_level: existingOpportunity.experience_level || "any",
        status: existingOpportunity.status,
      });
    }
  }, [existingOpportunity, form]);

  const onSubmit = async (data: OpportunityFormValues) => {
    const opportunityData = {
      ...data,
      category: data.category || null,
      compensation_details: data.compensation_details || null,
      application_url: data.application_url || null,
      application_email: data.application_email || null,
      deadline: data.deadline || null,
      start_date: data.start_date || null,
      location_text: data.location_text || null,
    };

    if (isEditing && id) {
      await updateOpportunity.mutateAsync({ id, ...opportunityData } as any);
      navigate(`/opportunities/${existingOpportunity?.slug}`);
    } else {
      const newOpportunity = await createOpportunity.mutateAsync(opportunityData as any);
      navigate(`/opportunities/${newOpportunity.slug}`);
    }
  };

  const isRemote = form.watch("is_remote");

  if (isEditing && isLoadingOpportunity) {
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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Opportunity" : "Post Opportunity"}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Graphic Designer for Album Cover" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the opportunity, requirements, and what you're looking for..."
                          className="min-h-[200px]"
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
                    name="opportunity_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {opportunityTypes.map((type) => (
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <FormField
                  control={form.control}
                  name="experience_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader>
                <CardTitle>Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="compensation_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compensation Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {compensationTypes.map((type) => (
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
                  name="compensation_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compensation Details</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. $50-80/hr, $5000 project fee, etc." {...field} />
                      </FormControl>
                      <FormDescription>Optional: Provide more details about pay</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="is_remote"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Remote Opportunity</FormLabel>
                        <FormDescription>This opportunity can be done remotely</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!isRemote && (
                  <FormField
                    control={form.control}
                    name="location_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Sydney, NSW or Melbourne CBD" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Application & Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="application_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Link to external application form</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="application_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Email</FormLabel>
                      <FormControl>
                        <Input placeholder="apply@example.com" {...field} />
                      </FormControl>
                      <FormDescription>Or provide an email for applications</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opportunity Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="filled">Filled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Only open opportunities are visible to the public
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createOpportunity.isPending || updateOpportunity.isPending}
              >
                {(createOpportunity.isPending || updateOpportunity.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Update" : "Post Opportunity"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default OpportunityEditor;
