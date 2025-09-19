import { useTheme, Box } from "@mui/material";
import "./App.css";
import { ColourSchemeButton, Footer } from "@diamondlightsource/sci-react-ui";
import { Switch, Route } from "react-router-dom";
import { BeamlineI24 } from "./routes/BeamlineI24";
import { FixedTarget } from "./routes/FixedTarget";
import { SerialNavBar } from "./components/SerialNavBar";
import { Extruder } from "./routes/Extruder";

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
      <Switch>
        <Route exact path="/">
          <BeamlineI24 />
        </Route>
        <Route path="/fixed-target">
          <FixedTarget />
        </Route>
        <Route path="/extruder">
          <Extruder />
        </Route>
      </Switch>
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
