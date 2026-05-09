## Goal

Restrict the `translate-query` edge function so only your client app can call it — with **real protection** against someone copying credentials out of your JS bundle. No user login required.

## Approach: Anonymous Supabase sessions + JWT verification

Instead of a static shared key (which leaks the moment someone opens DevTools), the client will silently sign in as an **anonymous user** on first load. Supabase issues a short-lived JWT tied to that session. The edge function verifies the JWT on every request.

Why this is real protection:
- The JWT is **issued server-side per session**, not embedded in your bundle.
- Tokens **expire** (~1 hour) and auto-refresh.
- An attacker can't just copy a string from your code — they'd have to script the full anon-signin flow, and you can shut that down (disable anon signups, rotate keys, add Turnstile) the moment you see abuse.
- The Supabase anon/publishable key in your bundle is **designed to be public** — it only lets clients hit the auth endpoint, nothing else.

## Plan

### 1. Enable anonymous sign-ins
Use `configure_auth` to set `external_anonymous_users_enabled: true`. This lets the client create throwaway sessions without email/password.

### 2. Client: auto-sign-in anonymously
In `src/App.tsx` (or a new `src/hooks/useAnonAuth.ts`):
- On mount, call `supabase.auth.getSession()`.
- If no session, call `supabase.auth.signInAnonymously()`.
- Set up `onAuthStateChange` listener (set up **before** `getSession` per Supabase guidance) so token refreshes are handled automatically.
- The Supabase client already persists the session in localStorage, so returning visitors reuse the same anon user.

### 3. Edge function: verify the JWT
In `supabase/functions/translate-query/index.ts`:
- Read the `Authorization: Bearer <jwt>` header (the Supabase client sends this automatically when calling via `supabase.functions.invoke`).
- Create a Supabase client scoped to that header and call `supabase.auth.getClaims(token)`.
- If invalid/missing → return `401` with CORS headers.
- Keep existing CORS preflight + streaming response logic intact.

### 4. Switch the client call to `supabase.functions.invoke`
In `src/hooks/useTranslation.ts`:
- If it currently uses raw `fetch`, switch to `supabase.functions.invoke('translate-query', { body: {...} })` so the auth header is attached automatically.
- If streaming must be preserved with raw `fetch`, manually attach `Authorization: Bearer ${session.access_token}` from the current session.

### 5. Lightweight per-user rate limit (defense in depth)
Inside the edge function, add an in-memory `Map` keyed by `claims.sub` (the anon user's UUID): e.g. 30 requests/minute. Caps abuse if someone scripts the anon-signin flow.

## Technical details

- **No DB tables, no profiles, no migration needed.** Anonymous users live in `auth.users` with `is_anonymous = true`.
- **`verify_jwt` stays at the default** (false in `config.toml`) because we validate explicitly with `getClaims()` per Lovable's signing-keys guidance — gives us better error messages and lets us read the claim.
- **Session persistence** is already configured in `src/integrations/supabase/client.ts` (`persistSession: true`, localStorage).
- **Files touched:**
  - `supabase/functions/translate-query/index.ts` — JWT verification + rate limit
  - `src/App.tsx` or new `src/hooks/useAnonAuth.ts` — anon sign-in bootstrap
  - `src/hooks/useTranslation.ts` — ensure auth header is sent
- **Auth config change:** enable anonymous sign-ins via `configure_auth`.

## Threat model — what this stops

| Threat | Stopped? |
|---|---|
| Random `curl` to the function URL | Yes (no JWT → 401) |
| Copying a key out of the JS bundle | Yes (no usable key exists in bundle) |
| Replaying a captured JWT after expiry | Yes (~1 hour TTL) |
| Scripting the full anon-signin flow | Mitigated by per-user rate limit; you can disable anon auth or rotate keys to kill it |
| Abuse from a single anon session | Capped by rate limit |

## Optional follow-ups (not in this plan, mention if you want)

- Add **Cloudflare Turnstile** before anon sign-in for bot resistance.
- Move the in-memory rate limit to a Postgres table or Upstash Redis if you scale to multiple edge instances.
