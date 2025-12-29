import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generatePassword(length = 16): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function generateInviteToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: isMaster, error: roleError } = await userClient.rpc("is_master", { _user_id: user.id });
    if (roleError) {
      console.error("Role check error:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isMaster) {
      return new Response(
        JSON.stringify({ error: "Only the master account can invite users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, fullName, role, inviteMethod = "email" } = await req.json();
    
    if (!email || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, fullName, role" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validRoles = ["collaborator", "owner"];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Get the app URL from environment or default
    const appUrl = Deno.env.get("APP_URL") || "https://creativeatlas.app";

    if (inviteMethod === "magicLink") {
      // Magic link flow - create user with random password, generate invite token
      const tempPassword = generatePassword(32);
      const inviteToken = generateInviteToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (createError) {
        console.error("User creation error:", createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("User created successfully:", newUser.user.id);

      // Update profile with invite token and must_change_password
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({
          must_change_password: true,
          invite_token: inviteToken,
          invite_token_expires_at: expiresAt.toISOString(),
        })
        .eq("id", newUser.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // Assign role
      const { error: roleInsertError } = await adminClient
        .from("user_roles")
        .insert({ user_id: newUser.user.id, role });

      if (roleInsertError) {
        console.error("Role assignment error:", roleInsertError);
      }

      // Send magic link email
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const magicLinkUrl = `${appUrl}/invite/${inviteToken}`;

        try {
          await resend.emails.send({
            from: "Creative Atlas <noreply@creativeatlas.app>",
            to: [email],
            subject: "Your Creative Atlas Invitation",
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Your Creative Atlas Invitation</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                  <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to Creative Atlas!</h1>
                </div>
                
                <p style="font-size: 16px;">Hi <strong>${fullName}</strong>,</p>
                
                <p style="font-size: 16px;">You've been invited to join Creative Atlas as a <strong style="color: #6366f1;">${role}</strong>.</p>
                
                <p style="font-size: 16px;">Click the button below to set up your account:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${magicLinkUrl}" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Accept Invitation</a>
                </div>
                
                <p style="font-size: 14px; color: #666;">Or copy this link: <a href="${magicLinkUrl}" style="color: #6366f1;">${magicLinkUrl}</a></p>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #92400e;">⏰ This link expires in 24 hours.</p>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                  If you didn't expect this invitation, you can safely ignore this email.<br>
                  © Creative Atlas - Australia's Creative Directory
                </p>
              </body>
              </html>
            `,
          });
          console.log("Magic link email sent successfully");
        } catch (emailError) {
          console.error("Email sending error:", emailError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          userId: newUser.user.id,
          email,
          fullName,
          role,
          inviteMethod: "magicLink",
          message: "Magic link invitation sent to " + email,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      // Password invite flow
      const generatedPassword = generatePassword(16);

      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (createError) {
        console.error("User creation error:", createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("User created successfully:", newUser.user.id);

      // Update profile to require password change
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({ must_change_password: true })
        .eq("id", newUser.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }

      // Assign role
      const { error: roleInsertError } = await adminClient
        .from("user_roles")
        .insert({ user_id: newUser.user.id, role });

      if (roleInsertError) {
        console.error("Role assignment error:", roleInsertError);
        return new Response(
          JSON.stringify({
            success: true,
            userId: newUser.user.id,
            password: generatedPassword,
            warning: "User created but role assignment failed: " + roleInsertError.message,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Role assigned successfully:", role);

      // Send welcome email with credentials
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const loginUrl = `${appUrl}/auth`;

        try {
          await resend.emails.send({
            from: "Creative Atlas <noreply@creativeatlas.app>",
            to: [email],
            subject: "Welcome to Creative Atlas!",
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <title>Welcome to Creative Atlas</title>
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                  <h1 style="color: #fff; margin: 0; font-size: 24px;">Welcome to Creative Atlas!</h1>
                </div>
                
                <p style="font-size: 16px;">Hi <strong>${fullName}</strong>,</p>
                
                <p style="font-size: 16px;">You've been invited to join Creative Atlas as a <strong style="color: #6366f1;">${role}</strong>.</p>
                
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1e293b;">Your Login Credentials</h3>
                  <p style="margin: 8px 0;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color: #6366f1;">${loginUrl}</a></p>
                  <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                  <p style="margin: 8px 0;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-size: 14px;">${generatedPassword}</code></p>
                </div>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #92400e;">⚠️ <strong>Important:</strong> Please change your password after your first login for security.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${loginUrl}" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Sign In Now</a>
                </div>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #999; text-align: center;">
                  If you didn't expect this invitation, please contact our support team.<br>
                  © Creative Atlas - Australia's Creative Directory
                </p>
              </body>
              </html>
            `,
          });
          console.log("Welcome email sent successfully");
        } catch (emailError) {
          console.error("Email sending error:", emailError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          userId: newUser.user.id,
          email,
          fullName,
          role,
          password: generatedPassword,
          inviteMethod: "email",
          emailSent: !!resendApiKey,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
