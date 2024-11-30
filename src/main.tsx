import { createRoot } from "react-dom/client";
import { createActorContext } from "@xstate/react";
import "./index.css";
import { App } from "./App.tsx";
import { slowCookerMachine } from "./machines/slowCookerMachine";

export const CookerContext = createActorContext(slowCookerMachine);

createRoot(document.getElementById("root")!).render(
  <CookerContext.Provider>
    <App />
  </CookerContext.Provider>
);
