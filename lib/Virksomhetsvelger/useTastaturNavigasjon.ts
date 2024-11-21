import {
  useContext,
  useEffect,
  useReducer,
  KeyboardEvent,
  useCallback,
} from "react";
import { findLastRecursive, findRecursive, mapRecursive } from "./util.ts";
import {
  Organisasjon,
  VirksomhetsvelgerContext,
} from "./VirksomhetsvelgerContext.ts";

export interface OrganisasjonMedState extends Organisasjon {
  index: number;
  fokusert: boolean;
  valgt: boolean;
  ekspandert: boolean;
  underenheter: OrganisasjonMedState[];
}

type Action =
  | {
      type: "FOKUSER_ENHET";
      payload: Organisasjon;
    }
  | {
      type: "FOKUSER_FØRSTE_ENHET";
    }
  | {
      type: "FOKUSER_SISTE_ENHET";
    }
  | {
      type: "TOGGLE_EKSPANDER_ENHET";
      payload: Organisasjon;
    }
  | {
      type: "RESET_STATE";
      payload: {
        aktivtOrganisasjonstre: Organisasjon[];
        valgtOrgNr: string;
      };
    };

const reducer = (
  state: OrganisasjonMedState[],
  action: Action,
): OrganisasjonMedState[] => {
  let newState: OrganisasjonMedState[];

  switch (action.type) {
    case "FOKUSER_ENHET":
      newState = mapRecursive(state, (org) => ({
        ...org,
        fokusert: org.orgNr === action.payload.orgNr,
      }));
      break;

    case "FOKUSER_FØRSTE_ENHET":
      newState = mapRecursive(state, (org) => ({
        ...org,
        fokusert: org.orgNr === state[0].orgNr,
      }));
      break;

    case "FOKUSER_SISTE_ENHET":
      newState = mapRecursive(state, (org) => ({
        ...org,
        fokusert:
          org.orgNr ===
          (state[state.length - 1].ekspandert
            ? state[state.length - 1].underenheter[
                state[state.length - 1].underenheter.length - 1
              ].orgNr
            : state[state.length - 1].orgNr),
      }));
      break;

    case "TOGGLE_EKSPANDER_ENHET":
      newState = mapRecursive(state, (org) => ({
        ...org,
        ekspandert:
          org.orgNr === action.payload.orgNr ? !org.ekspandert : org.ekspandert,
        underenheter: org.underenheter.map((underenhet) => ({
          ...underenhet,
          ekspandert:
            org.orgNr === action.payload.orgNr
              ? !org.ekspandert
              : org.ekspandert,
        })),
      }));
      break;

    case "RESET_STATE":
      newState = initState(action.payload);
      break;
  }

  return newState;
};

const initState = ({
  aktivtOrganisasjonstre,
  valgtOrgNr,
}: {
  aktivtOrganisasjonstre: Organisasjon[];
  valgtOrgNr: string;
}): OrganisasjonMedState[] => {
  return mapRecursive(aktivtOrganisasjonstre, (org) => {
    const ekspandert = org.underenheter.some((o) => o.orgNr === valgtOrgNr);
    return {
      ...org,
      index: -1,
      fokusert: org.orgNr === valgtOrgNr,
      valgt: org.orgNr === valgtOrgNr,
      ekspandert: ekspandert,
      underenheter: org.underenheter.map((u) => ({
        ...u,
        ekspandert: ekspandert,
        fokusert: u.orgNr === valgtOrgNr,
        valgt: u.orgNr === valgtOrgNr,
      })) as OrganisasjonMedState[],
    };
  });
};

