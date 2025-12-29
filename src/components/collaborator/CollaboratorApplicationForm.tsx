import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useCollaboratorApplications } from '@/hooks/useCollaboratorApplications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle, Clock, XCircle, Send } from 'lucide-react';

const disciplineOptions = [
  'Music',
  'Visual Arts',
  'Film & Video',
  'Photography',
  'Design',
  'Theatre & Performance',
  'Dance',
  'Writing & Literature',
  'Digital Art & Tech',
  'Fashion',
  'Architecture',
  'Craft & Maker',
  'Events & Production',
  'Media & Communications',
  'Education',
  'Other',
];

const contributionOptions = [
  { id: 'content', label: 'Content curation (events, opportunities, articles)' },
  { id: 'locations', label: 'Adding & verifying locations' },
  { id: 'community', label: 'Community management & engagement' },
  { id: 'showcases', label: 'Reviewing & featuring showcases' },
  { id: 'outreach', label: 'Outreach & partnerships' },
  { id: 'mentorship', label: 'Mentorship & member support' },
];

const hoursOptions = [
  '1-2 hours per week',
  '3-5 hours per week',
  '5-10 hours per week',
  '10+ hours per week',
];

const applicationSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  location: z.string().max(100).optional(),
  disciplines: z.array(z.string()).min(1, 'Select at least one discipline'),
  portfolio_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  experience_summary: z.string().max(1000).optional(),
  motivation: z.string().min(50, 'Please provide at least 50 characters').max(2000),
  contribution_areas: z.array(z.string()).min(1, 'Select at least one contribution area'),
  hours_per_week: z.string().min(1, 'Select availability'),
  references_info: z.string().max(500).optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export function CollaboratorApplicationForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { useMyApplication, submitApplication } = useCollaboratorApplications();
  const { data: existingApplication, isLoading: appLoading } = useMyApplication();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      location: '',
      disciplines: [],
      portfolio_url: '',
      experience_summary: '',
      motivation: '',
      contribution_areas: [],
      hours_per_week: '',
      references_info: '',
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Pre-fill email from user
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          form.setValue('email', profile.email || '');
          form.setValue('full_name', profile.full_name || '');
        }
      }
      setLoading(false);
    };

    checkUser();
  }, [form]);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    await submitApplication.mutateAsync({
      user_id: user.id,
      full_name: data.full_name,
      email: data.email,
      location: data.location || null,
      disciplines: data.disciplines,
      portfolio_url: data.portfolio_url || null,
      experience_summary: data.experience_summary || null,
      motivation: data.motivation,
      contribution_areas: data.contribution_areas,
      hours_per_week: data.hours_per_week || null,
      references_info: data.references_info || null,
    });
  };

  if (loading || appLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show existing application status
  if (existingApplication) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-muted">
          {existingApplication.status === 'pending' && <Clock className="h-8 w-8 text-yellow-500" />}
          {existingApplication.status === 'approved' && <CheckCircle className="h-8 w-8 text-green-500" />}
          {existingApplication.status === 'rejected' && <XCircle className="h-8 w-8 text-red-500" />}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {existingApplication.status === 'pending' && 'Application Under Review'}
          {existingApplication.status === 'approved' && 'Application Approved!'}
          {existingApplication.status === 'rejected' && 'Application Not Accepted'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {existingApplication.status === 'pending' && 'Your application is being reviewed by our team. We\'ll be in touch soon.'}
          {existingApplication.status === 'approved' && 'Welcome to the team! You now have collaborator access.'}
          {existingApplication.status === 'rejected' && 'Thank you for your interest. Feel free to reapply in the future.'}
        </p>
        <Badge variant={
          existingApplication.status === 'pending' ? 'secondary' :
          existingApplication.status === 'approved' ? 'default' : 'destructive'
        }>
          {existingApplication.status.charAt(0).toUpperCase() + existingApplication.status.slice(1)}
        </Badge>
        {existingApplication.status === 'approved' && (
          <div className="mt-6">
            <Button onClick={() => navigate('/collaborator')}>
              Go to Collaborator Dashboard
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-4">
          You need to be logged in to apply as a collaborator.
        </p>
        <Button onClick={() => navigate('/auth')}>Sign In or Create Account</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolio_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio/Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Creative Background */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Creative Background</h3>
          
          <FormField
            control={form.control}
            name="disciplines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creative Disciplines *</FormLabel>
                <FormDescription>Select all that apply</FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {disciplineOptions.map((discipline) => (
                    <div key={discipline} className="flex items-center space-x-2">
                      <Checkbox
                        id={`discipline-${discipline}`}
                        checked={field.value.includes(discipline)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, discipline]);
                          } else {
                            field.onChange(field.value.filter((d) => d !== discipline));
                          }
                        }}
                      />
                      <Label htmlFor={`discipline-${discipline}`} className="text-sm">
                        {discipline}
                      </Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Summary</FormLabel>
                <FormDescription>Brief overview of your creative industry experience</FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your background in the creative industries..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Motivation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Motivation & Contribution</h3>
          
          <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why do you want to be a Collaborator? *</FormLabel>
                <FormDescription>Tell us about your interest and what you hope to achieve</FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="I want to contribute to Creative Atlas because..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contribution_areas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How would you like to contribute? *</FormLabel>
                <FormDescription>Select all areas you're interested in</FormDescription>
                <div className="space-y-2 mt-2">
                  {contributionOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`contribution-${option.id}`}
                        checked={field.value.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, option.id]);
                          } else {
                            field.onChange(field.value.filter((c) => c !== option.id));
                          }
                        }}
                      />
                      <Label htmlFor={`contribution-${option.id}`} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Availability */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Availability</h3>
          
          <FormField
            control={form.control}
            name="hours_per_week"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Commitment *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hoursOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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
            name="references_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>References (Optional)</FormLabel>
                <FormDescription>
                  Anyone we can contact who can vouch for your work in the creative community
                </FormDescription>
                <FormControl>
                  <Textarea 
                    placeholder="Name, organization, and contact info..."
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full gap-2"
          disabled={submitApplication.isPending}
        >
          {submitApplication.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
