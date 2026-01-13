import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    console.log("[newsletter-subscribe] Processing subscription request");

    // Validate email
    if (!email || typeof email !== "string") {
      console.log("[newsletter-subscribe] Invalid email provided");
      // Always return success to prevent enumeration
      return new Response(
        JSON.stringify({ success: true, message: "Thanks for subscribing!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      console.log("[newsletter-subscribe] Email failed validation");
      // Always return success to prevent enumeration
      return new Response(
        JSON.stringify({ success: true, message: "Thanks for subscribing!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for insertion
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if already subscribed (using service role)
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, unsubscribed_at")
      .eq("email", trimmedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.unsubscribed_at) {
        // Re-subscribe
        console.log("[newsletter-subscribe] Re-subscribing existing user");
        await supabaseAdmin
          .from("newsletter_subscribers")
          .update({ 
            unsubscribed_at: null, 
            subscribed_at: new Date().toISOString() 
          })
          .eq("id", existing.id);
      } else {
        console.log("[newsletter-subscribe] Email already subscribed");
      }
    } else {
      // New subscription
      console.log("[newsletter-subscribe] Creating new subscription");
      const { error: insertError } = await supabaseAdmin
        .from("newsletter_subscribers")
        .insert({ 
          email: trimmedEmail,
          is_verified: false,
          verification_token: crypto.randomUUID()
        });

      if (insertError) {
        console.error("[newsletter-subscribe] Insert error:", insertError.message);
        // Don't expose the error to the client
      }
    }

    // Always return the same success message (prevents enumeration)
    return new Response(
      JSON.stringify({ success: true, message: "Thanks for subscribing!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[newsletter-subscribe] Error:", error);
    // Even on error, return a generic success to prevent information leakage
    return new Response(
      JSON.stringify({ success: true, message: "Thanks for subscribing!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
