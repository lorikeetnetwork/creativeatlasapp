import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
};

const getSafeErrorMessage = (error: Error): string => {
  const msg = error.message.toLowerCase();
  if (msg.includes('not authenticated') || msg.includes('authorization')) {
    return 'Authentication required. Please log in.';
  }
  if (msg.includes('session') || msg.includes('stripe')) {
    return 'Payment verification error. Please try again.';
  }
  return 'An error occurred. Please try again later.';
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");
    
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    logStep("User authenticated", { userId: user.id });

    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID required");
    }
    logStep("Session ID received", { session_id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the session from Stripe with subscription expansion
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription']
    });
    logStep("Stripe session retrieved", { 
      status: session.payment_status,
      mode: session.mode,
      metadata: session.metadata 
    });

    if (session.payment_status === 'paid' && session.metadata?.user_id === user.id) {
      const payment_type = session.metadata.payment_type;
      const accountType = payment_type === 'basic_account' ? 'basic_paid' : 'creative_entity';
      
      // Handle subscription data
      let subscriptionId = null;
      let subscriptionStatus = 'active';
      let subscriptionEndDate = null;

      if (session.mode === 'subscription' && session.subscription) {
        const subscription = session.subscription as Stripe.Subscription;
        subscriptionId = subscription.id;
        subscriptionStatus = subscription.status;
        subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
        logStep("Subscription details", { subscriptionId, subscriptionStatus, subscriptionEndDate });
      }
      
      // Update user profile with subscription data
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .update({
          account_type: accountType,
          payment_verified: true,
          payment_date: new Date().toISOString(),
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscriptionId,
          subscription_status: subscriptionStatus,
          subscription_end_date: subscriptionEndDate,
        })
        .eq('id', user.id);
      
      if (profileError) {
        logStep("Error updating profile", { error: profileError });
        throw profileError;
      }
      
      // Update payment record
      await supabaseClient
        .from('payments')
        .update({
          status: 'paid',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('stripe_session_id', session_id)
        .eq('user_id', user.id);
      
      logStep("Profile and payment updated successfully", { accountType, subscriptionId });

      return new Response(JSON.stringify({ 
        success: true, 
        account_type: accountType,
        subscription_id: subscriptionId,
        subscription_status: subscriptionStatus,
        subscription_end_date: subscriptionEndDate
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      logStep("Payment not successful", { 
        payment_status: session.payment_status,
        metadata_user_id: session.metadata?.user_id,
        actual_user_id: user.id
      });
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Payment not successful' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: getSafeErrorMessage(error as Error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
