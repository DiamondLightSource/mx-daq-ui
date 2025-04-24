// import { createTheme, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@diamondlightsource/cs-web-lib";

import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, DiamondTheme } from "@diamondlightsource/sci-react-ui";

const queryClient = new QueryClient();

// const theme = createTheme({
//   colorSchemes: {
//     light: true,
//     dark: true,
//   },
// });

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={DiamondTheme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
