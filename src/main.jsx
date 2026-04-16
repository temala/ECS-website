import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CalculateurPrixTransport from "./CalculateurPrixTransport";

createRoot(document.getElementById("calculateur-root")).render(
  <React.StrictMode>
    <CalculateurPrixTransport />
  </React.StrictMode>
);
