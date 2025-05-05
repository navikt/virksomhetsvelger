import {useContext, useEffect, useRef, useState} from "react";
import {Accordion, BodyShort, Button, Detail, Search} from "@navikt/ds-react";
import {ChevronDownIcon, ChevronUpIcon, XMarkIcon} from "@navikt/aksel-icons";
import {FocusTrap} from "focus-trap-react";
import Dropdown from "../DropDown/Dropdown";
import {useTastaturNavigasjon} from "./useTastaturNavigasjon";
import {formatOrgNr} from "./util";

import styles from "./Virksomhetsvelger.module.css";
import {EnhetMedUnderenheter} from "../Enheter/EnheterMedUnderenheter";
import {VirksomhetsvelgerContext} from "./VirksomhetsvelgerContext";
import {VirksomhetsvelgerProvider} from "./VirksomhetsvelgerProvider";

const Velger = ({friKomponent}: { friKomponent?: boolean }) => {
    const dropdownId = "VirksomhetsvelgerPopup";
    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const valgtEnhetRef = useRef<HTMLButtonElement>(null);
    const [åpen, setÅpen] = useState<boolean>(false);

    const {søketekst, setSøketekst, valgtOrganisasjon, velgUnderenhet} =
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
    const valgtEnhetErIListe = organisasjonerMedState.some(
        (o) =>
            o.orgnr === valgtOrganisasjon.orgnr ||
            o.underenheter.some((u) => u.orgnr === valgtOrganisasjon.orgnr),
    );
    const OpenCloseIcon = åpen ? ChevronUpIcon : ChevronDownIcon;

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
    }, [åpen, fokusertEnhet?.orgnr, resetState, setSøketekst]);

    return (
        valgtOrganisasjon && (
            <div className={`${friKomponent ? styles.friKomponent : ""}`}>
                <Button
                    className={styles.virksomhetsvelger}
                    onClick={() => setÅpen((prev) => !prev)}
                    type="button"
                    variant="secondary"
                    ref={buttonRef}
                    aria-label={`Virksomhetsmeny. Valgt virksomhet er ${valgtOrganisasjon.navn} med virksomhetsnummer ${valgtOrganisasjon.orgnr}`}
                    aria-haspopup={true}
                    aria-expanded={åpen}
                >
                    <div className={styles.innhold}>
                        <div className={styles.tekst}>
                            <BodyShort className={styles.virksomhetsnavn}>
                                {valgtOrganisasjon.navn}
                            </BodyShort>
                            <BodyShort>
                                Org.nr. {formatOrgNr(valgtOrganisasjon.orgnr)}
                            </BodyShort>
                        </div>
                        <OpenCloseIcon
                            style={{pointerEvents: "none"}}
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
                        <div className={styles.popup}>
                            <div className={styles.popupHeader}>
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
                                    className={styles.popupHeaderXbtn}
                                    onClick={() => setÅpen(false)}
                                >
                                    <XMarkIcon aria-hidden={true}/>
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
                            <Accordion style={{display: "flex", overflow: "auto"}}>
                                <div className={styles.enheter} onKeyDown={handleKeyDown}>
                                    {organisasjonerMedState.map((org, i) => {
                                        return (
                                            <EnhetMedUnderenheter
                                                tvingTabbable={!valgtEnhetErIListe && i === 0}
                                                key={org.orgnr}
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
                                        );
                                    })}
                                </div>
                            </Accordion>
                        </div>
                    </FocusTrap>
                </Dropdown>
            </div>
        )
    );
};

export interface Organisasjon {
    orgnr: string;
    navn: string;
    underenheter: Organisasjon[];
}

export const Virksomhetsvelger = ({
                                      organisasjoner,
                                      onChange,
                                      initValgtOrgnr,
                                      friKomponent,
                                  }: {
    organisasjoner: Organisasjon[];
    onChange: (organisasjon: Organisasjon) => void;
    initValgtOrgnr?: string;
    friKomponent?: boolean;
}) => {
    return (
        <VirksomhetsvelgerProvider
            organisasjonstre={organisasjoner}
            onOrganisasjonChange={onChange}
            initValgtOrgnr={initValgtOrgnr}
        >
            <Velger friKomponent={friKomponent}/>
        </VirksomhetsvelgerProvider>
    );
};
