import { useTheme, Box } from "@mui/material";
import "./App.css";
import { ColourSchemeButton, Footer } from "@diamondlightsource/sci-react-ui";
import { Outlet } from "react-router-dom";
import { SerialNavBar } from "./components/SerialNavBar";
import { Provider } from "react-redux";
import { CsWebLibConfig, store } from "@diamondlightsource/cs-web-lib";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { loadConfig } from "./config.ts";
import { useEffect, useState } from "react";
import { BeamlineI24 } from "./routes/BeamlineI24.tsx";
import { Extruder } from "./routes/Extruder.tsx";
import { FixedTarget } from "./routes/FixedTarget.tsx";
import { JfRotation } from "./routes/JungfrauRotation.tsx";
import type { LayoutContext } from "./context/LayoutContext.ts";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <BeamlineI24 />,
      },
      {
        path: "fixed-target",
        element: <FixedTarget />,
      },
      {
        path: "extruder",
        element: <Extruder />,
      },
      {
        path: "jungfrau",
        element: <JfRotation />,
      },
    ],
  },
]);

function AppLayout() {
  const theme = useTheme();
  const [beamlineTab, setBeamlineTab] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        minHeight: "100vh",
        minWidth: "320px",
        margin: 0,
      }}
    >
      <SerialNavBar />
      <Outlet
        context={{ beamlineTab, setBeamlineTab } satisfies LayoutContext}
      />
      <Footer
        logo={theme.logos?.short}
        color={theme.palette.primary.main}
        leftSlot={<ColourSchemeButton />}
        containerWidth={false}
      />
    </Box>
  );
}

function App() {
  const [config, setConfig] = useState<CsWebLibConfig>();
  useEffect(() => {
    loadConfig().then((config) => {
      setConfig(config);
      console.log(config);
    });
  }, []);

  return (
    <Provider store={store(config)}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
