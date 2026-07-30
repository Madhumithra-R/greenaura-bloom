import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const BodySchema = z.object({
  shipping_address: z.string().trim().min(10).max(500),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: userData, error: userError } = await anonClient.auth.getUser(token);
    if (userError || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Please enter a full shipping address." }, 400);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await admin.rpc("place_order_for_user", {
      _user_id: userData.user.id,
      _shipping_address: parsed.data.shipping_address,
    });

    if (error) {
      console.error("place_order failed", error);
      const msg = /stock|empty|address/i.test(error.message)
        ? error.message
        : "We couldn't place your order. Please try again.";
      return json({ error: msg }, 400);
    }

    return json({ order_id: data });
  } catch (err) {
    console.error("place-order unexpected error", err);
    return json({ error: "We couldn't place your order. Please try again." }, 500);
  }
});
