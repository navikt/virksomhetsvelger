# Nav Virksomhetsvelger (tidligere Bedriftsmeny)

Virksomhetsvelger og -meny for innlogget arbeidsgiver.
Tidligere kalt [Bedriftsmeny](https://github.com/navikt/bedriftsmeny).

Koden er skrevet i TypeScript og React og bygget vitejs som et bibliotek.  
Komponenten har ingen side effekter og skal kunne brukes uavhengig av rammeverk. 
Rammeverk med SSR skal også fungere. Ta kontakt dersom det er problemer med oppsett.

## Bruk

### Innstaller komponenten

```sh
pnpm add @navikt/virksomhetsvelger
```

### Avhengigheter

Virksomhetsvelgeren forutsetter at appen din benytter [Nav Aksel](https://aksel.nav.no/grunnleggende/introduksjon/kom-i-gang-med-kodepakkene) og React.
se peer dependencies i package.json

### Importer komponenten og CSS

```js
import { Virksomhetsvelger } from '@navikt/virksomhetsvelger';
import '@navikt/virksomhetsvelger/dist/assets/style.css';

import '@navikt/ds-css';
```

### Hvordan bruke

Oppdaterte eksempler på bruk finner du i demo appen under [src/App.tsx](src/App.tsx).

Live demo: https://navikt.github.io/virksomhetsvelger/

## Lokal Utvikling

Denne appen er bygget med vite i library mode: https://vite.dev/guide/build.html#library-mode
Koden til komponenten ligger i `src/lib` og demo appen ligger i `src/`.
Når an utvikler lokalt kjører man mot produksjonskoden av komponenten.
Derfor er bygg av komponenten nødvendig for å se endringer i demo appen.

For å kjøre en terminal med vite i watch mode og bygge komponenten ved endringer i koden kjør:
```sh
pnpm run dev:watch
```

Koden er satt opp med ESLint, TSESLint og prettier. 
Anbefales at man skrur på dette i sin IDE.

Manuell linting og testing kjøres lokalt med:
```sh
pnpm run lint
pnpm run test
```

## CI/CD

Ved push på main bygges komponenten og deployes til npm hvis versjon i package.json er endret.

```
pnpm run build:cicd
```

## Publisering av ny versjon


Oppgrader versjonsnummer i package.json enten manuelt eller ved å kjøre `pnpm version patch/minor/major` (F.eks
"pnpm version major" hvis det er breaking changes). Hvis du er i tvil om du skal oppgradere med patch, minor eller
major, kan lese om sematic versioning på https://semver.org/. Ved å kjøre en av de tre kommandoene opprettes det en ny
commit med det nye versjonsnummeret som commit message.
Det opprettes samtidig en ny tag med det nye versjonsnummeret.

Commits til main med ny versjon i `package.json` vil publiseres til github.

Det er foreløpig ikke satt opp publisering til npmjs, dersom det er ønskelig ta kontakt med teamet.

## Kontakt oss

Opprett issue i repository hvis du lurer på noe.

De med tilgang til NAVs interne slack anbefales å bruker `#bedriftsmeny` eller `#team-fager`.
