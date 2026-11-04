import { fakerNB_NO as faker } from "@faker-js/faker";
import styles from "./App.module.css";

// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import {
  Banner,
  Virksomhetsvelger,
  type Organisasjon,
} from "@navikt/virksomhetsvelger";
import "@navikt/virksomhetsvelger/dist/assets/style.css";

import "@navikt/ds-css";

import { BellIcon } from "@navikt/aksel-icons";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BodyShort,
  Box,
  Button,
  ErrorMessage,
  ErrorSummary,
  HGrid,
  HStack,
  TextField,
  VStack,
} from "@navikt/ds-react";

const orgnr = () =>
  faker.number.int({ min: 100000000, max: 999999999 }).toString();

/*
TODO:
  - [x] banner uten velger
  - [x] banner uten velger med bjelle
  - [x] banner med velger
  -     [x] støtter keyboard navigasjon
  -     [x] callback for når organisasjon velges (påkrevd da velgeren ikke har side effects)
  - [x] banner med velger og bjelle
  - [x] velger som fri komponent, feks i en form
  -
  - nice to have:
  - [ ] skal man kunne manage valgt virksomhet selv?
  - [ ] skal man kunne sette initial virksomhet, uten å manage selv?
  - [ ] hjelpefunksjon for å gjøre om altinn 2 liste til hierarki
  - [ ] release note:
  -     "new name, same look same great taste"
  -     ny velger som støtter altinn 3 på en enklere måte
  -     ingen browser spesifik funksjonalitet, skal funke ut av boksen med ssr
 */

function App() {
  const [valgtVirksomhet, setValgtVirksomhet] = useState<{
    orgnr: string;
    navn: string;
  } | null>(null);

  const [valgtVirksomhetFri, setValgtVirksomhetFri] = useState<{
    orgnr: string;
    navn: string;
  } | null>(null);
  return (
    <div className={styles.eksempelapp}>
      <Box background="bg-default">
        <h1>Demo App: Eksempler på bruk av virksomhetsvelger</h1>
      </Box>

      <Banner tittel="Virksomhetsvelger">
        <Virksomhetsvelger
          organisasjoner={MOCK_ORGANISASJONER}
          onChange={setValgtVirksomhet}
        />
      </Banner>

      <Banner tittel="Velger & widget">
        <Virksomhetsvelger
          organisasjoner={MOCK_ORGANISASJONER}
          onChange={setValgtVirksomhet}
        />
        <BellIcon title="a11y-title" fontSize="2rem" />
      </Banner>

      <Box background="bg-default">
        <HGrid gap="6" columns={2} maxWidth="sm">
          <Box className={styles.json}>
            <h2>Valgt virksomhet</h2>
            <pre>{JSON.stringify(valgtVirksomhet, null, 2)}</pre>
          </Box>
          <Box className={styles.json}>
            <h2>Organisasjoner</h2>

            <pre>{JSON.stringify(MOCK_ORGANISASJONER, null, 2)}</pre>
          </Box>
        </HGrid>
      </Box>

      <Box background="bg-default" maxWidth="600px" padding="10">
        <VStack gap="4">
          <h2>Velger som fri komponent uten banner</h2>
          <Virksomhetsvelger
            organisasjoner={MOCK_ORGANISASJONER}
            onChange={setValgtVirksomhetFri}
            friKomponent={true}
          />
          {valgtVirksomhetFri !== null && (
            <>
              <TextField
                label="Org. nr."
                value={valgtVirksomhetFri.orgnr}
                readOnly
              />
              <TextField
                label="Navn"
                value={valgtVirksomhetFri.navn}
                readOnly
              />
            </>
          )}
        </VStack>
      </Box>

      <SkjemaMedFeiloppsummering />

      <Banner tittel="Mange underenheter (50 stk)">
        <Virksomhetsvelger
          organisasjoner={MOCK_MANGE_UNDERENHETER}
          onChange={setValgtVirksomhet}
        />
      </Banner>

      <h2>Andre tilgjengelige komponenter</h2>
      <Banner tittel="Bare banner" />

      <Banner tittel="Banner med bjelle/widget">
        <BellIcon title="a11y-title" fontSize="1.5rem" />
      </Banner>
    </div>
  );
}

const VELGER_ID = "skjema.virksomhetsnummer";
const VELGER_FEIL_ID = "skjema.virksomhetsnummer-feil";

