# SETUP_STATUS.md — reprise du lancement local (version complète)

État au moment de la pause (session interrompue par l'utilisateur). À relire au retour.

## Déjà en place (sur disque, persiste)

- **Front Next.js** : code + dépendances installées dans `le-cercle/` (mais `node_modules` du web est **cassé** — voir ci-dessous).
- **PostgreSQL portable** :
  - binaires : `C:\pg\bin\` (initdb.exe, pg_ctl.exe, postgres.exe + DLL UCRT copiées).
  - données initialisées : `C:\pgdata\` (superuser `lecercle`, auth `trust`).
  - DLL UCRT manquantes récupérées depuis `C:\Program Files\Stirling PDF\runtime\jre\bin\` → copiées dans `C:\pg\bin`.
- **Dépendances API** : installées (443 paquets) ; builds natifs `argon2` / `@prisma/*` / `esbuild` **rebuildés OK**.
- `.env` créé à la racine (`DATABASE_URL=postgresql://lecercle:lecercle@localhost:5432/lecercle`).

## Ce qui tourne / tournait (jobs en arrière-plan)

- `postgres.exe -D C:\pgdata -p 5432` → était démarré (port 5432 OK).
- Serveur Next.js `dev` → démarré mais **cassé** (voir cause).
- `prisma generate` → en cours au moment de la pause (résultat à vérifier).

## ⚠️ Problème en cours : « Failed to compile » (front)

**Cause** : le `pnpm install --filter @lecercle/api...` (avec purge de `node_modules` due au changement de `onlyBuiltDependencies`) a **ré-linké partiellement** les modules et cassé le paquet `next` du web :
- `Cannot find module 'next/dist/compiled/jest-worker/processChild.js'`
- `Can't resolve 'next-flight-client-entry-loader'`
- `Can't resolve 'styled-jsx'`

**Correctif** : relancer un `pnpm install` **complet** (SANS `--filter`) pour re-linker tout le workspace :

```powershell
cd le-cercle
$env:PATH = "C:\Users\LM-1\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin;" + $env:PATH
$env:CI = "true"
node C:\Users\LM-1\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs install
```

## Étapes restantes (dans l'ordre)

1. Réparer le front : `pnpm install` complet (ci-dessus), puis relancer `pnpm --filter @lecercle/web dev` (hors bac à sable, cf. EPERM).
2. (PostgreSQL) vérifier qu'il tourne : `C:\pg\bin\pg_ctl.exe -D C:\pgdata status` — sinon `pg_ctl.exe -D C:\pgdata -l C:\pgdata\log.txt start`.
3. `prisma generate` puis `prisma migrate dev --name init` (crée la base `lecercle` + tables) puis `prisma db seed` (dans `packages/db`).
   - NB : les binaires `createdb.exe`/`psql.exe` ne sont PAS inclus (zonky minimal) → la création de la base passe par Prisma (migrate crée la DB) ou un script Node+pg.
4. Lancer l'API : `pnpm --filter @lecercle/api start:dev` (hors bac à sable).
5. Vérifier `http://localhost:3000/fr` (annonces/agents affichés) + `http://localhost:3001/api/v1` + Swagger `/docs`.

## Comptes / accès

- Base : user `lecercle`, auth `trust`, port `5432`.
- Démo (seed) : `admin@lecercle.test` / `demo1234`.
- Front : `http://localhost:3000/fr` ; API : `http://localhost:3001/api/v1`.
