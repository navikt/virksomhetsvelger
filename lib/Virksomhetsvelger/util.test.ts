import { expect, test } from "vitest";
import {
  filterRecursive,
  findLastRecursive,
  flatUtHierarki,
  mapRecursive,
} from "./util.ts";

test("henter løvnoder og parent som flat liste", () => {
  const enhets = flatUtHierarki(hierarki);
  expect(enhets).toEqual([
    {
      orgnr: "1",
      navn: "1",
      underenheter: [{ orgnr: "1.2", navn: "1.2", underenheter: [] }],
    },
    {
      orgnr: "1.1",
      navn: "1.1",
      underenheter: [{ orgnr: "1.1.1", navn: "1.1.1", underenheter: [] }],
    },
    {
      orgnr: "1.3.1",
      navn: "1.3.1",
      underenheter: [
        { orgnr: "1.3.1.1", navn: "1.3.1.1", underenheter: [] },
        { orgnr: "1.3.1.2", navn: "1.3.1.2", underenheter: [] },
      ],
    },
  ]);
});

test("filterRecursive filtrerer ut enheter som ikke matcher søketekst", () => {
  const orgs = flatUtHierarki(hierarki);
  const søkRec = (søketekst: string) =>
    filterRecursive(orgs, (e) =>
      e.navn.toLowerCase().includes(søketekst.toLowerCase()),
    );

  expect(søkRec("3.1.1")).toEqual([
    {
      orgnr: "1.3.1",
      navn: "1.3.1",
      underenheter: [{ orgnr: "1.3.1.1", navn: "1.3.1.1", underenheter: [] }],
    },
  ]);

  expect(søkRec("1.1")).toEqual([
    {
      orgnr: "1.1",
      navn: "1.1",
      underenheter: [{ orgnr: "1.1.1", navn: "1.1.1", underenheter: [] }],
    },
    {
      orgnr: "1.3.1",
      navn: "1.3.1",
      underenheter: [{ orgnr: "1.3.1.1", navn: "1.3.1.1", underenheter: [] }],
    },
  ]);
});

test("mapRecursive kan modifisere rekursivt", () => {
  const orgs = flatUtHierarki(hierarki);

  const mapped = mapRecursive(orgs, (org) => ({
    ...org,
    index: -1,
    fokusert: false,
    ekspandert: false,
    valgt: false,
  }));

  expect(mapped[0].index).toBe(0);

  expect(mapped[0].underenheter[0].index).toBe(1);
  expect(mapped[1].index).toBe(2);
  expect(mapped[1].underenheter[0].index).toBe(3);
  expect(mapped[2].index).toBe(4);
  expect(mapped[2].underenheter[0].index).toBe(5);
  expect(mapped[2].underenheter[1].index).toBe(6);
});

test("mapRecursive angir indexer", () => {
  const orgs = flatUtHierarki(MOCK_ORGANISASJONER);

  const mapped = mapRecursive(orgs, (org) => ({
    ...org,
    index: -1,
    fokusert: false,
    ekspandert: false,
    valgt: false,
  }));

  expect(mapped[0].index).toBe(0);
  expect(mapped[0].orgnr).toBe("1.1.1.1");
  expect(mapped[0].underenheter[0].index).toBe(1);
  expect(mapped[0].underenheter[0].orgnr).toBe("1.1.1.1.1");
  expect(mapped[0].underenheter[1].index).toBe(2);
  expect(mapped[0].underenheter[1].orgnr).toBe("1.1.1.1.2");

  expect(mapped[1].index).toBe(3);
  expect(mapped[1].orgnr).toBe("1.1.1.2");
  expect(mapped[1].underenheter[0].index).toBe(4);
  expect(mapped[1].underenheter[0].orgnr).toBe("1.1.1.2.1");
});

test("mapRecursive kan kombineres med søk for reindeksert liste", () => {
  const orgs = flatUtHierarki(hierarki);

  const søkRec = (søketekst: string) =>
    mapRecursive(
      filterRecursive(orgs, (e) =>
        e.navn.toLowerCase().includes(søketekst.toLowerCase()),
      ),
      (org) => ({
        ...org,
        index: -1,
        fokusert: false,
        ekspandert: false,
        valgt: false,
      }),
    );

  const defaults = { fokusert: false, ekspandert: false, valgt: false };
  expect(søkRec("1.1")).toEqual([
    {
      index: 0,
      ...defaults,
      orgnr: "1.1",
      navn: "1.1",
      underenheter: [
        {
          index: 1,
          ...defaults,
          orgnr: "1.1.1",
          navn: "1.1.1",
          underenheter: [],
        },
      ],
    },
    {
      index: 2,
      ...defaults,
      orgnr: "1.3.1",
      navn: "1.3.1",
      underenheter: [
        {
          index: 3,
          ...defaults,
          orgnr: "1.3.1.1",
          navn: "1.3.1.1",
          underenheter: [],
        },
      ],
    },
  ]);
});

test("findLastRecursive finner siste match eller undefined", () => {
  const mapped = mapRecursive(flatUtHierarki(hierarki), (org) => ({
    ...org,
    index: -1,
    fokusert: false,
    ekspandert: false,
    valgt: false,
  }));

  expect(findLastRecursive(mapped, (e) => e.navn === "lolwut")).toBeUndefined();
  expect(findLastRecursive(mapped, (e) => e.index > 2)!.index).toBe(6);
  expect(
    findLastRecursive(mapped, (e) => e.index > 2 && e.index < 5)!.index,
  ).toBe(4);
});

const hierarki = [
  {
    orgnr: "1",
    navn: "1",
    underenheter: [
      {
        orgnr: "1.1",
        navn: "1.1",
        underenheter: [
          {
            orgnr: "1.1.1",
            navn: "1.1.1",
            underenheter: [],
          },
        ],
      },
      {
        orgnr: "1.2",
        navn: "1.2",
        underenheter: [],
      },
      {
        orgnr: "1.3",
        navn: "1.3",
        underenheter: [
          {
            orgnr: "1.3.1",
            navn: "1.3.1",
            underenheter: [
              {
                orgnr: "1.3.1.1",
                navn: "1.3.1.1",
                underenheter: [],
              },
              {
                orgnr: "1.3.1.2",
                navn: "1.3.1.2",
                underenheter: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    orgnr: "2",
    navn: "2",
    underenheter: [],
  },
];

const MOCK_ORGANISASJONER = [
  {
    orgnr: "1",
    navn: "grandparent (skip)",
    altinn3Tilganger: [],
    altinn2Tilganger: [],
    underenheter: [
      {
        orgnr: "1.1",
        navn: "parent",
        underenheter: [
          {
            orgnr: "1.1.1",
            navn: "child (skip)",
            underenheter: [
              {
                orgnr: "1.1.1.1",
                navn: "childs child",
                underenheter: [
                  {
                    orgnr: "1.1.1.1.1",
                    navn: "childs childs child",
                    underenheter: [],
                  },
                  {
                    orgnr: "1.1.1.1.2",
                    navn: "childs childs child",
                    underenheter: [],
                  },
                ],
              },
              {
                orgnr: "1.1.1.2",
                navn: "childs child 2",
                underenheter: [
                  {
                    orgnr: "1.1.1.2.1",
                    navn: "childs childs 2 child",
                    underenheter: [],
                  },
                ],
              },
            ],
          },
          {
            orgnr: "1.1.2",
            navn: "parents child",
            underenheter: [],
          },
        ],
      },
    ],
  },
  {
    orgnr: "2",
    underenheter: [],
    navn: "orphan",
  },
];
