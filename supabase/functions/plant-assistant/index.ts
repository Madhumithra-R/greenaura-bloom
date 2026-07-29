import { createClient } from "npm:@supabase/supabase-js@2";
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";
import { streamText } from "npm:ai";
import { z } from "npm:zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "AI is not configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: products } = await supabase
      .from("products")
      .select("name, category, description, price_cents, stock, light, water, difficulty, mature_size")
      .limit(60);

    const catalog = (products ?? [])
      .map(
        (p) =>
          `- ${p.name} (${p.category}) — $${(p.price_cents / 100).toFixed(2)}, ${
            p.stock > 0 ? "in stock" : "sold out"
          }. Light: ${p.light}. Water: ${p.water}. Care level: ${p.difficulty}. Size: ${p.mature_size}. ${p.description}`,
      )
      .join("\n");

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      system: `You are GreenAura's plant concierge: warm, concise, expert on indoor plants.
Recommend only plants from the catalog below and mention their price when you suggest one.
Give practical care advice (light, watering, humidity, pets, troubleshooting).
Keep answers under 150 words, use short markdown lists when helpful.
If a question is unrelated to plants or the shop, politely steer back.

CATALOG:
${catalog}`,
      messages: parsed.data.messages,
    });

    return result.toTextStreamResponse({
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
