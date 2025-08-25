# Birthday Invite Web

Modern invite and RSVP app for a Aarvi's 4th birthday. Built with Next.js (App Router), Tailwind, and Vercel Postgres. Includes guest RSVP page, update via code, and host dashboard with CSV export.

## Local Development

1. Install deps:
   - `npm install`
2. Run the dev server:
   - `npm run dev`
3. Storage options:
   - Without Postgres, it falls back to `rsvps.local.json` in the project root for development.
   - To use Vercel Postgres locally, set `POSTGRES_URL` env.

## Environment Variables

Copy and set the following in your Vercel project settings (or a local `.env.local`):

```
ADMIN_KEY=your-strong-admin-key
# Guests must provide this key to RSVP
INVITE_KEY=your-invite-key
# Enable fun captcha (optional but recommended in production)
CAPTCHA_SECRET=your-long-random-secret
# POSTGRES_URL=... (set automatically when you add Vercel Postgres integration)
```

## Deploy to Vercel

1. Push to GitHub/GitLab/Bitbucket.
2. Import the repo in Vercel.
3. Add an Environment Variable `ADMIN_KEY` in Vercel Project Settings.
4. (Optional) Add the Vercel Postgres integration to enable hosted storage.

## Routes

- `/` Invitation landing page
- `/rsvp` Guest RSVP and update page (supports `?id=XXXX`)
- `/api/rsvp` Create/Update GET/POST endpoint
- `/admin` Host dashboard (requires `ADMIN_KEY`)
- `/api/admin/rsvps` Secured list endpoint (requires header `x-admin-key`)


