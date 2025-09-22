import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Get root container safely
const container = document.getElementById("root") as HTMLElement;

if (!container) {
  throw new Error("Root container not found. Did you forget <div id='root'></div> in index.html?");
}

// Create React 18 root
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

