import { ReactNode, useEffect, useMemo, useState } from "react";
import { filterRecursive, findRecursive, flatUtHierarki } from "./util";
import { VirksomhetsvelgerContext } from "./VirksomhetsvelgerContext";
import { Organisasjon } from "./Virksomhetsvelger";

export const VirksomhetsvelgerProvider = ({
  children,
  organisasjonstre: orgtre,
  onOrganisasjonChange,
  initValgtOrgnr,
}: {
  organisasjonstre: Organisasjon[];
  initValgtOrgnr: string | undefined;
  onOrganisasjonChange: (organisasjon: Organisasjon) => void;
  children: ReactNode;
}) => {
  /**
   * orgtre er recursivt dypt tre, flates ut her til en liste av løvnoder med første parent
   **/
  const organisasjonstre = useMemo(() => flatUtHierarki(orgtre), [orgtre]);

  const [søketekst, setSøketekst] = useState("");
  const aktivtOrganisasjonstre = useMemo(() => {
    if (søketekst === "") {
      return organisasjonstre;
    }
    return filterRecursive(
      organisasjonstre,
      (o) =>
        o.orgnr.includes(søketekst) ||
        o.navn.toLowerCase().includes(søketekst.toLowerCase()),
    );
  }, [organisasjonstre, søketekst]);

  const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon>(
    () => {
      if (initValgtOrgnr !== undefined) {
        return (
          findRecursive(
            organisasjonstre,
            (org) => org.orgnr === initValgtOrgnr,
          ) ?? aktivtOrganisasjonstre[0].underenheter[0]
        );
      }

      return aktivtOrganisasjonstre[0].underenheter[0];
    },
  );

  useEffect(() => {
    if (valgtOrganisasjon?.orgnr) {
      onOrganisasjonChange(valgtOrganisasjon);
    }
  }, [onOrganisasjonChange, valgtOrganisasjon, valgtOrganisasjon?.orgnr]);

  if (valgtOrganisasjon === undefined) {
    return null;
  }

  const context: {
    aktivtOrganisasjonstre: Organisasjon[];
    velgUnderenhet: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    setSøketekst: (søketekst: string) => void;
    søketekst: string;
  } = {
    velgUnderenhet: setValgtOrganisasjon,
    aktivtOrganisasjonstre,
    valgtOrganisasjon,
    søketekst,
    setSøketekst,
  };

  return (
    <VirksomhetsvelgerContext.Provider value={context}>
      {children}
    </VirksomhetsvelgerContext.Provider>
  );
};
