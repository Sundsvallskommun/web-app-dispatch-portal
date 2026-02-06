# Postportal / Dispatch portal

## APIer som används

Dessa APIer används i projektet, applikationsanvändaren i WSO2 måste prenumerera på dessa.

| API               | Version |
| ----------------- | ------: |
| SimulatorServer   |     2.0 |
| Messaging         |    7.10 |
| Company           |     1.0 |
| Employee          |     2.0 |
| Citizen           |     3.0 |
| PostPortalService |     1.3 |
| MessagingSettings |     3.0 |

## Utveckling

### Krav

- Node >= 20 LTS
- Yarn

### Steg för steg

1. Klona ner repot.

```
git clone https://github.com/Sundsvallskommun/web-app-dispatch-portal.git
```

2. Installera dependencies för både `backend` och `frontend`

```
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
