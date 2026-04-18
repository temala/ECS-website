import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CalculateurPrixTransport from "./CalculateurPrixTransport";
import FormulaireAcces from "./FormulaireAcces";

function App() {
  const [hasAccess, setHasAccess] = useState(
    () => localStorage.getItem("ecs_simulator_access") === "true"
  );

  if (!hasAccess) {
    return <FormulaireAcces onAccess={() => setHasAccess(true)} />;
  }

  return <CalculateurPrixTransport />;
}

createRoot(document.getElementById("calculateur-root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
