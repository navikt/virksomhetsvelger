import { ReactNode, useEffect, useMemo, useState } from "react";
import { filterRecursive, flatUtHierarki } from "./util";
import { VirksomhetsvelgerContext } from "./VirksomhetsvelgerContext";
import { Organisasjon } from "./Virksomhetsvelger";

export const VirksomhetsvelgerProvider = ({
  children,
  organisasjonstre: orgtre,
  onOrganisasjonChange,
}: {
  organisasjonstre: Organisasjon[];
  onOrganisasjonChange: (
    organisasjon: Pick<Organisasjon, "orgnr" | "navn">,
  ) => void;
  children: ReactNode;
}) => {
  /**
   * orgtre er recursivt dypt tre, flates ut her til en liste av løvnoder med første parent
   **/
  const organisasjonstre = useMemo(() => flatUtHierarki(orgtre), [orgtre]);

  const [søketekst, setSøketekst] = useState("");
  const [aktivtOrganisasjonstre, setAktivtOrganisasjonstre] =
    useState(organisasjonstre);
  const [valgtOrganisasjon, setValgtOrganisasjon] = useState<Organisasjon>(
    () => aktivtOrganisasjonstre[0].underenheter[0],
  );

  useEffect(() => {
    if (søketekst === "") {
      setAktivtOrganisasjonstre(organisasjonstre);
      return;
    }
    const matches = filterRecursive(
      organisasjonstre,
      (o) =>
        o.orgnr.includes(søketekst) ||
        o.navn.toLowerCase().includes(søketekst.toLowerCase()),
    );
    setAktivtOrganisasjonstre(matches);
  }, [organisasjonstre, søketekst, setAktivtOrganisasjonstre]);

  useEffect(() => {
    if (valgtOrganisasjon?.orgnr) {
      const { orgnr, navn } = valgtOrganisasjon;
      onOrganisasjonChange({
        orgnr,
        navn,
      });
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
