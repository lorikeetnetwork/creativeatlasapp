import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { z } from "zod";

// Validation schema matching database constraints
const contactFormSchema = z.object({
  sender_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  sender_email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  sender_phone: z
    .string()
    .trim()
    .max(30, "Phone number must be less than 30 characters")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(200, "Subject must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
  inquiry_type: z
    .string()
    .max(50, "Inquiry type is invalid")
    .default("general"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  locationId: string;
  businessName: string;
}

const ContactForm = ({ locationId, businessName }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    subject: "",
    message: "",
    inquiry_type: "general",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const result = contactFormSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Trim all string values before submission
      const cleanedData = {
        location_id: locationId,
        sender_name: formData.sender_name.trim(),
        sender_email: formData.sender_email.trim().toLowerCase(),
        sender_phone: formData.sender_phone?.trim() || null,
        subject: formData.subject?.trim() || null,
        message: formData.message.trim(),
        inquiry_type: formData.inquiry_type,
      };

      const { error } = await supabase
        .from("contact_form_submissions")
        .insert(cleanedData);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: `Your inquiry has been sent to ${businessName}. They'll get back to you soon.`,
      });

      // Reset form
      setFormData({
        sender_name: "",
        sender_email: "",
        sender_phone: "",
        subject: "",
        message: "",
        inquiry_type: "general",
      });
      setErrors({});
    } catch (error: any) {
      console.error("Contact form error:", error);
      
      // Handle specific error messages from database trigger
      let errorMessage = "Please try again later";
      if (error.message?.includes("Rate limit exceeded")) {
        errorMessage = "You've sent too many messages. Please wait before trying again.";
      } else if (error.message?.includes("Daily limit exceeded")) {
        errorMessage = "You've reached the daily message limit. Please try again tomorrow.";
      } else if (error.message?.includes("too long") || error.message?.includes("too short")) {
        errorMessage = error.message;
      } else if (error.message?.includes("Invalid")) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error sending message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get in Touch</CardTitle>
        <CardDescription>
          Send a message to {businessName} and they'll respond to your inquiry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sender_name">Name *</Label>
              <Input
                id="sender_name"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Your name"
                className={errors.sender_name ? "border-destructive" : ""}
              />
              {errors.sender_name && (
                <p className="text-sm text-destructive mt-1">{errors.sender_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="sender_email">Email *</Label>
              <Input
                id="sender_email"
                name="sender_email"
                type="email"
                value={formData.sender_email}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="your@email.com"
                className={errors.sender_email ? "border-destructive" : ""}
              />
              {errors.sender_email && (
                <p className="text-sm text-destructive mt-1">{errors.sender_email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sender_phone">Phone (optional)</Label>
              <Input
                id="sender_phone"
                name="sender_phone"
                type="tel"
                value={formData.sender_phone}
                onChange={handleChange}
                maxLength={30}
                placeholder="Your phone number"
                className={errors.sender_phone ? "border-destructive" : ""}
              />
              {errors.sender_phone && (
                <p className="text-sm text-destructive mt-1">{errors.sender_phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="inquiry_type">Inquiry Type</Label>
              <Select
                value={formData.inquiry_type}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, inquiry_type: value }));
                  if (errors.inquiry_type) {
                    setErrors((prev) => ({ ...prev, inquiry_type: undefined }));
                  }
                }}
              >
                <SelectTrigger id="inquiry_type">
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="booking">Booking/Reservation</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              maxLength={200}
              placeholder="What's this about?"
              className={errors.subject ? "border-destructive" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-destructive mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              maxLength={5000}
              placeholder="Tell them what you're looking for..."
              rows={6}
              className={errors.message ? "border-destructive" : ""}
            />
            <div className="flex justify-between mt-1">
              {errors.message ? (
                <p className="text-sm text-destructive">{errors.message}</p>
              ) : (
                <span />
              )}
              <span className="text-sm text-muted-foreground">
                {formData.message.length}/5000
              </span>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
