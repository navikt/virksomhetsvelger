import styles from "./Hovedenhet.module.css";
import { BodyShort } from "@navikt/ds-react";
import { formatOrgNr } from "../Virksomhetsvelger/util";
import { OrganisasjonMedState } from "../Virksomhetsvelger/useTastaturNavigasjon";

export const Hovedenhet = ({
  hovedenhet,
  antallUnderenheter,
}: {
  hovedenhet: OrganisasjonMedState;
  antallUnderenheter: number;
}) => {
  const valgt = hovedenhet.underenheter.some((underenhet) => underenhet.valgt);
  return (
    <div className={`${styles.hovedenhet} ${styles.hovedenhetJuridisk}`}>
      <div className={styles.hovedenhetTekst}>
        <BodyShort className={styles.hovedenhetTittel}>
          {hovedenhet.navn}
        </BodyShort>
        <BodyShort>
          <span>Org.nr. </span>
          <span>{formatOrgNr(hovedenhet.orgnr)}</span>
        </BodyShort>
        <BodyShort className={styles.hovedenhetBeskrivelse}>
          {antallUnderenheter}{" "}
          {antallUnderenheter === 1 ? "underenhet" : "underenheter"}
          {valgt ? " - 1 valgt" : ""}
        </BodyShort>
      </div>
    </div>
  );
};
