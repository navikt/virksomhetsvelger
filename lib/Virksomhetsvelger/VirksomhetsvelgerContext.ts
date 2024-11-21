import { createContext } from "react";

export interface Organisasjon {
  orgNr: string;
  navn: string;
  underenheter: Organisasjon[];
}

export const VirksomhetsvelgerContext = createContext<{
  aktivtOrganisasjonstre: Organisasjon[];
  velgUnderenhet: (org: Organisasjon) => void;
  valgtOrganisasjon: Organisasjon;
  setSøketekst: (søketekst: string) => void;
  søketekst: string;
}>({
  aktivtOrganisasjonstre: [],
  valgtOrganisasjon: {} as Organisasjon,
  velgUnderenhet: () => {},
  setSøketekst: () => {},
  søketekst: "",
});
