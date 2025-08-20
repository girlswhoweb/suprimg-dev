import "@shopify/polaris/build/esm/styles.css";
import "./App.css"; // Import our CLS improvement styles
import React from "react";
import ReactDOM from "react-dom/client";
import TranslationProvider from "./AppRoot";
import { initMetrics } from "./utils/metrics";

const root = document.getElementById("root");
if (!root) throw new Error("#root element not found for booting react app");

// Initialize performance metrics tracking
initMetrics({
  logToConsole: true,
  sendToBackend: false // Set to true when backend support is ready
});

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TranslationProvider />
  </React.StrictMode>
);
