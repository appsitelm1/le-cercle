# Rapport de vérification — Phase 6 (Finitions)

> Protocole §1.3. Légende : **✓** livré · **⚠** non vérifiable dans ce bac à sable · **✕** manquant.

## Fonctionnel (SPEC_TRACE — phase 6)
| # | Exigence | Statut |
|---|---|---|
| 6.1 | SEO multilingue (sitemap, robots, hreflang, Open Graph) | ✓ (`app/sitemap.ts`, `app/robots.ts`, `alternates.languages`) |
| 6.2 | PWA (manifest + icônes) | ✓ (`app/manifest.ts` + icônes 192/512/maskable/apple/favicon) |
| 6.3 | Tests automatisés | ⚠ partiel — harnais Vitest + 1 test unitaire (`slugify`), suites d'intégration/e2e à écrire |
| 6.4 | Capacitor (Android/iOS) | ✕ à configurer (hors périmètre bac à sable) |
| 6.5 | Langues supplémentaires (Amazigh, PT, DE, IT…) | ⚠ données prêtes (seed `Language`), UI à activer via `routing.locales` |
| 6.6 | Ouverture d'autres pays | ⚠ 29 pays seedés (Maroc actif), activation admin |

## Build & qualité
| Contrôle | Statut |
|---|---|
| Build front / API / types | ⚠ `pnpm -r build`, `pnpm -r typecheck` |
| Tests unitaires | ⚠ `pnpm --filter @lecercle/api test` |
| Migrations + seed | ⚠ `pnpm db:migrate && pnpm db:seed` |
| Lighthouse / axe / WCAG | ⚠ à exécuter sur votre machine |

## Bilan global du chantier (6 phases livrées)
- **~70 fichiers** de code source (front Next.js + API NestJS + schéma Prisma + seed + docs).
- **33 modèles** de base de données.
- **FR / AR-RTL / EN / ES** complets + 8 langues prêtes à activer.
- Parcours couverts : recherche → fiche → contact/lead ; inscription pro → contrat → paiement → activation ; messagerie, notifications, favoris, admin/modération.

## Reste à faire (explicite, hors bac à sable)
1. **Exécution réelle** : `pnpm install && docker compose up -d && pnpm db:migrate && pnpm db:seed` puis `pnpm dev:api` + `pnpm dev:web`.
2. **Passerelles réelles** : paiement CMI/Stripe (webhooks), emails (Resend/Brevo/SMTP), vraies photos.
3. **Tests d'intégration/e2e** complets + Lighthouse/axe.
4. **Capacitor** + build apps stores.
5. **Légal** : validation juriste (loi 09-08, signature électronique 53-05).

## Commandes de vérification globales
```bash
pnpm install && docker compose up -d && cp .env.example .env
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev:api   # http://localhost:3001/api/v1  (docs /docs)
pnpm dev:web   # http://localhost:3000/fr  (+ /recherche, /bien/:id, /connexion, /favoris, /messages, /notifications, /espace-pro, /inscription-agent, /inscription-agence, /admin)
```
