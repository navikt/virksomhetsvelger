# Nav Virksomhetsvelger (tidligere Bedriftsmeny)

Virksomhetsvelger og -meny for innlogget arbeidsgiver.
Tidligere kalt [Bedriftsmeny](https://github.com/navikt/bedriftsmeny).

Koden er skrevet i TypeScript og React og bygget vitejs som et bibliotek.  
Komponenten har ingen side effekter og skal kunne brukes uavhengig av rammeverk. 
Rammeverk med SSR skal også fungere. Ta kontakt dersom det er problemer med oppsett.

## Bruk

### Installer komponenten

```sh
npm install @navikt/virksomhetsvelger
```

### Avhengigheter

Virksomhetsvelgeren forutsetter at appen din benytter [Nav Aksel](https://aksel.nav.no/grunnleggende/introduksjon/kom-i-gang-med-kodepakkene) og React.
se peer dependencies i package.json

### Importer komponenten og CSS

```js
import { Virksomhetsvelger } from '@navikt/virksomhetsvelger';
import '@navikt/virksomhetsvelger/lib/virksomhetsvelger.css';

import '@navikt/ds-css';
```

### Hvordan bruke

Flere oppdaterte eksempler på bruk finner du i demo appen under src/App.tsx

TODO: gi noen eksempler her i readme 

## Lokal Utvikling

Denne appen er bygget med vite i library mode: https://vite.dev/guide/build.html#library-mode
Koden til komponenten ligger i `src/lib` og demo appen ligger i `src/`.
Når an utvikler lokalt kjører man mot produksjonskoden av komponenten.
Derfor er bygg av komponenten nødvendig for å se endringer i demo appen.

For å kjøre en terminal med vite i watch mode og bygge komponenten ved endringer i koden kjør:
```sh
npm run dev:watch
```


## Publisering på NPM


Oppgrader versjonsnummer i package.json ved å kjøre `npm version patch/minor/major` (F.eks
"npm version major" hvis det er breaking changes). Hvis du er i tvil om du skal oppgradere med patch, minor eller
major, kan lese om sematic versioning på https://semver.org/. Ved å kjøre en av de tre kommandoene opprettes det en ny
commit med det nye versjonsnummeret som commit message.
Det opprettes samtidig en ny tag med det nye versjonsnummeret.

Commits til main med ny versjon i `package.json` vil publiseres til NPM.

## Kontakt oss

Opprett issue i repository hvis du lurer på noe.

De med tilgang til NAVs interne slack anbefales å bruker `#bedriftsmeny` eller `#team-fager`.

