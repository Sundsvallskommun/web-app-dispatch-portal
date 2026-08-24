# Postportal / Dispatch portal

## APIer som används

Dessa APIer används i projektet, applikationsanvändaren i WSO2 måste prenumerera på dessa.

| API               | Version |
| ----------------- |--------:|
| SimulatorServer   |     2.0 |
| Company           |     1.0 |
| Employee          |     2.0 |
| Citizen           |     3.0 |
| PostPortalService |     1.8 |
| MessagingSettings |     3.0 |
| LegalEntity       |     2.0 |

## Utveckling

### Krav

- Node >= 20 LTS
- Yarn

### Steg för steg

1. Klona ner repot.

```
git clone https://github.com/Sundsvallskommun/web-app-dispatch-portal.git
```

2. Installera dependencies. Kör i roten (sätter upp git-hooks via husky) och i varje paket:

```
yarn install            # rot: husky (git-hooks)

cd frontend
yarn install

cd backend
yarn install
```

3. Skapa .env-fil för `frontend`

```
cd frontend
cp .env-example .env
```

Redigera `.env` för behov, för utveckling bör exempelvärdet fungera.

4. Skapa .env-fil för `backend`

```
cd backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

redigera `.env.development.local` för behov. URLer, nycklar och cert behöver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` måste fyllas i för att APIerna ska fungera, du måste ha en applikation från WSO2-portalen
- `SAML_ENTRY_SSO` behöver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska stämma överens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` behöver bara fyllas i korrekt om man kör mot en riktig IDP

5. Initiera databas för backend

```
cd backend
yarn prisma:generate
yarn prisma:migrate
```

Om du vill ha data att arbeta med direkt kan du seeda databasen:

```
yarn prisma:seed
```

### Backend-routes och autentisering

Alla routes i backenden kräver autentisering som standard — en inloggad session måste finnas, annars svarar servern 401. Det är inte möjligt att råka glömma bort skyddet på en ny endpoint.

**Lägga till en ny skyddad route** — dekorera handler med `@UseBefore(authMiddleware)`:

```ts
import authMiddleware from '@middlewares/auth.middleware';
import { UseBefore } from 'routing-controllers';

@Get('/me')
@UseBefore(authMiddleware)
getUser() { ... }
```

Själva 401-svaret kommer inte från dekoratorn. Det kommer från en middleware som mountas framför hela `BASE_URL_PREFIX` innan controllers registreras (`createDefaultAuthGuard` i `backend/src/middlewares/default-auth.middleware.ts`) — den nekar allt som inte är märkt `@Public()`, så en ny route är skyddad så fort den finns. Dekoratorn behövs ändå: den deklarerar avsikten i koden. En route utan vare sig `@UseBefore(authMiddleware)` eller `@Public()` failar `default-auth.metadata.test.ts`, så skyddet kan varken glömmas bort eller tas bort tyst.

**Lägga till en publik route** — dekorera handler med `@Public('motivering')`:

```ts
import { Public } from '@/middlewares/public.decorator';

