import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In-memory rate limit: 30 req/min per user
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(userId);
  if (!entry || now > entry.reset) {
    rateMap.set(userId, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    if (!checkRateLimit(userId)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { queryDsl, version = "8.x" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const examples9x = `
EXAMPLE INPUT for 9.x:
POST my-index/_search
{
  "query": {
    "bool": {
      "must": [
        { "range": { "timestamp": { "gte": "2025-01-01", "lte": "2025-12-31" } } }
      ]
    }
  }
}

EXAMPLE OUTPUT for 9.x:
var response = await client.SearchAsync<object>(s => s
    .Index("my-index")
    .Query(q => q
        .Bool(b => b
            .Must(m => m
                .Range(r => r
                    .DateRange(dr => dr
                        .Field(f => f.Timestamp)
                        .Gte("2025-01-01")
                        .Lte("2025-12-31")
                    )
                )
            )
        )
    )
);
`;

    const examples8x = `
EXAMPLE INPUT for 8.x:
POST my-index/_search
{
  "query": {
    "bool": {
      "must": [
        { "range": { "timestamp": { "gte": "2025-01-01", "lte": "2025-12-31" } } }
      ]
    }
  }
}

EXAMPLE OUTPUT for 8.x:
var response = await client.SearchAsync<object>(s => s
    .Index("my-index")
    .Query(q => q
        .Bool(b => b
            .Must(m => m
                .Range(r => r
                    .DateRange(dr => dr
                        .Field(f => f.Timestamp)
                        .Gte(DateMath.Anchored("2025-01-01"))
                        .Lte(DateMath.Anchored("2025-12-31"))
                    )
                )
            )
        )
    )
);
`;

    const versionExamples = version === "9.x" ? examples9x : examples8x;
    const versionNote = version === "9.x" 
      ? "This is for Elasticsearch 9.x using Elastic.Clients.Elasticsearch."
      : "This is for Elasticsearch 8.x using Elastic.Clients.Elasticsearch.";

    const systemPrompt = `You are an expert in Elasticsearch and the .NET Elasticsearch clients. Translate Elasticsearch requests into C# code using Elastic.Clients.Elasticsearch for version ${version}.

${versionNote}

${versionExamples}

CRITICAL OUTPUT RULES:
- Output ONLY the method call (e.g., var response = await client.SearchAsync<object>(...))
- ALWAYS use <object> as the generic type parameter, never use specific types
- NO using statements
- NO class definitions
- NO constructors
- NO function/method wrappers
- NO comments
- NO markdown code blocks
- Just the raw executable statement(s)

Guidelines:
- Follow the examples above exactly
- Extract the index name from the endpoint
- Use the fluent API style
- Use async methods (SearchAsync, IndexAsync, etc.)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Translate this Elasticsearch Query DSL to C# code:\n\n${queryDsl}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
