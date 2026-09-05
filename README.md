# Rana Community Hub

Dynamic community, village and family heritage platform for the Rana community of Sayla State — Next.js + Payload CMS + PostgreSQL.

Planning docs live one level up in `../` — [BRD/SAD](../Rana_Community_Hub_BRD_SAD.md), [Phase Plan](../Rana_Community_Hub_Phasewise_Development_Plan.md), [UI/UX Theme](../Rana_Community_Hub_UIUX_Design_Theme.md).

## Status

Phase 0 through 4 are built: project foundation, Super Admin auth, the reusable Village template, the Family Tree / genealogy system (React Flow + dagre, search, privacy controls), the community content modules (Events, News, Gallery, Committee, Documents), and now Contact Us, global search, News/Gallery filtering, SEO (sitemap, robots.txt, Open Graph, structured data), security hardening (login lockout, secure cookies), and an audit log for admin/genealogy changes. Everything is styled with the "Legend Rajwada" dark theme (exact palette/fonts pulled from the real reference site) and responsive across desktop/tablet/mobile. See the [phase plan](../Rana_Community_Hub_Phasewise_Development_Plan.md) for the full breakdown.

Phase 5 (content population) is underway: the About Us page and all 9 village profiles now carry real, web-researched content on Sayla State's history, heritage and geography (not placeholder text), and the About Us page has been redesigned with a quick-facts strip, a jump-to-section nav, and a visual ruler-succession timeline instead of a single scroll of plain text. A **Family Tree Builder** admin tool (`/admin/family-tree-builder`) was also added — it lets the Super Admin add a new relative (parent, spouse or child) directly from a person's card on the visual tree, creating the person and the relationship together in one step, instead of creating a Family Member and a separate Family Relationship record independently.

## Prerequisites

