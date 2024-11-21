import styles from "../Virksomhetsvelger/Virksomhetsvelger.module.css";
import { BodyShort } from "@navikt/ds-react";
import { formatOrgNr } from "../Virksomhetsvelger/util.ts";
import { OrganisasjonMedState } from "../Virksomhetsvelger/useTastaturNavigasjon.ts";

export const Hovedenhet = ({
  hovedenhet,
  antallUnderenheter,
}: {
  hovedenhet: OrganisasjonMedState;
  antallUnderenheter: number;
}) => (
  <div
    className={`${styles.virksomhetsvelgerEnhet} ${styles.virksomhetsvelgerEnhetJuridisk}`}
  >
    <div className={styles.virksomhetsvelgerEnhetTekst}>
      <BodyShort className={styles.virksomhetsvelgerEnhetTittel}>
        {hovedenhet.navn}
      </BodyShort>
      <BodyShort>
        <span>Org.nr. </span>
        <span>{formatOrgNr(hovedenhet.orgNr)}</span>
      </BodyShort>
      <BodyShort
        className={styles.virksomhetsvelgerEnhetBeskrivelse}
        aria-label={`Hovedenheten har ${antallUnderenheter} ${antallUnderenheter === 1 ? "underenhet" : "underenheter"}`}
      >
        {antallUnderenheter}{" "}
        {antallUnderenheter === 1 ? "underenhet" : "underenheter"}
        {hovedenhet.valgt ? " - 1 valgt" : ""}
      </BodyShort>
    </div>
  </div>
);
