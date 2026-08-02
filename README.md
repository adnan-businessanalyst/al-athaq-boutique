# Al Athaq Boutique

Production-minded marketing + catalog site for **Al Athaq Boutique** — heritage-modern gifts (bakhoor, lanterns, textiles, jewelry).

**Tagline:** *Tradition you can carry home.*

## Stack

- **Next.js 14** (App Router) — storefront + admin UI at `/my-access-nimda`
- **Express API** (`apps/api`) — auth + product CRUD + Mailgun
- **PostgreSQL on Neon** via **Prisma** (shared schema)
- **Tailwind CSS** (brand tokens)
- Deploy: **Vercel** (Next) + **Railway / Render / Fly** (Express)

## Quick start

```bash
npm install
cp .env.example .env   # fill Neon + JWT + admin bootstrap + API URL
npm run db:setup       # migrate + seed (including hashed AdminUser)
npm run dev            # Next on :3000
npm run dev:api        # Express on :4000 (second terminal)
```

### Local cart + checkout demo (no payment / Mailgun / WhatsApp API)

1. Ensure `NEXT_PUBLIC_API_URL=http://localhost:4000` and API is running.
2. Open `http://localhost:3000/#products` — use **+ / −** on a card (default variant) or open a PDP at `/products/[slug]`.
3. Open **Cart** → **Checkout**.
4. Guest: enter email, phone, name, address. Use seeded zone location e.g. city `Riyadh`, district `Olaya` (or `Jeddah` / `Corniche`).
5. Click **Validate delivery location** → pick date + time slot → accept policy → **Place order**.
6. Land on `/order/confirm/ATH-…` — confirmation number, UNPAID status, email stub note, WhatsApp deep-link button (no live send).
7. Admin: `/my-access-nimda` → **Orders** / **Delivery** / **Settings** / product **Variants**.

Prices are stored in **halalas** (1 SAR = 100) and displayed as SAR. Server recalculates totals on order create.

Homepage settings/featured can fall back to in-code defaults if the DB is unreachable. **Products never use hardcoded catalog fallbacks** — empty state is shown until Neon has products.

### Neon setup

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. Copy the connection string into `DATABASE_URL` (add `?sslmode=require` if missing).
3. Use the same `DATABASE_URL` for Next and Express.
4. Run:

```bash
npx prisma migrate deploy
npx prisma db seed
```

### Admin bootstrap (login only — no signup)

Set in `.env` (seed hashes the bootstrap password with argon2; API never compares plaintext):

```env
ADMIN_EMAIL="adnan.akhonbay@gmail.com"
ADMIN_BOOTSTRAP_PASSWORD="alathaqboutique@1234"
PASSWORD_MAX_AGE_DAYS=5
JWT_SECRET="long-random-secret"
```

- Seed creates `AdminUser` only if that email does not already exist.
- Passwords expire every **5 days**; change via `POST /auth/change-password` or the control panel.
- Login UI labels show the bootstrap email/password for **initial access only**. After you rotate the password, keep using your new password (labels may still show bootstrap values for convenience — they are not auth secrets).

Control panel: **http://localhost:3000/my-access-nimda**

### Express API

| Method | Path | Notes |
|--------|------|--------|
| POST | `/auth/login` | Cookie + JWT; may return `PASSWORD_EXPIRED` |
| POST | `/auth/logout` | Clears session cookie |
| GET | `/auth/me` | Expiry status / days remaining |
| POST | `/auth/change-password` | Auth required; updates hash + `passwordChangedAt` |
| GET/POST/PATCH/DELETE | `/products` | Auth + fresh password required |
| POST | `/newsletter` | Mailgun notify when configured |

CORS allows `FRONTEND_URL` only. Login is rate-limited.

### Mailgun

On the Express host set:

```env
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=mg.example.com
MAILGUN_FROM="Al Athaq Boutique <noreply@mg.example.com>"
```

Add Mailgun DNS (SPF/DKIM) in your DNS provider. Used for login notification, password-changed confirmation, and newsletter signups (Next `/api/newsletter` proxies to the API when `NEXT_PUBLIC_API_URL` is set).

### Env reference

See `.env.example`. Important keys:

| App | Variable |
|-----|----------|
| Both | `DATABASE_URL` |
| Next | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `REVALIDATE_SECRET` |
| API | `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD`, `PASSWORD_MAX_AGE_DAYS`, `MAILGUN_*`, `NEXT_REVALIDATE_URL`, `REVALIDATE_SECRET` |

Never commit `.env` or production secrets.

### Deploy

**Next (Vercel)**  
- Root directory: repo root  
- Env: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL` (public API URL), `REVALIDATE_SECRET`  
- Build: `npm run build`

**Express (Railway / Render / Fly)**  
- Root / start: `apps/api` — `npm run build && npm start` (or workspace: `npm run build:api && npm run start:api`)  
- Env: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (Vercel URL), Mailgun, `PASSWORD_MAX_AGE_DAYS`, optional revalidate URL/secret  
- Ensure Prisma client is generated (`prisma generate` from repo root in build)

### Assets

Place media in `public/assets/` (`hero-bg`, `product-*`, `us`, `our-story-bg`, …).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next storefront + admin UI |
| `npm run dev:api` | Express API |
| `npm run build` / `start` | Next production |
| `npm run build:api` / `start:api` | API production |
| `npm run db:setup` | Migrate + seed |
| `npm run lint` | ESLint |

## Project structure

```
apps/api/                # Express auth + product CRUD + Mailgun
prisma/                  # Shared schema (SiteSettings, Featured, Product, AdminUser)
src/app/                 # Storefront + /my-access-nimda
src/app/api/newsletter   # Proxies to Express when configured
src/app/api/revalidate   # On-demand ISR for homepage
```

## Brand

- **Fonts:** Marcellus + Work Sans  
- **Colors:** Athaq Purple `#6C3FA4`, Souk Teal `#178C86`, Warm Cream `#FBF5EC`, Ink `#2A2320`

## SEO & security

- Admin routes: `noindex` metadata + `robots.txt` disallow `/my-access-nimda`
- Auth: argon2 password hashes, JWT httpOnly cookie (+ Bearer fallback), 5-day rotation
- Rate-limited login; CORS locked to frontend origin(s)
- Security headers in `next.config.mjs`
