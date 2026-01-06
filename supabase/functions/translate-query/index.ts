import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

var response = await client.SearchAsync<MyDocument>(s => s
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

EXAMPLE INPUT for 9.x (match query):
POST products/_search
{
  "query": {
    "match": { "name": "laptop" }
  }
}

EXAMPLE OUTPUT for 9.x:
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

var response = await client.SearchAsync<Product>(s => s
    .Index("products")
    .Query(q => q
        .Match(m => m
            .Field(f => f.Name)
            .Query("laptop")
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
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

var response = await client.SearchAsync<MyDocument>(s => s
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

EXAMPLE INPUT for 8.x (match query):
POST products/_search
{
  "query": {
    "match": { "name": "laptop" }
  }
}

EXAMPLE OUTPUT for 8.x:
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;

var response = await client.SearchAsync<Product>(s => s
    .Index("products")
    .Query(q => q
        .Match(m => m
            .Field(f => f.Name)
            .Query("laptop")
        )
    )
);
`;

    const versionExamples = version === "9.x" ? examples9x : examples8x;
    const versionNote = version === "9.x" 
      ? "This is for Elasticsearch 9.x using Elastic.Clients.Elasticsearch. In 9.x, use DateRange() for date range queries with simple string dates."
      : "This is for Elasticsearch 8.x using Elastic.Clients.Elasticsearch. In 8.x, use DateRange() with DateMath.Anchored() for date values.";

    const systemPrompt = `You are an expert in Elasticsearch and the .NET Elasticsearch clients. Your task is to translate Elasticsearch requests into equivalent C# code using Elastic.Clients.Elasticsearch (the official .NET client for Elasticsearch ${version}).

${versionNote}

${versionExamples}

The user input will contain:
1. The HTTP method and Elasticsearch API endpoint (e.g., "POST my-index/_search", "PUT my-index", "GET my-index/_doc/1")
2. The request body JSON (if applicable)

Guidelines:
- FOLLOW THE EXAMPLES ABOVE EXACTLY for the selected version
- Parse the API endpoint to determine which client method to use (SearchAsync, IndexAsync, GetAsync, DeleteAsync, etc.)
- Extract the index name from the endpoint
- Generate clean, idiomatic C# code that compiles
- Use the fluent API style as shown in examples
- Include necessary using statements at the top
- Handle all query types: bool, match, term, range, nested, aggregations, etc.
- Use ElasticsearchClient (not ElasticClient)
- Use async methods (SearchAsync, IndexAsync, etc.)
- Output ONLY the raw C# code, no explanations
- Do NOT include markdown code block markers
- Use proper indentation and formatting`;

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
