import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@diamondlightsource/cs-web-lib";
import logo from "./assets/logo.svg";

import { QueryClient, QueryClientProvider } from "react-query";
import {
  ThemeProvider,
  DiamondTheme,
  ImageColorSchemeSwitchType,
} from "@diamondlightsource/sci-react-ui";
import { createTheme, Theme } from "@mui/material";

const queryClient = new QueryClient();

/** Set up a customisable theme derived from the common DiamondTheme
 * This way it should be possible to easily add settings if required
 * eg. to add colorescheme options
 * colorSchemes: {
 *   dark: {
 *     palette: {
 *       background: {
 *         default: "121212",
 *         paper: "121212",
 *       },
 *     },
 *   },
 * }, */

const dlsLogo: ImageColorSchemeSwitchType = {
  src: logo,
  alt: "DLS Logo",
};

const I24DiamondTheme: Theme = createTheme({
  ...DiamondTheme,
  logos: {
    normal: dlsLogo,
  },
});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={I24DiamondTheme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
