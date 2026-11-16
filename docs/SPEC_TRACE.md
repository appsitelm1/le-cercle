# SPEC_TRACE.md — Le Cercle

Matrice **exigence → écran → endpoint API → table(s) → test** (protocole §1.2).
Remplie au fur et à mesure ; chaque ligne de cette matrice doit être reliée à un endpoint, une table et un test avant de déclarer une phase terminée.

Légende statut : `—` non commencé · `~` en cours · `✓` vérifié.

| # | Exigence | Écran | Endpoint | Table(s) | Test | Statut |
|---|---|---|---|---|---|---|
| 1.1 | Inscription + connexion utilisateur | /connexion, /inscription | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` | users, roles | unit + e2e | — |
| 1.2 | Rôles & RBAC (user/agent/agence/promoteur/admin) | (transversal) | guard sur chaque route | roles, users | test RBAC par endpoint | — |
| 1.3 | Référentiel pays → régions → villes → quartiers (Maroc actif) | filtres, admin | `GET /geo/…` | countries, regions, cities, neighborhoods | unit + seed check | — |
| 1.4 | Thème clair/sombre mémorisé | en-tête | (côté client + profil) | users.theme | e2e | — |
| 1.5 | i18n FR / AR-RTL / EN / ES | global | (contenu traduit) | translations, languages | script « aucun texte en dur » | — |
| 1.6 | Logo + design system sans arrondi | global | (statique) | — | test visuel / script `border-radius` | — |
| 2.1 | Ajout / édition / publication d'annonce | /publier | `POST /listings`, `PUT /listings/:id` | listings, listing_features, listing_images | e2e | — |
| 2.2 | Recherche + filtres + carte | /recherche | `GET /listings` | listings (index ville/prix/type) | intégration | — |
| 2.3 | Fiche annonce + contact | /bien/:slug | `GET /listings/:slug`, `POST /leads` | listings, leads | e2e | — |
| 3.1 | Inscription pro → contrat → paiement → activation | /inscription-agent, /abonnement/paiement | `POST /professionals`, `POST /subscriptions`… | agents, agencies, contracts, payments, subscriptions | e2e | — |
| 4.1 | Messagerie interne + WhatsApp | /messages | `POST /conversations`… | conversations, messages | intégration | — |
| 4.2 | Leads (CRM léger) | /leads | `GET /leads`… | leads, lead_events | intégration | — |
| 5.1 | Dashboard admin + statistiques | /admin | `GET /admin/stats`… | (agrégats) | intégration | — |

> Les lignes 2.x à 5.x sont ajoutées par anticipation ; elles seront détaillées phase par phase.
