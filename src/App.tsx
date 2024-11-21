import "./App.css";

// https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name
import { Banner, Virksomhetsvelger } from "@navikt/virksomhetsvelger";

import "../dist/assets/style.css";
import "@navikt/ds-css";

import { BellIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import { Box, HStack, TextField } from "@navikt/ds-react";

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
    orgNr: string;
    navn: string;
  } | null>(null);

  const [valgtVirksomhetFri, setValgtVirksomhetFri] = useState<{
    orgNr: string;
    navn: string;
  } | null>(null);
  return (
    <div className="eksempelapp">
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
        <BellIcon title="a11y-title" fontSize="1.5rem" />
      </Banner>

      <Box background="bg-default">
        <HStack gap="4">
          <Box>
            <h2>Input organisasjoner</h2>

            <pre>{JSON.stringify(MOCK_ORGANISASJONER, null, 2)}</pre>
          </Box>
          <Box>
            <h2>Valgt virksomhet</h2>
            <pre>{JSON.stringify(valgtVirksomhet, null, 2)}</pre>
          </Box>
        </HStack>
      </Box>

      <Box background="bg-default" maxWidth="600px" padding="10">
        <h2>Velger som fri komponent, feks til bruk i skjema</h2>
        <Virksomhetsvelger
          organisasjoner={MOCK_ORGANISASJONER}
          onChange={setValgtVirksomhetFri}
          friKomponent={true}
        />
        {valgtVirksomhetFri && (
          <>
            <TextField
              label="Org. nr."
              value={valgtVirksomhetFri.orgNr}
              readOnly
            />
            <TextField label="Navn" value={valgtVirksomhetFri.navn} readOnly />
          </>
        )}
      </Box>

      <h2>Andre tilgjengelige komponenter</h2>
      <Banner tittel="Bare banner" />

      <Banner tittel="Banner med bjelle/widget">
        <BellIcon title="a11y-title" fontSize="1.5rem" />
      </Banner>
    </div>
  );
}

export default App;

const MOCK_ORGANISASJONER = [
  {
    orgNr: "1",
    navn: "grandparent (skip)",
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: [
      {
        orgNr: "1.1",
        navn: "parent",
        underenheter: [
          {
            orgNr: "1.1.1",
            navn: "child (skip)",
            underenheter: [
              {
                orgNr: "1.1.1.1",
                navn: "childs child",
                underenheter: [
                  {
                    orgNr: "1.1.1.1.1",
                    navn: "childs childs child",
                    underenheter: [],
                  },
                  {
                    orgNr: "1.1.1.1.2",
                    navn: "childs childs child",
                    underenheter: [],
                  },
                ],
              },
              {
                orgNr: "1.1.1.2",
                navn: "childs child 2",
                underenheter: [
                  {
                    orgNr: "1.1.1.2.1",
                    navn: "childs childs 2 child",
                    underenheter: [],
                  },
                ],
              },
            ],
          },
          {
            orgNr: "1.1.2",
            navn: "parents child",
            underenheter: [],
          },
        ],
      },
    ],
  },
  {
    orgNr: "2",
    underenheter: [],
    navn: "orphan",
  },
];