- Node.js 20.9+ (developed against Node 22)
- pnpm (`corepack enable` if you don't have it)
- A local PostgreSQL server (you're installing this yourself — see below)

## 1. Set up PostgreSQL

1. Install PostgreSQL locally if you haven't already.
2. Create a database for this project, e.g.:
   ```sql
   CREATE DATABASE rana_community_hub;
   ```
3. Open `.env` in this folder and replace `YOUR_POSTGRES_PASSWORD` in `DATABASE_URL` with your actual Postgres password (and adjust the username/port if yours differ from the defaults `postgres` / `5432`).

`PAYLOAD_SECRET` has already been generated for you — no need to touch it.

## 2. Install dependencies

```bash
pnpm install
```

## 3. Run the dev server

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Admin panel: http://localhost:3000/admin — the first time you visit this, Payload will let you create the Super Admin account. This is the **only** admin account type in Phase 1 (see BRD v1.2 / SAD v1.1).

On first run against an empty database, Payload will prompt (in the terminal) to push the schema — accept it in dev. Proper migrations are generated later, closer to production (see Phase 4/5 of the phase plan).

## 4. Add content

From the admin panel:

1. **Website Settings** (global, left nav) — set the site name, tagline, and **Logo** (shown in both the header and the Home page hero, in a small circular badge). Under the Home Page tab: hero heading/subheading, plus a full-bleed hero background — either **Hero Images** (one static image, or two-plus auto-rotate as a slideshow) or a **Hero Video** (an uploaded mp4 file, plays muted/looping — takes priority over the images if both are set). Also intro text, About Us content, and contact/social info.
2. **Villages** — add the 9 Sayla State villages. Each needs at least: name, slug, cover image, short description, description, and it must be **published** (not just saved as draft) to appear on the public site.
3. **Family Members** — add people to a village. Set **Generation** (1 = founder), and note that a person only appears on the public tree once they're both **published** *and* **Display Status = Public** — this is a deliberate two-step approval gate per BRD's privacy requirements. Internal `Notes` are always admin-only regardless.
4. **Family Relationships** — connect people with a `Parent → Child` or `Spouse` relationship. Invalid relationships (self-relations, duplicates, or anything that would create a cycle) are rejected automatically.
   - Easier alternative to steps 3+4: use **Family Tree Builder** in the left nav (`/admin/family-tree-builder`). Pick a village, hover any person's card on the tree, and click **+ Parent / + Spouse / + Child** — type in a new person's name (or search and pick an existing person by photo) and it creates the person and the relationship together in one step.
5. **Media** — upload images here, or directly from the upload fields on Villages/Family Members/Website Settings.
6. **Events** — title, date/time, optional village (leave blank for community-wide), description, cover image. Publish to show it under `/events`.
7. **News & Announcements** — set **type** to Community, Village-Specific (village becomes required), or Notice.
8. **Gallery** — pick Photo or Video (embed link), a category, and optionally a village for filtering at `/gallery`.
9. **Committee Members** — name, position, photo, optional contact info, and an **order** number to control display order.
10. **Documents** — its own upload field (accepts PDF/Word/Excel/plain text only), with a category (Forms/Notices/Rules/Reports/Other).

Under Website Settings → Home Page, there's also a **History Section** (heading, richText content, optional image) — leave Content blank to keep it hidden; fill it in and it appears on the Home page above "Our Villages", which is now a single-row carousel with Previous/Next arrows rather than a grid.

Visit a village's page and click **View Family Tree**, or go to `/family-tree` for the full village list. Village-scoped Events/News/Gallery items automatically appear on that village's own page too, and community-wide Events/News/Gallery highlights show up on the Home page.

Contact form submissions and the audit log are both visible under `/admin` (Contact Submissions, Audit Log) — neither requires any external email/SMTP setup.

## Environment variables

- `DATABASE_URL`, `PAYLOAD_SECRET` — required, see above.
- `NEXT_PUBLIC_SITE_URL` — optional, used by the sitemap/robots.txt/Open Graph tags. Defaults to `http://localhost:3000`; set this to your real domain before Phase 5 launch.

## Deploying to production (e.g. Vercel)

Three things need to be set up before this deploys correctly on a serverless host (Vercel, Netlify, etc.) — without them the build itself fails, or it succeeds but the site is broken at runtime:

1. **A cloud-hosted Postgres database.** `DATABASE_URL` in your local `.env` points at `127.0.0.1`, which a serverless host can never reach. Create a database with any provider — [Neon](https://neon.tech) and [Supabase](https://supabase.com) both have a free tier, or use Vercel's own Storage tab (**Storage → Create Database → Postgres**, which provisions a Neon-backed database for you). Copy its connection string.
2. **Set environment variables in Vercel** (Project → Settings → Environment Variables): add `DATABASE_URL` (the connection string from step 1) and `PAYLOAD_SECRET` (any long random string — it doesn't need to match your local `.env` for a fresh database).
3. **Run database migrations as part of every deploy.** Payload's automatic dev-mode schema push (the "Pulling schema from database..." prompt you see with `pnpm dev`) only happens in dev mode — production expects real migration files. This repo has an initial migration at `src/migrations/`, and `pnpm run ci` (`payload migrate && next build`) applies it before building. **You must override Vercel's Build Command** to `pnpm run ci` (Project → Settings → Build & Development Settings) — otherwise Vercel will just run `next build` with no tables ever created, and every database-backed page will fail to prerender (`Error occurred prerendering page "..."`) or 500 at runtime. Whenever you add or change a CMS field/collection going forward, generate a new migration locally first with `pnpm payload migrate:create` and commit it — don't rely on dev-mode schema push for anything that needs to reach production.
4. **Media storage — code already handles this, you just need to connect a Blob store.** `@payloadcms/storage-vercel-blob` is wired into `payload.config.ts` for both the `Media` and `Documents` collections, but only activates when `BLOB_READ_WRITE_TOKEN` is set — without it (e.g. local dev), uploads fall back to Payload's default local disk storage, which is fine locally but doesn't persist on Vercel's read-only, ephemeral filesystem (every upload would 500 or 404 without this). To connect it: Vercel → your project → **Storage tab → Create Database → Blob**, then connect it to this project — Vercel auto-injects `BLOB_READ_WRITE_TOKEN` for you, no manual env var needed. Redeploy after connecting it.

## What's not built yet

Launch itself (Phase 5) — collecting real content, final QA, and production deployment (see "Deploying to production" above for the concrete blockers). A few Phase 4 items are deliberately deferred rather than built speculatively: automated backups (depends on the still-open hosting decision), analytics (not yet confirmed as required), and Gujarati language support (scope not yet confirmed). The multi-role admin model, membership directory, and other roadmap items (Phase 6+) are explicitly out of scope until a future BRD/SAD revision approves them.
