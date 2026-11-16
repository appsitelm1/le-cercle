# PROGRESS.md — Le Cercle

État global : **Chantier livré — 6 phases sur 6** (code complet ; exécution/vérification à lancer sur votre machine)

## Phases

- [x] **Étape 0** — estimation + GO
- [x] **1. Socle** — LIVRÉ (vérification à exécuter côté machine — voir `REPORT_PHASE1.md`)
  - [x] 1.A Fondations (monorepo, Docker, env, docs)
  - [x] 1.B Design system (tokens clair/sombre, preset Tailwind, logo, icônes)
  - [x] 1.C Base de données (schéma core : users, rôles, référentiel géographique)
  - [x] 1.D Apps web (Next.js) + api (NestJS)
  - [x] 1.E Authentification + RBAC
  - [x] 1.F i18n FR / AR-RTL / EN / ES
  - [x] 1.G Seeders Maroc (12 régions, villes, quartiers)
  - [x] 1.H Rapport de vérification Phase 1
- [x] **2. Annonces** — LIVRÉ (vérification à exécuter — voir `REPORT_PHASE2.md`)
  - [x] 2.A Schéma DB (listings, images, features, favorites)
  - [x] 2.B API listings (CRUD + recherche/filtres + favoris)
  - [x] 2.C Front : recherche + résultats + fiche (+ données démo)
  - [x] 2.D Médias (upload) + carte + favoris UI + connexion front
  - [x] 2.E Rapport de vérification Phase 2
- [x] **3. Professionnels** — LIVRÉ (vérification à exécuter — voir `REPORT_PHASE3.md`)
  - [x] 3.A Schéma DB (agents, agences, promoteurs, contrats, abonnements, paiements, factures)
  - [x] 3.B API professionnels (inscription → contrat → paiement → activation)
  - [x] 3.C Front : pages d'inscription + dashboard pro (statuts/activation)
  - [x] 3.D Relances automatiques (cron)
  - [x] 3.E Rapport de vérification Phase 3
- [x] **4. Communication** — LIVRÉ (vérification à exécuter — voir `REPORT_PHASE4.md`)
  - [x] 4.A Schéma DB (conversations, messages, leads, notifications, emails, campagnes)
  - [x] 4.B API (messages, leads, notifications)
  - [x] 4.C Front (formulaire de contact, messagerie, notifications)
  - [x] 4.D Rapport de vérification Phase 4
- [x] **5. Administration** — LIVRÉ (vérification à exécuter — voir `REPORT_PHASE5.md`)
  - [x] 5.A API admin (stats, modération annonces, utilisateurs, validation pros)
  - [x] 5.B Front admin (dashboard + modération)
  - [x] 5.C Paramètres sans code (couleurs, logo, menus, abonnements, modèles, SEO)
  - [x] 5.D Rapport de vérification Phase 5
- [x] **6. Finitions** — LIVRÉ (vérification à exécuter — voir `REPORT_PHASE6.md`)
  - [x] 6.A SEO multilingue (sitemap, robots, hreflang, Open Graph)
  - [x] 6.B PWA (manifest + icônes)
  - [x] 6.C Harnais de tests (Vitest + test unitaire)
  - [x] 6.D Rapport de vérification Phase 6

## Journal

- **Phase 1 · tranche A** — monorepo pnpm, `docker-compose.yml` (Postgres/PostGIS + Redis + Meilisearch), `.env.example`, mémoire projet (`DECISIONS.md`, `SPEC_TRACE.md`), README.

> Règle : une phase n'est « terminée » que si le Rapport de vérification (§1.3) ne contient **aucun ✕**.
