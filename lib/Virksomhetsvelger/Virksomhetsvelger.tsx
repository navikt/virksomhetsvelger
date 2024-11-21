import { useContext, useEffect, useRef, useState } from "react";
import { Accordion, BodyShort, Button, Detail, Search } from "@navikt/ds-react";
import { CaretDownIcon, CaretUpIcon, XMarkIcon } from "@navikt/aksel-icons";
import FocusTrap from "focus-trap-react";
import Dropdown from "../DropDown/Dropdown";
import { useTastaturNavigasjon } from "./useTastaturNavigasjon";
import { formatOrgNr } from "./util.ts";

import styles from "./Virksomhetsvelger.module.css";
import { EnhetMedUnderenheter } from "../Enheter/EnheterMedUnderenheter.tsx";
import {
  Organisasjon,
  VirksomhetsvelgerContext,
} from "./VirksomhetsvelgerContext.ts";
import { VirksomhetsvelgerProvider } from "./VirksomhetsvelgerProvider.tsx";

const Velger = ({ friKomponent }: { friKomponent?: boolean }) => {
  const dropdownId = "VirksomhetsvelgerPopup";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const valgtEnhetRef = useRef<HTMLButtonElement>(null);
  const [åpen, setÅpen] = useState<boolean>(false);

  const { søketekst, setSøketekst, valgtOrganisasjon, velgUnderenhet } =
    useContext(VirksomhetsvelgerContext);

  const {
    fokusertEnhet,
    fokuserEnhet,
    organisasjonerMedState,
    handleKeyDown,
    toggleEkspander,
    resetState,
  } = useTastaturNavigasjon();

  const antallTreff = organisasjonerMedState.reduce(
    (acc, org) => acc + org.underenheter.length,
    0,
  );
  const OpenCloseIcon = åpen ? CaretUpIcon : CaretDownIcon;

  useEffect(() => {
    if (åpen) {
      if (document.activeElement !== searchRef.current) {
        /**
         * prevents focus jumps from search to list when clearing search
         * perhaps better to clear 'fokusert' in state when searching
         */
        valgtEnhetRef.current?.focus();
      }
    } else {
      setSøketekst("");
      resetState();
    }
  }, [åpen, fokusertEnhet?.orgNr, resetState, setSøketekst]);

  return (
    valgtOrganisasjon && (
      <div
        className={`${friKomponent ? styles.virksomhetsvelgerFriKomponent : ""}`}
      >
        <Button
          className={styles.virksomhetsvelger}
          onClick={() => setÅpen((prev) => !prev)}
          type="button"
          variant="secondary"
          ref={buttonRef}
          aria-label={`Virksomhetsmeny. Valgt virksomhet er ${valgtOrganisasjon.navn} med virksomhetsnummer ${valgtOrganisasjon.orgNr}`}
          aria-controls={dropdownId}
          aria-haspopup={true}
          aria-expanded={åpen}
        >
          <div className={styles.virksomhetsvelgerInnhold}>
            <div className={styles.virksomhetsvelgerTekst}>
              <BodyShort className={styles.virksomhetsvelgerVirksomhetsnavn}>
                {valgtOrganisasjon.navn}
              </BodyShort>
              <BodyShort>
                Org.nr. {formatOrgNr(valgtOrganisasjon.orgNr)}
              </BodyShort>
            </div>
            <OpenCloseIcon
              style={{ pointerEvents: "none" }}
              aria-hidden={true}
            />
          </div>
        </Button>
        <Dropdown
          id={dropdownId}
          ariaLabel="Virksomhetsvelger"
          friKomponent={true}
          erApen={åpen}
        >
          <FocusTrap
            focusTrapOptions={{
              clickOutsideDeactivates: (e) => {
                if (
                  buttonRef.current &&
                  e.target instanceof Node &&
                  buttonRef.current.contains(e.target)
                ) {
                  /**
                   * Knappen flipper også `åpen`. Om vi også flipper, så flippes `åpen` fram og tilbake.
                   **/
                } else {
                  setÅpen(false);
                }
                return true;
              },
              escapeDeactivates: () => {
                setÅpen(false);
                return true;
              },
            }}
          >
            <div className={styles.virksomhetsvelgerPopup}>
              <div className={styles.virksomhetsvelgerPopupHeader}>
                <Search
                  ref={searchRef}
                  variant="simple"
                  value={søketekst}
                  onChange={setSøketekst}
                  clearButtonLabel="Tøm søkefelt"
                  placeholder="Søk på virksomhet ..."
                  label="Søk på virksomhet"
                  autoComplete="organization"
                />
                <Button
                  variant="tertiary"
                  aria-label="lukk virksomhetsvelger"
                  className={styles.virksomhetsvelgerPopupHeaderXbtn}
                  onClick={() => setÅpen(false)}
                >
                  <XMarkIcon aria-hidden={true} />
                </Button>
              </div>
              <Detail role="status">
                {søketekst.length > 0 && (
                  <>
                    {antallTreff === 0
                      ? `Ingen treff på "${søketekst}"`
                      : `${antallTreff} treff på "${søketekst}".`}
                  </>
                )}
              </Detail>
              <Accordion style={{ display: "flex", overflow: "auto" }}>
                <div
                  className={styles.virksomhetsvelgerEnheter}
                  onKeyDown={handleKeyDown}
                >
                  {organisasjonerMedState.map((org) => (
                    <EnhetMedUnderenheter
                      valgtEnhetErIListe={organisasjonerMedState.some(
                        (o) =>
                          o.orgNr === valgtOrganisasjon.orgNr ||
                          o.underenheter.some(
                            (u) => u.orgNr === valgtOrganisasjon.orgNr,
                          ),
                      )}
                      key={org.orgNr}
                      enhetRef={valgtEnhetRef}
                      organisasjon={org}
                      onUnderenhetValgt={(org) => {
                        setÅpen(false);
                        velgUnderenhet(org);
                      }}
                      onHovedenhetClick={toggleEkspander}
                      onFocus={(org) => {
                        fokuserEnhet(org);
                      }}
                    />
                  ))}
                </div>
              </Accordion>
            </div>
          </FocusTrap>
        </Dropdown>
      </div>
    )
  );
};

export interface ValgtVirksomhet {
  orgNr: string;
  navn: string;
}

export const Virksomhetsvelger = ({
  organisasjoner,
  onChange,
  friKomponent,
}: {
  organisasjoner: Organisasjon[];
  onChange: (organisasjon: ValgtVirksomhet) => void;
  friKomponent?: boolean;
}) => {
  return (
    <VirksomhetsvelgerProvider
      organisasjonstre={organisasjoner}
      onOrganisasjonChange={onChange}
    >
      <Velger friKomponent={friKomponent} />
    </VirksomhetsvelgerProvider>
  );
};
