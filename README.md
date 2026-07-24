# Al Athaq Boutique

Production-grade marketing + catalog site for **Al Athaq Boutique** — a heritage-modern gift boutique specializing in incense/bakhoor and Middle Eastern gifts.

**Tagline:** *Tradition you can carry home.*

## Stack

- **Next.js 14** (App Router) + React Server Components
- **TypeScript** (strict)
- **PostgreSQL** + **Prisma ORM**
- **Tailwind CSS** (brand tokens)
- Deployable on **Replit** (secrets via environment variables)

## Quick start

```bash
npm install
cp .env.example .env   # then set DATABASE_URL
npm run dev
```

The homepage **always renders** on first `npm run dev`, even without a live database or uploaded assets — using brand radial-gradient + diamond-motif placeholders. When Postgres is configured and seeded, content is loaded from the DB (ISR, 60s).

### Database setup

1. Create a PostgreSQL database (local, Replit, Neon, Supabase, etc.).
2. Set secrets in `.env` (never commit them):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

3. Apply migrations and seed:

```bash
npx prisma migrate deploy
npx prisma db seed
# or: npm run db:setup
```

### Where to drop uploaded assets

Place media files in **`/public/assets`** using these basenames (any popular web format works):

| Slot | Default filename | Also accepts |
|------|------------------|--------------|
| Hero background | `hero-bg.png` | `.jpg`, `.webp`, `.gif`, `.avif`, `.svg`, `.mp4`, `.webm`, … |
| Products 1–7 | `product-1` … `product-7` (+ extension) | same |
| Our Story photo | `us.png` | same |
| Our Story background | `our-story-bg.png` | same |

Examples that all work without code changes:

- `public/assets/hero-bg.mp4`
- `public/assets/product-3.webp`
- `public/assets/us.svg`
- `public/assets/our-story-bg.jpg`

The shared `<Media>` component detects type by extension and renders `<video>`, Next.js `<Image>`, or `<img>` for SVG. Missing files fall back to brand placeholders.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development |
| `npm run build` | Generate Prisma client + production build |
| `npm start` | Start production server |
| `npm run db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed SiteSettings, FeaturedTiles, Products |
| `npm run lint` | ESLint |

## Project structure

```
prisma/
  schema.prisma          # SiteSettings, FeaturedTile, Product
  seed.ts
  migrations/
public/                  # Static root
  assets/                # Drop hero-bg, product-*, us, our-story-bg here
src/
  app/                   # App Router pages, sitemap, robots, API
  components/            # Nav, Hero, Featured, OurStory, Products, Footer, Media
  lib/                   # prisma, data, media resolution, zod, rate-limit
```

## Brand

- **Fonts:** Marcellus (display) + Work Sans (UI) via `next/font/google`
- **Colors:** Athaq Purple `#6C3FA4`, Souk Teal `#178C86`, Lapis `#2E6BE6`, Warm Cream `#FBF5EC`, Ink `#2A2320`
- **Motif:** rotated-square diamonds + dotted geometric tiles
- **Buttons / nav:** super-rounded pills

## SEO & security

- Metadata API (title, description, Open Graph, Twitter)
- JSON-LD: Organization, Store/LocalBusiness, Product ItemList
- `app/sitemap.ts` + `app/robots.ts`
- Security headers in `next.config.mjs` (CSP, HSTS, frame deny, nosniff, Referrer-Policy, Permissions-Policy)
- Zod validation + in-memory rate limit + same-origin check on `/api/newsletter`
- Secrets only via env vars; Prisma parameterized queries only

## Replit

1. Import the repo / upload the project.
2. Add Secrets: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL` (your Replit URL).
3. Provision Postgres (Replit DB / external).
4. Run `npm install`, `npm run db:setup`, then `npm run dev` (or configure the Run button for `npm run build && npm start`).
5. Upload media into `public/assets/`.

## Notes

- Client JS is limited to Nav (scroll + mobile drawer), Hero entrance, and Featured hover/tap.
- Videos use `preload="metadata"`, muted + loop + playsInline; hero may autoplay.
- `prefers-reduced-motion` is respected for animations.
- Without `DATABASE_URL` or if the DB is unreachable, the site serves the same seed content from the in-code defaults layer so marketing pages never go blank.
