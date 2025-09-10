import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@diamondlightsource/cs-web-lib";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@diamondlightsource/sci-react-ui";
import { I24DiamondTheme } from "./CustomTheme.tsx";

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={I24DiamondTheme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="/mx-daq-ui/">
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
