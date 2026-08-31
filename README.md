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

| Fil                                       | Vad den testar                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `src/tests/default-auth.metadata.test.ts` | Källkodsnivå: varje route har antingen `@UseBefore(authMiddleware)` eller `@Public()` |
| `src/tests/default-auth.runtime.test.ts`  | Runtime: varje oskyddad route svarar 401 utan session                                 |
| `src/tests/default-auth.swagger.test.ts`  | Swagger UI är nåbar utan session                                                      |

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

## Multi-tenant - flera organisationer i samma installation

En deployment kan betjäna flera organisationer. Vilken organisation en request tillhör avgörs av **värdnamnet**, som slås upp i backendens databas. Där hämtas vilken **IDP** som ska användas vid inloggning, vilket **municipalityId** som skickas till APIerna, och vilken **logotyp** som visas. Allt administreras via `admin`-appen — ingen deploy krävs för att lägga till en organisation.

Funktionen styrs av `ADMIN_CMS_ENABLED`. Är den inte `true` körs applikationen single-tenant på värdena i env.

Två tabeller styr detta (`backend/prisma/schema.prisma`):

| Modell | Fält             | Betydelse                                                                                                  |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `Host` | `name`           | Hela värdnamnet användarna surfar till                                                                     |
|        | `municipalityId` | Kommunkod                                                                                                  |
|        | `domain`         | Namespace i employee-APIet (`portalpersondata/{domain}/{username}`), inte en DNS-domän. Default `PERSONAL` |
|        | `idpId`          | Vilken IDP som används vid inloggning                                                                      |
| `IDP`  | `entryPoint`     | IDPens SSO-URL                                                                                             |
|        | `idpCert`        | IDPens signeringscertifikat                                                                                |

Logotyper ligger **inte** i den här databasen utan i APIet MessagingSettings, med `host`, `display_name`, `logotype_lightmode` och `logotype_darkmode` som nycklar.

### Namnkonvention

Ge varje organisation ett eget värdnamn enligt `<organisation>.<bas-domän>`, och ge **alla** organisationer ett prefix - även den som räknas som standard. Bas-domänen utan prefix får ingen `Host`-rad, och den som surfar dit hamnar därför på fallback-IDPen från env och får ingen logotyp. Vill man att bas-domänen ska vara användbar behöver den antingen en egen `Host`-rad eller en redirect.

Flera värdar kan peka på samma IDP. Organisationer som delar inloggningslösning — till exempel bolag inom samma kommun — läggs upp som egna värdar med samma kommunkod och samma IDP. Skapa inte en IDP per värd.

### Lägga till en organisation

1. **Beställ en SP-registrering** hos organisationens IDP-ägare och bifoga länk till applikationens metadata: `{API_BASE}{BASE_URL_PREFIX}/saml/metadata`. Endpointen kräver ingen inloggning. Du får tillbaka deras metadata, där ingångs-URL och certifikat finns.
2. **Lägg upp IDPen** i `/admin` → IDP, med namn, ingångsurl och certifikat. Certifikatet kan klistras in med eller utan `BEGIN`/`END`-rader — backend normaliserar formatet.
3. **Lägg upp värden** i `/admin` → Värdar, med hela värdnamnet, kommunkod, domän och IDPen från steg 2.
4. **Lägg upp logotypen** i `/admin` → Logotyper: välj värd, sätt visningsnamn och ladda upp logotyp för light och dark mode.
5. **Peka DNS** för värdnamnet mot samma server som miljön redan använder.

Ingen omstart behövs — uppslagen sker per request, och listan över tillåtna origins läses från databasen.

### Certifikat och SP-identitet

Det finns två certifikat i flödet och de förväxlas lätt:

| Certifikat                                                      | Var det bor                     | Vem äger det                  |
| --------------------------------------------------------------- | ------------------------------- | ----------------------------- |
| IDPens signeringscert (`IDP.idpCert`)                           | Databasen, redigeras i `/admin` | Organisationens IDP-ägare     |
| Applikationens SP-cert (`SAML_PUBLIC_KEY` / `SAML_PRIVATE_KEY`) | Env-variabler, per miljö        | Den som driftar applikationen |

