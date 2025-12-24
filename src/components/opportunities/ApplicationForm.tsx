import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileText, X, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitApplication, useUploadResume, useHasApplied } from "@/hooks/useApplications";

const applicationSchema = z.object({
  coverMessage: z.string().max(2000, "Cover message must be less than 2000 characters").optional(),
  resumeUrl: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  opportunityId: string;
  opportunityTitle: string;
  applicationEmail?: string | null;
  applicationUrl?: string | null;
}

const ApplicationForm = ({
  opportunityId,
  opportunityTitle,
  applicationEmail,
  applicationUrl,
}: ApplicationFormProps) => {
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: hasApplied } = useHasApplied(opportunityId);
  const submitApplication = useSubmitApplication();
  const uploadResume = useUploadResume();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverMessage: "",
      resumeUrl: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadResume.mutateAsync(file);
    setUploadedFile({ name: file.name, url });
    form.setValue("resumeUrl", url);
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    await submitApplication.mutateAsync({
      opportunityId,
      coverMessage: data.coverMessage,
      resumeUrl: data.resumeUrl || uploadedFile?.url,
    });
    setOpen(false);
    form.reset();
    setUploadedFile(null);
  };

  // If external application
  if (applicationUrl || applicationEmail) {
    const href = applicationUrl || `mailto:${applicationEmail}?subject=Application: ${opportunityTitle}`;
    return (
      <Button asChild className="w-full" size="lg">
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Send className="h-4 w-4 mr-2" />
          Apply Now
        </a>
      </Button>
    );
  }

  if (hasApplied) {
    return (
      <Button disabled className="w-full" size="lg" variant="secondary">
        Applied
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Send className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for this opportunity</DialogTitle>
          <DialogDescription>
            Submit your application for: {opportunityTitle}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="coverMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Introduce yourself and explain why you're a great fit..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional but recommended</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume Upload */}
            <div className="space-y-2">
              <FormLabel>Resume / Portfolio</FormLabel>
              {uploadedFile ? (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="flex-1 text-sm truncate">{uploadedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setUploadedFile(null);
                      form.setValue("resumeUrl", "");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadResume.isPending ? (
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload PDF, DOC, or portfolio link
                      </p>
                    </>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={submitApplication.isPending}
              >
                {submitApplication.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Submit Application
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
