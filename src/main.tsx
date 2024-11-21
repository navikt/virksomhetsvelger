import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import "./index.css";

import App from "./App.tsx";
injectDecoratorClientSide({
  env: "dev",
  context: "arbeidsgiver",
}).catch((e) => {
  console.error("#MSA: injectDecoratorClientSide feilet", e);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
