# DECISIONS.md — Le Cercle

Décisions techniques et hypothèses. Mise à jour au fil du chantier (protocole §1.1).

## Stack (validée, §17 du prompt)

- **Front** : Next.js (App Router, TypeScript, Tailwind CSS) — SSR/SSG pour les pages publiques.
- **Back** : NestJS (TypeScript), API REST `/api/v1`, documentée OpenAPI/Swagger.
- **Données** : PostgreSQL 16 + PostGIS (via Prisma), Redis (cache / files d'attente), Meilisearch (recherche).
- **Infra** : Docker Compose, monorepo pnpm workspaces.

## Décisions / hypothèses

1. **Monorepo pnpm** : `apps/*` (web, api) + `packages/*` (ui, db).
2. **Design tokens** : propriétés CSS (clair/sombre) + preset Tailwind. `border-radius: 0` partout (`* { border-radius: 0 !important }`).
3. **Logo** : l'icône « CT en forme de clé » est un SVG ; le **wordmark « le cercle » est du texte HTML** (Figtree 700), jamais une image — pour rester net et multilingue.
4. **PostGIS** : coordonnées `lat`/`lng` en `float` (Prisma) ; l'extension PostGIS est activée pour les requêtes spatiales avancées (phase 2, recherche par zone).
5. **Auth** : JWT access + refresh (httpOnly), RBAC granulaire **côté serveur** sur chaque endpoint, 2FA admin (TOTP) en tranche E.
6. **i18n** : `next-intl` — FR (défaut), AR (RTL), EN, ES ; URLs préfixées `/fr/ /ar/ /en/ /es/`.
7. **Paiement** : modules interchangeables (carte CMI/Payzone + Stripe, virement manuel) — Phase 3.
8. **Email** : fournisseur interchangeable (Resend/Brevo/Postmark/SMTP) — Phase 4.
9. **Légal** : conformité loi 09-08 (CNDP), signature électronique loi 53-05 — à valider avec un juriste avant prod.
10. **Photos** : placeholders en dégradé tant que les vraies images ne sont pas fournies (aucune donnée fictive en dur).

## Ambiguïtés / risques (non bloquants)

- **Passerelles de paiement** : identifiants et modes prod à fournir (bac à sable pour les tests).
- **RTL arabe** : vérifier chaque composant (carrousels, tableaux, icônes directionnelles, animations).
- **Volume de recherche** : Meilisearch est optionnel au début ; un filtre SQL suffit pour un faible volume.
- **Suppression de compte / export des données** (CNDP) : prévoir les jobs de purge dans l'admin.
