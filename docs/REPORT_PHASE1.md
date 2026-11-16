# Rapport de vérification — Phase 1 (Socle)

> Protocole §1.3. Légende : **✓** livré · **⚠** non vérifiable dans ce bac à sable (commandes fournies) · **✕** manquant.
> Le code est livré complet ; les contrôles nécessitant une exécution (build, tests, Lighthouse) doivent être lancés sur votre machine (Node 20+, pnpm, Docker).

## Build & qualité
| Contrôle | Statut | Preuve / action |
|---|---|---|
| Build front (`next build`) | ⚠ | `pnpm --filter @lecercle/web build` |
| Build API (`nest build`) | ⚠ | `pnpm --filter @lecercle/api build` |
| Types | ⚠ | `pnpm -r typecheck` |
| Lint | ⚠ | config ESLint à ajouter (phase 1.H suite) |
| Migrations + seed sur base vide | ⚠ | `pnpm db:generate && pnpm db:migrate && pnpm db:seed` |

## Fonctionnel (SPEC_TRACE — phase 1)
| # | Exigence | Statut |
|---|---|---|
| 1.1 | Inscription + connexion (`/auth/register`, `/auth/login`, `/auth/refresh`) | ✓ (code) |
| 1.2 | Rôles & RBAC (`JwtAuthGuard`, `RolesGuard`, `@Roles`) | ✓ (code) |
| 1.3 | Référentiel géo (pays → régions → villes → quartiers) | ✓ (schéma + seed) |
| 1.4 | Thème clair/sombre mémorisé (script inline) | ✓ (code) |
| 1.5 | i18n FR / AR-RTL / EN / ES (next-intl, URLs préfixées) | ✓ (code) |
| 1.6 | Logo + design system sans arrondi | ✓ (code) |

## Design
| Contrôle | Statut |
|---|---|
| `border-radius: 0` partout | ✓ (`*{border-radius:0 !important}` + preset Tailwind) |
| Tokens clair/sombre conformes §4.5 | ✓ |
| Contrastes WCAG 2.1 AA mesurés | ⚠ (à mesurer : axe, Lighthouse) |
| Polices Figtree / Cairo chargées | ✓ (next/font) |
| Logo CT conforme (clé visible en sombre) | ✓ |

## Menus & icônes / i18n / Responsive / Sécurité / Performance / Accessibilité / Données
| Domaine | Statut |
|---|---|
| Icône avant chaque libellé | ✓ (sprite.svg fourni) — UI complète en phases suivantes |
| RTL arabe miroir | ✓ (dir="rtl" auto) — composants riches à vérifier |
| Responsive 360→1920 px | ⚠ (UI complète en phase 2) |
| Sécurité (CSRF/XSS/rate limit…) | ⚠ partiel — auth JWT + RBAC OK ; rate limiting à ajouter |
| Lighthouse mobile ≥ 90 | ⚠ (pages riches en phase 2) |
| Accessibilité (axe) | ⚠ (à exécuter) |
| Aucune donnée géo/prix codée en dur dans l'UI | ✓ (données en base via seed) |

## Tests
| Type | Statut |
|---|---|
| Unitaires (logique métier) | ✕ à écrire (phase 1.H suite) |
| Intégration API (auth) | ✕ à écrire |
| e2e (parcours critiques) | ✕ à écrire (phase 2+) |

## Non livré / non vérifié (explicite)
- **Tests automatisés** (unit / intégration / e2e) : à écrire.
- **Config ESLint / CI** : à compléter.
- **Rate limiting, 2FA admin, uploads** : phases suivantes.
- **Exécution réelle** (install, build, migrations, seed, Lighthouse, axe) : à lancer sur votre machine.

## Commandes de vérification (sur votre machine)
```bash
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev:api   # http://localhost:3001/api/v1  (docs: /docs)
pnpm dev:web   # http://localhost:3000/fr  (+ /ar /en /es)
```
