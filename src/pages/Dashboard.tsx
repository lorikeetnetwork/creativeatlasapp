import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GradientButton } from "@/components/ui/gradient-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, User, CreditCard, Building2, ArrowRight, Loader2, Settings, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";

interface Profile {
  account_type: 'free' | 'basic_paid' | 'creative_entity';
  payment_verified: boolean;
  payment_date: string | null;
  full_name: string | null;
  email: string;
  subscription_status: string | null;
  subscription_end_date: string | null;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string | null;
  account_type_granted: 'free' | 'basic_paid' | 'creative_entity' | null;
  created_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    await Promise.all([
      fetchProfile(session.user.id),
      fetchPaymentHistory(session.user.id)
    ]);
    
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('account_type, payment_verified, payment_date, full_name, email, subscription_status, subscription_end_date')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchPaymentHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error loading payment history",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getAccountTypeBadge = (accountType: string) => {
    switch (accountType) {
      case 'free':
        return <Badge variant="secondary" className="bg-[#333] text-white text-xs">Free Account</Badge>;
      case 'creative_entity':
        return <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-xs">Creative Entity</Badge>;
      default:
        return <Badge variant="outline" className="border-[#333] text-white text-xs">Unknown</Badge>;
    }
  };

  const getAccountIcon = (accountType: string) => {
    switch (accountType) {
      case 'creative_entity':
        return <Building2 className="w-10 h-10 md:w-12 md:h-12 text-primary" />;
      default:
        return <User className="w-10 h-10 md:w-12 md:h-12 text-primary" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <Badge className="bg-green-500 text-xs">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-[#333] text-white text-xs">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return <Badge variant="outline" className="border-[#333] text-white text-xs">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <p className="text-gray-400">Unable to load profile</p>
      </div>
    );
  }

  const canUpgrade = profile.account_type === 'free';

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-6xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white">Account Dashboard</h1>
          <p className="text-sm md:text-base text-gray-400">Manage your account and view payment history</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Account Status Card */}
          <Card className="md:col-span-2 border-[#333] bg-[#1a1a1a]">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl text-white">Account Status</CardTitle>
              <CardDescription className="text-sm text-gray-400">Your current plan and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  {getAccountIcon(profile.account_type)}
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                      <h3 className="text-xl md:text-2xl font-semibold text-white">{profile.full_name || 'User'}</h3>
                      {getAccountTypeBadge(profile.account_type)}
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 break-all">{profile.email}</p>
                  </div>

                  {profile.subscription_status === 'active' && profile.subscription_end_date && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>
                        Renews {new Date(profile.subscription_end_date).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}

                  {profile.payment_verified && !profile.subscription_end_date && profile.payment_date && (
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>
                        Payment verified {formatDistanceToNow(new Date(profile.payment_date), { addSuffix: true })}
                      </span>
                    </div>
                  )}

                  {profile.account_type === 'free' && (
                    <div className="bg-[#222] p-3 md:p-4 rounded-lg border border-[#333]">
                      <p className="text-xs md:text-sm mb-3 text-gray-400">
                        <strong className="text-white">List your creative business</strong> on the map to reach more customers.
                      </p>
                      <GradientButton size="sm" onClick={() => navigate('/pricing')}>
                        View Pricing
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </GradientButton>
                    </div>
                  )}

                  {profile.account_type === 'creative_entity' && (
                    <div className="space-y-2">
                      <p className="text-xs md:text-sm font-medium text-white">Your benefits:</p>
                      <ul className="text-xs md:text-sm text-gray-400 space-y-1">
                        <li>✓ Location on the map</li>
                        <li>✓ Full business profile page</li>
                        <li>✓ Photo & offerings galleries</li>
                        <li>✓ Video embeds & current projects</li>
                        <li>✓ Contact forms & social links</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-[#333] bg-[#1a1a1a]">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <GradientButton variant="outline" className="w-full justify-start border-[#333] text-white hover:bg-[#222] text-sm" onClick={() => navigate('/map')}>
                Browse Map
              </GradientButton>
              {(profile.account_type === 'creative_entity' || profile.account_type === 'basic_paid') && (
                <GradientButton variant="outline" className="w-full justify-start border-[#333] text-white hover:bg-[#222] text-sm" onClick={() => navigate('/subscription')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Subscription
                </GradientButton>
              )}
              {profile.account_type === 'creative_entity' && (
                <GradientButton variant="outline" className="w-full justify-start border-[#333] text-white hover:bg-[#222] text-sm">
                  Add Location
                </GradientButton>
              )}
              {canUpgrade && (
                <GradientButton className="w-full justify-start text-sm" onClick={() => navigate('/pricing')}>
                  List Your Business
                </GradientButton>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="border-[#333] bg-[#1a1a1a]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl text-white">Payment History</CardTitle>
                <CardDescription className="text-sm text-gray-400">View all your transactions</CardDescription>
              </div>
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm md:text-base text-gray-400 mb-4">No payment history yet</p>
                {profile.account_type === 'free' && (
                  <GradientButton size="sm" onClick={() => navigate('/pricing')}>
                    View Pricing Plans
                  </GradientButton>
                )}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-[#333] rounded-lg gap-3">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex-shrink-0 hidden sm:block">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-medium text-sm md:text-base text-white">
                            {payment.payment_type === 'creative_listing' ? 'Creative Entity Listing' : 'Payment'}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                        <p className="text-xs md:text-sm text-gray-400">
                          {new Date(payment.created_at).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-sm md:text-base text-white">{formatAmount(payment.amount, payment.currency)}</p>
                      {payment.account_type_granted === 'creative_entity' && (
                        <p className="text-xs text-gray-400">Creative Entity</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-4 md:mt-6 border-[#333] bg-[#1a1a1a]">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-400 mb-2">
                Need help with your account or payments?
              </p>
              <p className="text-xs md:text-sm text-white">
                Contact us at <a href="mailto:support@creativeatlas.com.au" className="text-primary hover:underline">support@creativeatlas.com.au</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;