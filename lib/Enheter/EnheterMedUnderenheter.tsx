import { OrganisasjonMedState } from "../Virksomhetsvelger/useTastaturNavigasjon";
import { ForwardedRef } from "react";
import styles from "./EnheterMedUnderenheter.module.css";
import { Accordion } from "@navikt/ds-react";
import { Hovedenhet } from "./Hovedenhet";
import { Underenhet } from "./Underenhet";

export const EnhetMedUnderenheter = ({
  organisasjon,
  onUnderenhetValgt,
  onHovedenhetClick,
  onFocus,
  enhetRef,
  valgtEnhetErIListe,
}: {
  organisasjon: OrganisasjonMedState;
  onUnderenhetValgt: (organisasjon: OrganisasjonMedState) => void;
  onHovedenhetClick: (organisasjon: OrganisasjonMedState) => void;
  onFocus: (enhet: OrganisasjonMedState) => void;
  enhetRef: ForwardedRef<HTMLButtonElement>;
  valgtEnhetErIListe: boolean;
}) => {
  return (
    <>
      <div className={styles.enhet} role="group">
        <Accordion.Item open={organisasjon.ekspandert}>
          <Accordion.Header
            tabIndex={!valgtEnhetErIListe ? 0 : -1}
            ref={organisasjon.fokusert ? enhetRef : null}
            onClick={() => {
              onHovedenhetClick(organisasjon);
            }}
            onFocus={() => {
              if (!organisasjon.fokusert) {
                onFocus(organisasjon);
              }
            }}
            aria-owns={`underenheter-${organisasjon.orgnr}`}
            style={{
              backgroundColor: organisasjon.ekspandert
                ? "var(--a-surface-action-subtle"
                : "transparent",
            }}
          >
            <Hovedenhet
              hovedenhet={organisasjon}
              antallUnderenheter={organisasjon.underenheter.length}
            />
          </Accordion.Header>
          <Accordion.Content>
            <div
              className={styles.underenheter}
              id={`underenheter-${organisasjon.orgnr}`}
            >
              {organisasjon.underenheter.map((underenhet) => (
                <Underenhet
                  key={underenhet.orgnr}
                  underenhet={underenhet}
                  ref={underenhet.fokusert ? enhetRef : null}
                  onClick={() => onUnderenhetValgt(underenhet)}
                  onFocus={() => {
                    if (!underenhet.fokusert) {
                      onFocus(underenhet);
                    }
                  }}
                />
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </div>
    </>
  );
};
