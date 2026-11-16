# Rapport de vérification — Phase 3 (Professionnels)

> Protocole §1.3. Légende : **✓** livré · **⚠** non vérifiable dans ce bac à sable (commandes fournies) · **✕** manquant.

## Fonctionnel (SPEC_TRACE — phase 3)
| # | Exigence | Statut |
|---|---|---|
| 3.1 | Inscriptions agent / agence / promoteur | ✓ (`POST /professionals/{agent,agency,developer}`) |
| 3.2 | Contrat auto + acceptation tracée (IP, date, version) | ✓ (`POST /professionals/contracts/:id/accept`) |
| 3.3 | Abonnement + paiement + facture + activation | ✓ (`POST /professionals/subscriptions/:id/pay`) |
| 3.4 | Validation admin (RBAC) | ✓ (`PATCH /professionals/:type/:id/activate`) |
| 3.5 | Statut affiché dans le dashboard pro | ✓ (`GET /professionals/me` + `/espace-pro`) |
| 3.6 | Relances automatiques (contrat, paiement, expiration) | ✓ (`@nestjs/schedule`, cron 6h) |
| 3.7 | Suspension automatique à l'expiration | ✓ (cron : `EXPIRED` + pro `SUSPENDED`) |

## Build & qualité
| Contrôle | Statut |
|---|---|
| Build / types | ⚠ `pnpm -r build`, `pnpm -r typecheck` |
| Migrations (nouvelles tables) | ⚠ `pnpm db:migrate` |
| Tests unitaires / e2e | ✕ à écrire (phase 6) |

## À signaler (explicite)
- **Passerelle de paiement** : le `pay` marque `SUCCEEDED` directement (démo). En prod : `PENDING` puis **webhook** CMI/Stripe (signature vérifiée, idempotence) → `SUCCEEDED`.
- **Relances** : actuellement **journalisées** (log). Le branchement vers notifications + emails arrive en Phase 4 (messagerie/notifications).
- **Contenu des contrats** : modèle par défaut, éditable depuis l'admin (Phase 5).
- **Fichiers de vérification** (documents pro) : upload prévu en Phase 4/5.
- **Front promoteur** : l'inscription promoteur est disponible via l'API (même flux que l'agence) ; la page dédiée `/inscription-promoteur` reste à ajouter.

## Commandes de vérification
```bash
pnpm install && docker compose up -d && cp .env.example .env
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev:api   # http://localhost:3001/api/v1
pnpm dev:web   # http://localhost:3000/fr  (+ /espace-pro, /inscription-agent, /inscription-agence)
```
