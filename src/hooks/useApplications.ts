import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("opportunity_applications")
        .select(`
          *,
          opportunity:opportunities(
            id, slug, title, opportunity_type, compensation_type, status,
            poster:profiles!opportunities_poster_id_fkey(full_name),
            location:locations(name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useApplicationsForOpportunity = (opportunityId: string | undefined) => {
  return useQuery({
    queryKey: ["opportunity-applications", opportunityId],
    queryFn: async () => {
      if (!opportunityId) return [];

      const { data, error } = await supabase
        .from("opportunity_applications")
        .select(`
          *,
          applicant:profiles!opportunity_applications_user_id_fkey(id, full_name, email)
        `)
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!opportunityId,
  });
};

export const useHasApplied = (opportunityId: string | undefined) => {
  return useQuery({
    queryKey: ["has-applied", opportunityId],
    queryFn: async () => {
      if (!opportunityId) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("opportunity_applications")
        .select("id")
        .eq("opportunity_id", opportunityId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!opportunityId,
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      opportunityId,
      coverMessage,
      resumeUrl,
    }: {
      opportunityId: string;
      coverMessage?: string;
      resumeUrl?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("opportunity_applications")
        .insert({
          opportunity_id: opportunityId,
          user_id: user.id,
          cover_message: coverMessage || null,
          resume_url: resumeUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["has-applied", variables.opportunityId] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["opportunity-applications", variables.opportunityId] });
      toast({
        title: "Application submitted",
        description: "Your application has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
    }) => {
      const { data, error } = await supabase
        .from("opportunity_applications")
        .update({ status })
        .eq("id", applicationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-applications", data.opportunity_id] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      toast({
        title: "Status updated",
        description: "Application status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUploadResume = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("opportunity-attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get signed URL since bucket is private
      const { data } = await supabase.storage
        .from("opportunity-attachments")
        .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

      return data?.signedUrl || "";
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
