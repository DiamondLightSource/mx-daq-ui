import { createTheme, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const theme = createTheme({});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const client = new ApolloClient({
  uri: "http://localhost:8080/ws",
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>
);
