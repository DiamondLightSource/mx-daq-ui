import { useTheme, Box } from "@mui/material";
import "./App.css";
import { ColourSchemeButton, Footer } from "@diamondlightsource/sci-react-ui";
import { Outlet } from "react-router-dom";
import { SerialNavBar } from "./components/SerialNavBar";

function App() {
  const theme = useTheme();
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
      <Outlet />
      <Footer
        logo={theme.logos?.short}
        color={theme.palette.primary.main}
        leftSlot={<ColourSchemeButton />}
        containerWidth={false}
      />
    </Box>
  );
}

export default App;
