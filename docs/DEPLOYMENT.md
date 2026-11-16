# Déploiement — Le Cercle

Guide pas-à-pas pour mettre en ligne : **API NestJS + PostgreSQL/Redis/Meilisearch** (Railway) et **front Next.js** (Vercel).

> ⚠️ Avant de déployer, vérifie que tout tourne en local (`pnpm dev:web` + `pnpm dev:api`).

---

## Partie 1 — API + base de données (Railway)

1. Crée un compte [Railway](https://railway.app) et un nouveau **projet**.
2. Ajoute les services (onglet **New** → **Database** → **PostgreSQL**) : `postgres`, `redis`, `meilisearch` (via le template Meilisearch).
3. Ajoute le service **API** : **New** → **Deploy from GitHub repo**, choisis le dépôt, **Root Directory** = `apps/api`.
4. Dans **Variables** du service API, renseigne :
   - `DATABASE_URL` = URL fournie par le service Postgres de Railway (format `postgresql://…`).
   - `REDIS_URL` = URL du service Redis.
   - `MEILISEARCH_HOST` + `MEILISEARCH_MASTER_KEY` = URL/clé du service Meilisearch.
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` = 2 longues chaînes aléatoires.
   - `CORS_ORIGIN` = l'URL du front (ex. `https://lecercle.vercel.app`).
   - `API_PORT` = `3001`.
5. Build/start : Railway détecte le `package.json` de `apps/api` et exécute `nest build` puis `start` (ajoute un **Build Command** = `npm run build` et **Start Command** = `npm run start:prod` si besoin).
6. Une fois l'API en ligne, exécute les migrations + seed **une fois** (Railway → service API → **Shell**) :
   ```bash
   npx prisma migrate deploy --schema ../db/prisma/schema.prisma
   npx tsx ../db/prisma/seed.ts
   ```
   *(ou : déploie aussi le workspace `packages/db` et utilise `pnpm db:migrate`.)*

L'API est alors accessible sur `https://<ton-app>.up.railway.app/api/v1` (Swagger : `/docs`).

---

## Partie 2 — Front (Vercel)

1. Crée un compte [Vercel](https://vercel.com) → **Add New Project** → importe le dépôt.
2. **Root Directory** = `apps/web`.
3. **Framework Preset** = Next.js (détecté automatiquement).
4. **Environment Variables** :
   - `NEXT_PUBLIC_API_URL` = `https://<ton-app>.up.railway.app/api/v1`
   - `NEXT_PUBLIC_SITE_URL` = `https://<ton-domaine>`
5. **Deploy**. Le build (`next build`) est géré par Vercel.

> Le monorepo pnpm nécessite que Vercel l'installe en workspace : règle **Install Command** = `pnpm install` et active **"Include files outside root directory"** (ou place le `pnpm-lock.yaml` à la racine du dépôt).

---

## Partie 3 — Médias (obligatoire en prod)

Le stockage local `apps/api/uploads/` est **éphémère** sur Railway/Vercel. Remplace-le par un bucket S3-compatible :
- **Cloudflare R2**, **Wasabi** ou **AWS S3** (moins cher).
- Branche le module `media` sur le SDK S3 (upload signé + URL publique/CDN), ou mets un CDN devant les uploads.

---

## Partie 4 — Domaine + HTTPS + SEO

1. Ajoute ton domaine sur Vercel (front) et Railway (API sous-domaine `api.ton-domaine.com`).
2. `NEXT_PUBLIC_SITE_URL` → `https://ton-domaine.com` (le sitemap/robots/hreflang l'utilisent).
3. Mets à jour `CORS_ORIGIN` avec le domaine final.

---

## Partie 5 — Avant la mise en prod (checklist)

- [ ] Passerelle de paiement : CMI/Stripe (webhooks signés, idempotence) — remplacer le `pay` de démo.
- [ ] Emails : Resend/Brevo/SMTP + SPF/DKIM/DMARC.
- [ ] Stockage S3 des médias (Partie 3).
- [ ] Validation juridique : loi 09-08 (CNDP), signature électronique loi 53-05.
- [ ] Tests + Lighthouse ≥ 90 + axe (WCAG 2.1 AA).
- [ ] 2FA admin + rate limiting en production.
