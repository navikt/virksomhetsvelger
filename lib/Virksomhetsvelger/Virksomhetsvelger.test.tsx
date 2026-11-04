import { expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Virksomhetsvelger } from "./Virksomhetsvelger";

const organisasjoner = [
  {
    orgnr: "111111111",
    navn: "Hovedenhet",
    underenheter: [{ orgnr: "222222222", navn: "Underenhet", underenheter: [] }],
  },
];

test("id og aria-attributter settes på knappen, så ErrorSummary-lenker og feilmeldinger treffer den", () => {
  const html = renderToStaticMarkup(
    <Virksomhetsvelger
      id="virksomhet.virksomhetsnummer"
      aria-describedby="virksomhet-feil"
      aria-invalid
      organisasjoner={organisasjoner}
      onChange={() => {}}
      friKomponent
    />,
  );

  const knapp = html.match(/<button[^>]*aria-haspopup[^>]*>/)?.[0];
  expect(knapp).toContain('id="virksomhet.virksomhetsnummer"');
  expect(knapp).toContain('aria-describedby="virksomhet-feil"');
  expect(knapp).toContain('aria-invalid="true"');
});
