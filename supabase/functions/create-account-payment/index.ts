import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-ACCOUNT-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");
    
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get request body
    const { payment_type } = await req.json();
    logStep("Payment type requested", { payment_type });
    
    if (!payment_type || !['basic_account', 'creative_listing'].includes(payment_type)) {
      throw new Error("Invalid payment type. Must be 'basic_account' or 'creative_listing'");
    }

    // Check if user already has this account type
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();
    
    logStep("Current profile status", { account_type: profile?.account_type });

    if (payment_type === 'basic_account' && profile?.account_type !== 'free') {
      throw new Error("User already has a paid account");
    }

    if (payment_type === 'creative_listing' && profile?.account_type === 'creative_entity') {
      throw new Error("User already has a creative entity listing");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });
    logStep("Stripe initialized");

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      logStep("No existing Stripe customer");
    }

    // Determine price ID based on payment type
    const priceId = payment_type === 'basic_account' 
      ? 'price_1SXIxoCxyWFCnV0cluo8h31I' // $5 AUD
      : 'price_1SXIy4CxyWFCnV0cPNh5pgh9'; // $15 AUD
    
    logStep("Price ID selected", { priceId, payment_type });

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?type=${payment_type}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: user.id,
        payment_type: payment_type,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    // Store payment record
    const accountTypeGranted = payment_type === 'basic_account' ? 'basic_paid' : 'creative_entity';
    
    await supabaseClient.from('payments').insert({
      user_id: user.id,
      amount: payment_type === 'basic_account' ? 500 : 1500,
      currency: 'AUD',
      status: 'pending',
      stripe_session_id: session.id,
      payment_type: payment_type,
      account_type_granted: accountTypeGranted,
    });
    
    logStep("Payment record created");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
