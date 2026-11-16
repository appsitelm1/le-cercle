# Rapport de vérification — Phase 2 (Annonces)

> Protocole §1.3. Légende : **✓** livré · **⚠** non vérifiable dans ce bac à sable (commandes fournies) · **✕** manquant.

## Fonctionnel (SPEC_TRACE — phase 2)
| # | Exigence | Statut |
|---|---|---|
| 2.1 | Ajout / édition / publication d'annonce | ✓ (API : `POST/PATCH /listings`, statuts) |
| 2.2 | Recherche + filtres + tri + pagination | ✓ (API `GET /listings` + front `/recherche`) |
| 2.3 | Fiche annonce + contact (WhatsApp/appel/message) | ✓ (front `/bien/:id`, carte de contact collante) |
| 2.4 | Favoris (toggle + liste) | ✓ (API `/favorites` + front `/favoris` + bouton cœur) |
| 2.5 | Médias (upload) | ✓ (API `/media/upload` + `POST /listings/:id/images`) |
| 2.6 | Carte | ✓ (OpenStreetMap sur la fiche, coordonnées seed) |

## Build & qualité
| Contrôle | Statut |
|---|---|
| Build front / API / types | ⚠ `pnpm -r build`, `pnpm -r typecheck` |
| Migrations + seed (démo) | ⚠ `pnpm db:migrate && pnpm db:seed` |
| Tests unitaires / intégration / e2e | ✕ à écrire (phase 6) |

## Design / i18n / Responsive / Données
| Contrôle | Statut |
|---|---|
| Cartes compactes 4:3, sans arrondi | ✓ |
| i18n FR/EN/ES/AR (namespace `listings`, `auth`) | ✓ |
| RTL arabe | ✓ (auto via `dir="rtl"`) |
| Responsive (grille 2/3/4 colonnes) | ✓ (à vérifier visuellement) |
| Données de démo marquées + supprimables | ✓ (compte `admin@lecercle.test`, refs `DEMO-…`) |
| Compression d'images (WebP/AVIF) | ✕ (à faire en phase 6, `sharp`) |

## Non livré / non vérifié (explicite)
- Formulaire multi-étapes « Publier un bien » (front) — l'API est prête, l'UI arrive en phase 5/admin.
- Vue « Carte » plein écran avec regroupement de marqueurs (Leaflet) — actuellement iframe OSM simple.
- Compression/redimensionnement automatique des images.
- Tests automatisés.

## Commandes de vérification
```bash
pnpm install && docker compose up -d && cp .env.example .env
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev:api   # http://localhost:3001/api/v1
pnpm dev:web   # http://localhost:3000/fr  (+ /recherche, /bien/:id, /connexion, /favoris)
```
