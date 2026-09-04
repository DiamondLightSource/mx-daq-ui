import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@diamondlightsource/sci-react-ui";
import { I24DiamondTheme } from "./CustomTheme.tsx";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={I24DiamondTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
