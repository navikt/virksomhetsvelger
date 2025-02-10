import { OrganisasjonMedState } from "./useTastaturNavigasjon";
import { Organisasjon } from "./Virksomhetsvelger";

export const formatOrgNr = (orgNr: string) => orgNr.match(/.{1,3}/g)?.join(" ");

export const findRecursive = <T extends Organisasjon>(
  organisasjoner: T[],
  predicate: (org: T) => boolean,
): T | undefined => {
  for (const org of organisasjoner) {
    if (predicate(org)) {
      return org;
    }

    const found = findRecursive(org.underenheter as T[], predicate);
    if (found) {
      return found;
    }
  }

  return undefined;
};

export const findLastRecursive = <T extends Organisasjon>(
  organisasjoner: T[],
  predicate: (org: T) => boolean,
): T | undefined => {
  const result = filterRecursive(organisasjoner, predicate, false).pop();
  return (result?.underenheter.pop() as T) ?? result;
};

export const filterRecursive = <T extends Organisasjon>(
  organisasjoner: T[],
  predicate: (org: T) => boolean,
  includeChildren = true,
): T[] => {
  const result: T[] = [];

  for (const org of organisasjoner) {
    const enhetMatch = predicate(org);
    const underenheterFiltered = filterRecursive(
      org.underenheter as T[],
      predicate,
      includeChildren,
    );
    const underenhetMatch = underenheterFiltered.length > 0;

    if (enhetMatch) {
      result.push({
        ...org,
        underenheter: includeChildren ? org.underenheter : underenheterFiltered,
      });
    } else if (underenhetMatch) {
      result.push({
        ...org,
        underenheter: underenheterFiltered,
      });
    }
  }
  return result;
};

class Indexer {
  private index = -1;

  next() {
    return (this.index += 1);
  }
}

export const mapRecursive = <T extends Organisasjon>(
  current: T[],
  mapper: (
    o: T & { underenheter: OrganisasjonMedState[] },
  ) => OrganisasjonMedState,
  indexer = new Indexer(),
): OrganisasjonMedState[] => {
  return current.map((org) => {
    const currentIndex = indexer.next();
    return {
      ...mapper({
        ...org,
        underenheter:
          org.underenheter.length === 0
            ? []
            : mapRecursive(org.underenheter as T[], mapper, indexer),
      }),
      index: currentIndex,
    };
  });
};

const isLeaf = (organisasjon: Organisasjon) => {
  return organisasjon.underenheter.length === 0;
};

const split = <T extends Organisasjon>(
  predicate: (o: T) => boolean,
  liste: T[],
): T[][] => {
  const children = liste.filter(predicate);
  const otherParents = liste.filter((e) => !predicate(e));
  return [children, otherParents];
};

/**
 * Funksjon som returnerer løvnoder og første ledd parent som flat liste
 */
export const flatUtHierarki = (
  organisasjonstre: Organisasjon[],
): Organisasjon[] => {
  const mapR = (parent: Organisasjon): Organisasjon[] => {
    const [children, otherParents] = split(isLeaf, parent.underenheter);
    return [
      ...(children.length > 0
        ? [
            {
              ...parent,
              underenheter: children,
            },
          ]
        : []),
      ...otherParents.flatMap(mapR),
    ];
  };
  return organisasjonstre
    .flatMap((o) => mapR(o))
    .sort((a, b) => a.navn.localeCompare(b.navn));
};
