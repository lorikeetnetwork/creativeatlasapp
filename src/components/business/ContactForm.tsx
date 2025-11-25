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

interface ContactFormProps {
  locationId: string;
  businessName: string;
}

const ContactForm = ({ locationId, businessName }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    subject: "",
    message: "",
    inquiry_type: "general",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_form_submissions")
        .insert({
          location_id: locationId,
          ...formData,
        });

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
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
                placeholder="Your name"
              />
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
                placeholder="your@email.com"
              />
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
                placeholder="Your phone number"
              />
            </div>
            <div>
              <Label htmlFor="inquiry_type">Inquiry Type</Label>
              <Select
                value={formData.inquiry_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, inquiry_type: value }))
                }
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
              placeholder="What's this about?"
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Tell them what you're looking for..."
              rows={6}
            />
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
