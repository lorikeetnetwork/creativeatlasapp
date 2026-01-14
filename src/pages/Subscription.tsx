import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, RefreshCw, Settings, Calendar, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface SubscriptionData {
  subscribed: boolean;
  subscription_status: string;
  product_id: string | null;
  subscription_end: string | null;
  subscription_id: string | null;
}

interface Profile {
  account_type: string | null;
  subscription_status: string | null;
  subscription_end_date: string | null;
  stripe_subscription_id: string | null;
  full_name: string | null;
  email: string;
}

const Subscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    await Promise.all([fetchProfile(), checkSubscription()]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('account_type, subscription_status, subscription_end_date, stripe_subscription_id, full_name, email')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const checkSubscription = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionData(data);
      await fetchProfile(); // Refresh profile after checking subscription
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      toast.error('Failed to check subscription status');
    } finally {
      setChecking(false);
    }
  };

  const openCustomerPortal = async () => {
    setOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast.error(error.message || 'Failed to open subscription management');
    } finally {
      setOpeningPortal(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'canceled':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><AlertCircle className="w-3 h-3 mr-1" /> Canceled</Badge>;
      case 'past_due':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Past Due</Badge>;
      default:
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" /> Inactive</Badge>;
    }
  };

  const getAccountTypeName = (accountType: string | null) => {
    switch (accountType) {
      case 'creative_entity':
        return 'Creative Entity Listing';
      case 'basic_paid':
        return 'Basic Account';
      default:
        return 'Free Account';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasActiveSubscription = subscriptionData?.subscribed || profile?.subscription_status === 'active';
  const isPaidAccount = profile?.account_type === 'basic_paid' || profile?.account_type === 'creative_entity';

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Current Plan Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your subscription details</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkSubscription}
                disabled={checking}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Checking...' : 'Refresh Status'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plan Type</p>
                  <p className="text-lg font-semibold text-foreground">{getAccountTypeName(profile?.account_type)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(profile?.subscription_status)}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Renewal Date</p>
                  <p className="text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(profile?.subscription_end_date)}
                  </p>
                </div>
                {profile?.stripe_subscription_id && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subscription ID</p>
                    <p className="text-xs font-mono text-muted-foreground">{profile.stripe_subscription_id}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Manage Subscription
            </CardTitle>
            <CardDescription>
              Update payment method, change plan, or cancel subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPaidAccount ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Access the Stripe Customer Portal to manage your subscription, update payment methods, 
                  view billing history, or cancel your plan.
                </p>
                <Button 
                  onClick={openCustomerPortal}
                  disabled={openingPortal}
                  className="w-full sm:w-auto"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {openingPortal ? 'Opening Portal...' : 'Open Customer Portal'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You're currently on the free plan. Upgrade to unlock more features!
                </p>
                <a href="/#membership">
                  <Button className="w-full sm:w-auto">
                    View Pricing Plans
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Benefits Card */}
        {profile?.account_type === 'creative_entity' && (
          <Card>
            <CardHeader>
              <CardTitle>Your Plan Benefits</CardTitle>
              <CardDescription>Features included in Creative Entity Listing</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  'Dedicated business profile page',
                  'Upload unlimited photos and videos',
                  'Showcase your portfolio and services',
                  'Receive direct inquiries from visitors',
                  'Priority listing in search results',
                  'Analytics and insights dashboard',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Subscription;
