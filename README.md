# Rana Community Hub

Dynamic community, village and family heritage platform for the Rana community of Sayla State — Next.js + Payload CMS + PostgreSQL.

Planning docs live one level up in `../` — [BRD/SAD](../Rana_Community_Hub_BRD_SAD.md), [Phase Plan](../Rana_Community_Hub_Phasewise_Development_Plan.md), [UI/UX Theme](../Rana_Community_Hub_UIUX_Design_Theme.md).

## Status

Phase 0 through 4 are built: project foundation, Super Admin auth, the reusable Village template, the Family Tree / genealogy system (React Flow + dagre, search, privacy controls), the community content modules (Events, News, Gallery, Committee, Documents), and now Contact Us, global search, News/Gallery filtering, SEO (sitemap, robots.txt, Open Graph, structured data), security hardening (login lockout, secure cookies), and an audit log for admin/genealogy changes. Everything is styled with the "Legend Rajwada" dark theme (exact palette/fonts pulled from the real reference site) and responsive across desktop/tablet/mobile. See the [phase plan](../Rana_Community_Hub_Phasewise_Development_Plan.md) for the full breakdown.

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

## What's not built yet

Launch itself (Phase 5) — collecting real content, final QA, and production deployment. A few Phase 4 items are deliberately deferred rather than built speculatively: automated backups (depends on the still-open hosting decision), analytics (not yet confirmed as required), and Gujarati language support (scope not yet confirmed). The multi-role admin model, membership directory, and other roadmap items (Phase 6+) are explicitly out of scope until a future BRD/SAD revision approves them.
