import { OrganisasjonMedState } from "../Virksomhetsvelger/useTastaturNavigasjon";
import { ForwardedRef, useEffect, useState } from "react";
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
  const headerId = `hovedenhet-${organisasjon.orgnr}`;
  const contentId = `underenheter-${organisasjon.orgnr}`;
  const [overflowVisible, setOverflowVisible] = useState(false);

  useEffect(() => {
    if (organisasjon.ekspandert) {
      setOverflowVisible(false);
      const timeoutId = window.setTimeout(() => {
        setOverflowVisible(true);
      }, 250);
      return () => window.clearTimeout(timeoutId);
    }
    setOverflowVisible(false);
    return undefined;
  }, [organisasjon.ekspandert]);
  return (
    <>
      <div className={styles.enhet} role="group">
        <Accordion.Item open={organisasjon.ekspandert}>
          <Accordion.Header
            tabIndex={tvingTabbable || underenhetErValgt ? 0 : -1}
            ref={organisasjon.fokusert ? enhetRef : null}
            id={headerId}
            aria-controls={contentId}
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
          <div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            aria-hidden={!organisasjon.ekspandert}
            data-expanded={organisasjon.ekspandert}
            data-overflow={overflowVisible ? "visible" : "hidden"}
            className={styles.underenheterWrapper}
          >
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
                  tabbable={organisasjon.ekspandert}
                />
              ))}
            </div>
          </div>
        </Accordion.Item>
      </div>
    </>
  );
};
