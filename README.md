# Elastic DSL Converter

A free, open-source web tool that converts Elasticsearch Query DSL into strongly-typed C# code using [`Elastic.Clients.Elasticsearch`](https://www.elastic.co/docs/reference/elasticsearch/clients/dotnet) — the official high-level .NET client for Elasticsearch.

🌐 **Live site:** https://elasticdslconverter.lovable.app

## What it does

Paste any Elasticsearch Query DSL request (the JSON you'd send to `_search`, `_count`, etc.) and instantly get back the equivalent C# fluent-API call you can drop into your .NET project. Powered by an LLM with version-aware prompts so the output matches the API surface of the client version you select.

Useful for:

- Converting queries from Kibana Dev Tools into ready-to-use strongly-typed C#.
- Quickly prototyping Elasticsearch queries in .NET without hand-translating JSON.
- Learning the `Elastic.Clients.Elasticsearch` fluent API by example.

## Supported versions

| Elasticsearch | .NET Client (`Elastic.Clients.Elasticsearch`) |
| ------------- | --------------------------------------------- |
| 8.x           | 8.x                                           |
| 9.x           | 9.x                                           |

Pick the target version in the UI before translating — the prompt and few-shot examples switch accordingly.

## Tech stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Lovable Cloud (Supabase Edge Functions + Auth)
- **AI:** Lovable AI Gateway (Google Gemini)

## Running locally

Requirements: [Node.js](https://nodejs.org) 18+ and npm (use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to install).

```sh
# 1. Clone the repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root
cat > .env <<EOF
VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-supabase-anon-key>"
VITE_SUPABASE_PROJECT_ID="<your-project-ref>"
EOF

# 4. Start the dev server
npm run dev
```

Open http://localhost:8080 in your browser.

### Backend setup

The translation runs in a Supabase Edge Function (`supabase/functions/translate-query`) that calls the Lovable AI Gateway. To run your own backend you'll need to:

1. Create a Supabase project and deploy the edge function from `supabase/functions/translate-query`.
2. Enable **anonymous sign-ins** in Supabase Auth (the client signs in anonymously so the function can verify the JWT).
3. Set the `LOVABLE_API_KEY` secret on the function (or swap the AI provider in `index.ts` for OpenAI, Anthropic, Gemini, etc.).

## Project structure

```
src/
  components/        UI components (editor, header, version selector)
  hooks/             useTranslation, useAnonAuth
  pages/             Route pages
  integrations/      Auto-generated Supabase client
supabase/
  functions/
    translate-query/ Edge function: validates JWT + calls AI gateway
```

## Contributing

Issues and PRs are welcome! If you spot a wrong translation for a particular query shape, open an issue with the input DSL, the produced C#, and the expected output — these become great few-shot examples to improve the prompt.

## License

MIT
