# Le Cercle — Portail immobilier professionnel

Monorepo de la plateforme **le cercle** (portail immobilier, marché marocain au lancement, architecture multi-pays prête).

> **Charte** : Professionnel — Compact — Moderne — Rapide — Responsive — **Sans arrondi** (`border-radius: 0` partout). Fond blanc lumineux, une couleur de marque corail (`#E00B41`), typographie **Figtree**, icônes au trait devant chaque libellé de menu, mode clair par défaut + bouton sombre.

## Stack

| Couche | Techno |
|---|---|
| Front | Next.js (App Router, TypeScript, Tailwind) |
| API | NestJS (TypeScript), REST `/api/v1`, OpenAPI |
| DB | PostgreSQL 16 + PostGIS (via Prisma) |
| Cache / files | Redis |
| Recherche | Meilisearch |
| Infra | Docker Compose + pnpm workspaces |

## Arborescence

```
le-cercle/
├── apps/
│   ├── web/          # Next.js (public + espaces + admin)
│   └── api/          # NestJS (API REST)
├── packages/
│   ├── ui/           # design system : tokens, preset Tailwind, logo, icônes
│   └── db/           # schéma Prisma + migrations + seeders
├── docs/             # PROGRESS.md, DECISIONS.md, SPEC_TRACE.md
├── docker-compose.yml
├── .env.example
└── package.json      # workspaces pnpm
```

## Prérequis

- Node.js ≥ 20, pnpm ≥ 9
- Docker (Postgres/PostGIS, Redis, Meilisearch)

## Démarrage rapide

```bash
# 1. Dépendances
pnpm install

# 2. Services (Postgres + Redis + Meilisearch)
docker compose up -d

# 3. Variables d'environnement
cp .env.example .env

# 4. Base de données
pnpm db:generate && pnpm db:migrate && pnpm db:seed

# 5. Lancement
pnpm dev:web   # http://localhost:3000
pnpm dev:api   # http://localhost:3001/api/v1
```

## Statut

Voir [`docs/PROGRESS.md`](docs/PROGRESS.md) — **Phase 1 (Socle) en cours**.

## Identité

- **Nom** : « le cercle » (wordmark en minuscules, Figtree 700).
- **Logo** : icône « CT en forme de clé » (anneau = C, clé = T tourné de 90°) — voir `packages/ui/logo/`.
- **Slogan** : « Entrez dans le cercle immobilier — Acheter, vendre, louer en toute simplicité. »
- **Baseline** : « Plateforme internationale des opportunités immobilières ».