function SkjemaMedFeiloppsummering() {
  const velgerRef = useRef<HTMLButtonElement>(null);
  const feiloppsummeringRef = useRef<HTMLDivElement>(null);
  const forhåndsvalgtOrgnr = useRef<string | null>(null);
  const [valgt, setValgt] = useState<Organisasjon | null>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const [innsendinger, setInnsendinger] = useState(0);

  useEffect(() => {
    if (innsendinger > 0) feiloppsummeringRef.current?.focus();
  }, [innsendinger]);

  // Må være stabil: velgeren kaller onChange på nytt når funksjonen endres.
  const velgVirksomhet = useCallback((org: Organisasjon) => {
    forhåndsvalgtOrgnr.current ??= org.orgnr;
    setValgt(org);
    setFeil(null);
  }, []);

  const sendInn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (valgt?.orgnr === forhåndsvalgtOrgnr.current) {
      setFeil("Deltaker er ikke ansatt i valgt virksomhet. Velg en annen.");
      setInnsendinger((n) => n + 1);
    } else {
      setFeil(null);
    }
  };

  return (
    <Box background="default" maxWidth="600px" padding="space-40">
      <form onSubmit={sendInn} noValidate>
        <VStack gap="space-16">
          <h2>Velger i skjema med feiloppsummering</h2>
          <BodyShort>
            Send inn med forhåndsvalgt virksomhet for å få en simulert feil.
            Lenken i feiloppsummeringen flytter fokus til velgeren via{" "}
            <code>id</code>. Knappen «Fokuser velgeren» gjør det samme via{" "}
            <code>ref</code>, slik <code>setFocus</code> i react-hook-form gjør.
          </BodyShort>
          <Virksomhetsvelger
            ref={velgerRef}
            id={VELGER_ID}
            aria-invalid={feil !== null}
            aria-describedby={feil !== null ? VELGER_FEIL_ID : undefined}
            organisasjoner={MOCK_ORGANISASJONER}
            onChange={velgVirksomhet}
            friKomponent
          />
          {feil !== null && (
            <>
              <ErrorMessage id={VELGER_FEIL_ID}>{feil}</ErrorMessage>
              <ErrorSummary
                ref={feiloppsummeringRef}
                heading="Du må rette disse feilene før du kan sende inn:"
              >
                <ErrorSummary.Item href={`#${VELGER_ID}`}>
                  {feil}
                </ErrorSummary.Item>
              </ErrorSummary>
            </>
          )}
          <HStack gap="space-16">
            <Button type="submit">Send inn</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => velgerRef.current?.focus()}
            >
              Fokuser velgeren
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}

export default App;

const MOCK_MANGE_UNDERENHETER = [
  {
    orgnr: orgnr(),
    navn: faker.company.name(),
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: Array.from({ length: 50 }, () => ({
      orgnr: orgnr(),
      navn: faker.company.name(),
      underenheter: [],
    })),
  },
  {
    orgnr: orgnr(),
    navn: faker.company.name(),
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: Array.from({ length: 50 }, () => ({
      orgnr: orgnr(),
      navn: faker.company.name(),
      underenheter: [],
    })),
  },
  {
    orgnr: orgnr(),
    navn: faker.company.name(),
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: Array.from({ length: 50 }, () => ({
      orgnr: orgnr(),
      navn: faker.company.name(),
      underenheter: [],
    })),
  },
];

const MOCK_ORGANISASJONER = [
  {
    orgnr: orgnr(),
    navn: faker.company.name(),
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: [
      {
        orgnr: orgnr(),
        navn: faker.company.name(),
        underenheter: [
          {
            orgnr: orgnr(),
            navn: faker.company.name(),
            underenheter: [
              {
                orgnr: orgnr(),
                navn: faker.company.name(),
                underenheter: [
                  {
                    orgnr: orgnr(),
                    navn: faker.company.name(),
                    underenheter: [],
                  },
                  {
                    orgnr: orgnr(),
                    navn: faker.company.name(),
                    underenheter: [],
                  },
                ],
              },
              {
                orgnr: orgnr(),
                navn: faker.company.name(),
                underenheter: [
                  {
                    orgnr: orgnr(),
                    navn: faker.company.name(),
                    underenheter: [],
                  },
                ],
              },
            ],
          },
          {
            orgnr: orgnr(),
            navn: faker.company.name(),
            underenheter: [],
          },
        ],
      },
    ],
  },
  {
    orgnr: orgnr(),
    underenheter: [],
    navn: faker.company.name(),
  },
];
