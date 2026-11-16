# Rapport de vérification — Phase 5 (Administration)

> Protocole §1.3. Légende : **✓** livré · **⚠** non vérifiable dans ce bac à sable · **✕** manquant.

## Fonctionnel (SPEC_TRACE — phase 5)
| # | Exigence | Statut |
|---|---|---|
| 5.1 | Dashboard admin + statistiques | ✓ (`GET /admin/stats` + cartes) |
| 5.2 | Modération des annonces (publier/refuser) | ✓ (`PATCH /admin/listings/:id/status` + UI) |
| 5.3 | Validation des professionnels | ✓ (`PATCH /admin/professionals/:type/:id/status` + UI) |
| 5.4 | Gestion utilisateurs (suspendre/bloquer) | ✓ (`PATCH /admin/users/:id/status`) |
| 5.5 | Paramètres sans code (marque, prix abonnements) | ✓ (`Setting` + `GET/PATCH /admin/settings` + formulaire) |

## Build & qualité
| Contrôle | Statut |
|---|---|
| Build / types | ⚠ `pnpm -r build`, `pnpm -r typecheck` |
| Migrations (table `settings`) | ⚠ `pnpm db:migrate` |
| Tests unitaires / e2e | ✕ à écrire (phase 6) |

## À signaler (explicite)
- **Statistiques graphiques** (évolution temporelle, ventes vs locations, par ville) : compteurs fournis, **graphiques/agrégats temporels** à ajouter (phase 6).
- **Paramètres étendus** (couleurs/mode sombre, logo upload, menus/icônes, modèles de contrats/emails, SEO) : la structure `Setting` (clé→valeur) est prête ; seul un sous-ensemble est exposé dans l'UI (marque + prix d'abonnement).
- **Gestion des paiements / factures** côté admin : tables prêtes, écrans dédiés non construits.

## Commandes de vérification
```bash
pnpm install && docker compose up -d && cp .env.example .env
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev:api   # http://localhost:3001/api/v1
pnpm dev:web   # http://localhost:3000/fr/admin  (admin@lecercle.test / demo1234)
```