**IDP-certet beställs inte och är inte miljöspecifikt.** Det är IDPens publika nyckel och läses ur deras metadata. Pekar två miljöer på samma IDP-instans är certifikatet per definition detsamma.

**SP-identiteten är däremot per miljö.** Metadatan byggs av `SAML_ISSUER` (entityID), `SAML_CALLBACK_URL` (ACS), `SAML_LOGOUT_CALLBACK_URL` (SLO) och `SAML_PUBLIC_KEY`. Varje miljö behöver en egen registrering hos IDPen eftersom ACS-URLen skiljer sig, och `SAML_ISSUER` måste vara unik per miljö — annars ser IDPen två tjänster med samma entityID. Vissa IDP-produkter kodar dessutom in SP-registreringen i själva SSO-URLen, vilket innebär att `entryPoint` skiljer sig mellan miljöer även när certifikatet är detsamma.

Att en miljö fungerar med en annan miljös ingångs-URL bevisar inte att den är korrekt registrerad. Det enda som i praktiken binder ett SAML-svar till applikationen är signaturen mot `idpCert`: `audience` är avstängt, `Destination` kontrolleras inte, `validateInResponseTo` är `never` och `acceptedClockSkewMs: -1` stänger av tidskontrollen. Ett svar utfärdat för en annan registrering accepteras därför. Miljön ärver då den andra registreringens attribut-release och användarpopulation, och slutar fungera om den registreringen ändras.

Certifikat roteras. Eftersom certet ligger per IDP-rad räcker det att uppdatera IDPen i `/admin` — ingen deploy. Delar två miljöer samma IDP slutar båda fungera samtidigt vid en rotation.

### Konfiguration

| Variabel                                                                                              | Betydelse                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ADMIN_CMS_ENABLED`                                                                                   | `true` slår på det databasdrivna flödet. `false` ger single-tenant på env-värden                                                                                             |
| `ADMIN_URL`                                                                                           | Admin-appens URL. Styr att admin använder env-IDPen i stället för en IDP ur databasen. Krävs av `validateEnv` men saknas i `.env.example.local` — måste läggas till manuellt |
| `ADMIN_GROUP`                                                                                         | Kommaseparerade AD-grupper som ger admin-rollen                                                                                                                              |
| `SAML_ENTRY_SSO`, `SAML_IDP_PUBLIC_CERT`                                                              | Fallback-IDP, och den IDP admin-appen använder                                                                                                                               |
| `SAML_ISSUER`, `SAML_CALLBACK_URL`, `SAML_LOGOUT_CALLBACK_URL`, `SAML_PRIVATE_KEY`, `SAML_PUBLIC_KEY` | SP-identiteten, gemensam för alla organisationer inom en miljö                                                                                                               |
| `ORIGIN`                                                                                              | Bas-lista av tillåtna origins, utökas automatiskt med värdarna i databasen                                                                                                   |
| `MUNICIPALITY_ID`                                                                                     | Default-kommunkod när ingen värd är resolvad                                                                                                                                 |

### Att känna till

- **Logotyper hämtas alltid från kommunen i `MUNICIPALITY_ID`**, inte från värdens kommunkod. Logotyperna är alltså en central katalog under en kommunkod, oavsett hur många organisationer som är upplagda.
- **Logotypens `host`-värde är värdens första etikett**, inte hela värdnamnet — `GET /logotypes` filtrerar på `host.split('.')[0]`. Admin skriver ned rätt värde via `hostLabel`, men logotyper som skapats med ett annat verktyg behöver följa samma konvention för att hittas.
- **Sessionen är bunden till värden.** En autentiserad request vars värdnamn inte matchar `session.host` får `401 SESSION_HOST_MISMATCH` och sessionen rivs, så en inloggning kan inte återanvändas mot en annan organisations värd.
- **För lokal utveckling behövs en `Host` med namnet `localhost`**, annars används fallback-IDPen. Seedens värd matchar inget riktigt värdnamn.