@Get('/health/up')
@Public('Liveness probe - pollas av infrastrukturen utan session')
async up() { ... }
```

Motiveringstexten loggas vid uppstart och fångas i ett snapshot-test, så varje förändring framgår i kodgranskning.

**Lägga till en ny controller** — lägg till klassen i `src/controllers.ts`. Controllern täcks då automatiskt av autentiseringsskyddet och av auth-testerna.

**Tester** — tre testsviter bevakar skyddet (kör med `yarn test` i `backend/`):

| Fil | Vad den testar |
| --- | --- |
| `src/tests/default-auth.metadata.test.ts` | Källkodsnivå: varje route har antingen `@UseBefore(authMiddleware)` eller `@Public()` |
| `src/tests/default-auth.runtime.test.ts` | Runtime: varje oskyddad route svarar 401 utan session |
| `src/tests/default-auth.swagger.test.ts` | Swagger UI är nåbar utan session |

Observera att statiska filer under `${BASE_URL_PREFIX}/files` (uppladdade logotyper) mountas före skyddet och därför fortsatt är åtkomliga utan session — de behövs på inloggningssidan.

### Git-hooks (husky)

Git-hooks hanteras av [husky](https://typicode.github.io/husky/) och sätts upp av `yarn install` i roten (via `prepare`-scriptet). Rot-`package.json` är enbart orkestrering — `backend`, `frontend` och `admin` installeras och byggs fortfarande var för sig.

| Hook       | Vad den kör                                    |
| ---------- | ---------------------------------------------- |
| `pre-push` | `yarn --cwd backend test` (Vitest, unit tests) |

Samma grind kan köras manuellt från roten med `yarn verify`.

Frontend och admin har i dagsläget bara interaktiva Cypress-tester och ingår därför inte i hooken — de körs i CI (`.github/workflows/cypress.yml`, `.github/workflows/cypress-admin.yml`).

Använd inte `git push --no-verify` för att kringgå grinden — åtgärda grundorsaken.

### Språkstöd

För språkstöd används [next-i18next](https://github.com/i18next/next-i18next).

Placera dina språkfiler i `frontend/public/locales/<locale>/<namespace>.json`.

För ytterligare information om språkstöd i `admin` se [Dokumentation om Admin](./admin/README.md)

För att det ska fungera med **Next.js** och **SSR** måste du skicka med språkdatat till ServerSideProps.
Det gör du genom att lägga till följande till dina page-komponenter (behövs ej i subkomponenter).

```
export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, [<namespaces>])),
  },
});
```

För att lägga till ett ytterligare språk, skapa en mapp med språkets namn, och lägg sedan till språket i `next-i18next.config.js`.

**Exempel för tyska:**
Skapa `frontend/public/locales/de/common.json`.
Ändra next-i18next.config.js:

```
module.exports = {
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'de'],
  },
 ...
};
```

Som hjälp i VSCode rekommenderas [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally).

### Session-hantering (Memory / File / Redis)

Backend använder `express-session` för sessionshantering.
Session store väljs via miljövariabeln `SESSION_STORE`

#### Tillgängliga session stores

| Värde    | Beskrivning                          | Rekommenderad miljö |
| -------- | ------------------------------------ | ------------------- |
| `memory` | In-memory store (default)            | Lokal utveckling    |
| `file`   | Filbaserad store (`./data/sessions`) | Lokal test / legacy |
| `redis`  | Redis-baserad store                  | OpenShift / test    |

#### Lokal utveckling (rekommenderat)

Vid lokal utveckling används Memory Store som standard. Ingen Redis krävs.

`backend/.env.development.local`:

```
SESSION_STORE=memory
```

Alternativt kan File Store användas:

```
SESSION_STORE=file
```

File Store ska inte användas i OpenShift eftersom poddar är stateless.

#### Redis (för OpenShift / container-miljö)

När applikationen körs i OpenShift används Redis för sessions, vilket möjliggör:

- flera backend-poddar
- stabila inloggningar
- korrekt skalning

I detta läge ska följande miljövariabler sättas via Deployment / Helm / ArgoCD (inte i `.env.development.local`):

```
SESSION_STORE=redis
REDIS_HOST=<redis-hostname>
REDIS_PORT=6379
REDIS_PASSWORD=<secret>
```

##### Exempel - Kubernetes/OpenShift:

```
env:
  - name: SESSION_STORE
    value: redis
  - name: REDIS_HOST
    value: redis-master.redis.svc.cluster.local
  - name: REDIS_PORT
    value: "6379"
  - name: REDIS_PASSWORD
    valueFrom:
      secretKeyRef:
        name: redis-secret
        key: password
```

- Redis används endast när `SESSION_STORE=redis`
- Saknas Redis-konfiguration när Redis är vald kraschar applikationen med: `error: uncaughtException: SESSION_STORE=redis but REDIS_HOST is not set`
- Lokal utveckling kräver ingen Redis
- Samma kodbas används i alla miljöer