export type UseTastaturNavigasjon = {
  fokusertEnhet: OrganisasjonMedState;
  organisasjonerMedState: OrganisasjonMedState[];
  fokuserFørsteEnhet: () => void;
  fokuserSisteEnhet: () => void;
  pilOpp: () => void;
  pilNed: () => void;
  pilHøyre: () => void;
  pilVenstre: () => void;
  toggleEkspander: (enhet: Organisasjon) => void;
  fokuserEnhet: (enhet: Organisasjon) => void;
  resetState: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
};
export const useTastaturNavigasjon = (): UseTastaturNavigasjon => {
  const { aktivtOrganisasjonstre, valgtOrganisasjon } = useContext(
    VirksomhetsvelgerContext,
  );

  const [organisasjonerMedState, dispatch] = useReducer(
    reducer,
    {
      aktivtOrganisasjonstre,
      valgtOrgNr: valgtOrganisasjon.orgNr,
    },
    initState,
  );

  const resetState = useCallback(() => {
    dispatch({
      type: "RESET_STATE",
      payload: {
        aktivtOrganisasjonstre,
        valgtOrgNr: valgtOrganisasjon.orgNr,
      },
    });
  }, [aktivtOrganisasjonstre, valgtOrganisasjon.orgNr]);

  const aktivtOrganisasjonstreJson = JSON.stringify(aktivtOrganisasjonstre);
  useEffect(() => {
    // Reset state when the active tree changes
    resetState();
  }, [aktivtOrganisasjonstreJson, valgtOrganisasjon.orgNr, resetState]);

  const fokusertEnhet =
    findRecursive(organisasjonerMedState, ({ fokusert }) => fokusert) ??
    findRecursive(
      organisasjonerMedState,
      ({ orgNr }) => valgtOrganisasjon.orgNr === orgNr,
    )!;
  const fokuserFørsteEnhet = () => {
    dispatch({ type: "FOKUSER_FØRSTE_ENHET" });
  };

  const fokuserSisteEnhet = () => {
    dispatch({ type: "FOKUSER_SISTE_ENHET" });
  };

  const pilOpp = () => {
    const nextEnhet = findLastRecursive(
      organisasjonerMedState,
      ({ index, ekspandert, underenheter }) => {
        if (underenheter.length === 0) {
          // hvis det er en løvnode, så må den være ekspandert
          return index < fokusertEnhet.index && ekspandert;
        } else {
          return index < fokusertEnhet.index;
        }
      },
    );
    if (nextEnhet !== undefined) {
      dispatch({ type: "FOKUSER_ENHET", payload: nextEnhet });
    }
  };

  const pilNed = () => {
    const nextEnhet = findRecursive(
      organisasjonerMedState,
      ({ index, ekspandert, underenheter }) => {
        if (underenheter.length === 0) {
          // hvis det er en løvnode, så må den være ekspandert
          return index > fokusertEnhet.index && ekspandert;
        } else {
          return index > fokusertEnhet.index;
        }
      },
    );
    if (nextEnhet !== undefined) {
      dispatch({ type: "FOKUSER_ENHET", payload: nextEnhet });
    }
  };

  const pilHøyre = () => {
    if (fokusertEnhet.underenheter.length > 0) {
      if (fokusertEnhet.ekspandert) {
        pilNed();
      } else {
        dispatch({ type: "TOGGLE_EKSPANDER_ENHET", payload: fokusertEnhet });
      }
    }
  };

  const pilVenstre = () => {
    if (fokusertEnhet.underenheter.length > 0) {
      if (fokusertEnhet.ekspandert) {
        toggleEkspander(fokusertEnhet);
      }
    } else {
      const nextEnhet = findLastRecursive(
        organisasjonerMedState,
        ({ index, ekspandert, underenheter }) =>
          index < fokusertEnhet.index &&
          ekspandert &&
          underenheter.some((u) => u.orgNr === fokusertEnhet.orgNr),
      );
      if (nextEnhet !== undefined) {
        fokuserEnhet(nextEnhet);
      }
    }
  };

  const toggleEkspander = (enhet: Organisasjon) => {
    dispatch({ type: "TOGGLE_EKSPANDER_ENHET", payload: enhet });
  };

  const fokuserEnhet = (enhet: Organisasjon) => {
    dispatch({ type: "FOKUSER_ENHET", payload: enhet });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Home") {
      fokuserFørsteEnhet();
      e.preventDefault();
    }

    if (e.key === "End") {
      fokuserSisteEnhet();
      e.preventDefault();
    }

    if (e.key === "ArrowUp" || e.key === "Up") {
      pilOpp();
      e.preventDefault();
    }

    if (e.key === "ArrowDown" || e.key === "Down") {
      pilNed();
      e.preventDefault();
    }

    if (e.key === "ArrowRight" || e.key === "Right") {
      pilHøyre();
      e.preventDefault();
    }

    if (e.key === "ArrowLeft" || e.key === "Left") {
      pilVenstre();
      e.preventDefault();
    }
  };

  return {
    fokusertEnhet,
    organisasjonerMedState,
    fokuserFørsteEnhet,
    fokuserSisteEnhet,
    pilOpp,
    pilNed,
    pilHøyre,
    pilVenstre,
    toggleEkspander,
    fokuserEnhet,
    resetState,
    handleKeyDown,
  };
};
