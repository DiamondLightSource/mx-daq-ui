import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { Provider } from "react-redux";
// import { store } from "@diamondlightsource/cs-web-lib";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { loadConfig } from "./config.ts";
// import { usePvwsConfig } from "./config.ts";

// import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@diamondlightsource/sci-react-ui";
import { I24DiamondTheme } from "./CustomTheme.tsx";
// import { BeamlineI24 } from "routes/BeamlineI24.tsx";
// import { FixedTarget } from "routes/FixedTarget.tsx";
// import { Extruder } from "routes/Extruder.tsx";

// const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

// const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <App />,
//       children: [
//         {
//           index: true,
//           element: <BeamlineI24 />,
//         },
//         {
//           path: "fixed-target",
//           element: <FixedTarget />,
//         },
//         {
//           path: "extruder",
//           element: <Extruder />,
//         },
//       ],
//     },
//   ],
//   { basename: "/mx-daq-ui/" }
// );

// const usePvwsConfig = () => {
//   const [config, setConfig] = useState<CsWebLibConfig | null>(null);
//   useEffect(() => {
//     loadConfig().then((config) => {
//       setConfig(config);
//     });
//   }, []);
//   return config;
// };

// eslint-disable-next-line react-refresh/only-export-components
// function RootApp() {
//   const config = usePvwsConfig();
//   return (
//     <Provider store={store(config)}>
//       <QueryClientProvider client={queryClient}>
//         <RouterProvider router={router} />
//       </QueryClientProvider>
//     </Provider>
//   );
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={I24DiamondTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
