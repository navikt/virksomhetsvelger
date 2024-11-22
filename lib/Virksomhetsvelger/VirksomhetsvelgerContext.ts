import { createContext } from "react";
import { Organisasjon } from "./Virksomhetsvelger";

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
