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
  tvingTabbable,
}: {
  organisasjon: OrganisasjonMedState;
  onUnderenhetValgt: (organisasjon: OrganisasjonMedState) => void;
  onHovedenhetClick: (organisasjon: OrganisasjonMedState) => void;
  onFocus: (enhet: OrganisasjonMedState) => void;
  enhetRef: ForwardedRef<HTMLButtonElement>;
  tvingTabbable: boolean;
}) => {
  const underenhetErValgt = organisasjon.underenheter.some(
    ({ valgt }) => valgt,
  );
  return (
    <>
      <div className={styles.enhet} role="group">
        <Accordion.Item open={organisasjon.ekspandert}>
          <Accordion.Header
            tabIndex={tvingTabbable || underenhetErValgt ? 0 : -1}
            ref={organisasjon.fokusert ? enhetRef : null}
            onClick={() => {
              onHovedenhetClick(organisasjon);
            }}
            onFocus={() => {
              if (!organisasjon.fokusert) {
                onFocus(organisasjon);
              }
            }}
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
            <div className={styles.underenheter}>
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
