import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { token }: { token: string } = await req.json();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing invite token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Find the user with this invite token
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("id, email, full_name, invite_token_expires_at")
      .eq("invite_token", token)
      .single();

    if (profileError || !profile) {
      console.error("Profile lookup error:", profileError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired invitation link" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token is expired
    if (profile.invite_token_expires_at) {
      const expiresAt = new Date(profile.invite_token_expires_at);
      if (expiresAt < new Date()) {
        return new Response(
          JSON.stringify({ error: "This invitation link has expired. Please contact the administrator for a new invite." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Clear the invite token (one-time use)
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        invite_token: null,
        invite_token_expires_at: null,
        must_change_password: true, // Ensure password change is required
      })
      .eq("id", profile.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
    }

    // Generate a temporary password for the user to sign in
    const tempPassword = crypto.randomUUID();
    
    // Update the user's password
    const { error: passwordError } = await adminClient.auth.admin.updateUserById(
      profile.id,
      { password: tempPassword }
    );

    if (passwordError) {
      console.error("Password update error:", passwordError);
      return new Response(
        JSON.stringify({ error: "Failed to process invitation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Invite token verified successfully for user:", profile.id);

    return new Response(
      JSON.stringify({
        success: true,
        email: profile.email,
        fullName: profile.full_name,
        tempPassword,
        userId: profile.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
