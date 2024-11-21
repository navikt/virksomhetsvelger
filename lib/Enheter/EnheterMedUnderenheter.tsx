import { OrganisasjonMedState } from "../Virksomhetsvelger/useTastaturNavigasjon.ts";
import { ForwardedRef } from "react";
import styles from "../Virksomhetsvelger/Virksomhetsvelger.module.css";
import { Accordion } from "@navikt/ds-react";
import { Hovedenhet } from "./Hovedenhet.tsx";
import { Underenhet } from "./Underenhet.tsx";

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
      <div className={styles.virksomhetsvelgerJuridiskEnhet} role="group">
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
            aria-owns={`underenheter-${organisasjon.orgNr}`}
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
              className={styles.virksomhetsvelgerUnderenheter}
              id={`underenheter-${organisasjon.orgNr}`}
            >
              {organisasjon.underenheter.map((underenhet) => (
                <Underenhet
                  key={underenhet.orgNr}
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
