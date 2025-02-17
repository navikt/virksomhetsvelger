import React, { forwardRef } from "react";
import { BodyShort, Button } from "@navikt/ds-react";
import styles from "./Underenhet.module.css";
import { formatOrgNr } from "../Virksomhetsvelger/util";
import { CheckmarkCircleIcon } from "@navikt/aksel-icons";
import { OrganisasjonMedState } from "../Virksomhetsvelger/useTastaturNavigasjon";
import { Organisasjon } from "../Virksomhetsvelger/Virksomhetsvelger";

type UnderenhetProps = {
  onClick: (underenhet: Organisasjon) => void;
  onFocus: (e: React.FocusEvent<HTMLButtonElement>) => void;
  underenhet: OrganisasjonMedState;
};
export const Underenhet = forwardRef<HTMLButtonElement, UnderenhetProps>(
  ({ onClick, underenhet, onFocus }, ref) => (
    <Button
      type="button"
      ref={ref}
      tabIndex={underenhet.valgt ? 0 : -1}
      aria-pressed={underenhet.valgt}
      variant="tertiary"
      onClick={() => onClick(underenhet)}
      onFocus={onFocus}
      className={styles.underenhetInnhold}
    >
      <div className={styles.underenhet}>
        <div className={styles.underenhetTekst}>
          <BodyShort className={styles.underenhetTittel}>
            {underenhet.navn}
          </BodyShort>
          <BodyShort>
            <span>Org.nr. </span>
            <span>{formatOrgNr(underenhet.orgnr)}</span>
          </BodyShort>
        </div>
        {underenhet.valgt && (
          <CheckmarkCircleIcon
            aria-hidden={true}
            fontSize="1.5rem"
            className={styles.underenhetValgtIkon}
          />
        )}
      </div>
    </Button>
  ),
);
