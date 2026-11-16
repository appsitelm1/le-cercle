# Rapport de vérification — Phase 4 (Communication)

> Protocole §1.3. Légende : **✓** livré · **⚠** non vérifiable dans ce bac à sable · **✕** manquant.

## Fonctionnel (SPEC_TRACE — phase 4)
| # | Exigence | Statut |
|---|---|---|
| 4.1 | Messagerie interne (acheteur ↔ pro) | ✓ (`/messages` API + front `/messages`) |
| 4.2 | WhatsApp / appel (liens `wa.me`, `tel:`) | ✓ (fiche annonce) |
| 4.3 | Leads (CRM léger) : création, statuts, événements | ✓ (`/leads` API + formulaire de contact) |
| 4.4 | Notifications internes | ✓ (`/notifications` API + front, notification auto sur lead) |
| 4.5 | Emails / campagnes (modèles, envoi, suivi) | ⚠ partiel — tables prêtes (`EmailTemplate`, `Campaign`, `EmailLog`, `Suppression`), envoi réel en phase 5/6 |
| 4.6 | Conformité (désabonnement, consentement) | ⚠ tables prêtes (`Suppression`), logique à câbler |

## Build & qualité
| Contrôle | Statut |
|---|---|
| Build / types | ⚠ `pnpm -r build`, `pnpm -r typecheck` |
| Migrations | ⚠ `pnpm db:migrate` |
| Tests unitaires / e2e | ✕ à écrire (phase 6) |

## À signaler (explicite)
- **Envoi d'emails réel** (Resend/Brevo/SMTP, SPF/DKIM/DMARC) : fournisseur à configurer ; les tables et modèles sont prêts, l'émetteur arrive en Phase 5/6.
- **WhatsApp Business API** : les liens `wa.me` pré-remplis fonctionnent ; l'API (webhook entrant) est optionnelle.
- **Messages non lus / temps réel** : polling simple côté front ; WebSocket/SSE non implémenté (phase 6).

## Commandes de vérification
```bash
pnpm install && docker compose up -d && cp .env.example .env
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev:api   # http://localhost:3001/api/v1
pnpm dev:web   # http://localhost:3000/fr  (+ /messages, /notifications, fiche annonce → formulaire de contact)
```
