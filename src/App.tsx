import React from "react";
import { Tabs, Tab, useTheme, Box } from "@mui/material";
import { DetectorMotionTabPanel } from "./screens/DetectorMotion";
import { BeamlineStatsTabPanel } from "./screens/BeamlineStats";
import { OavMover } from "./screens/OavMover";
import "./App.css";
import { ParamsPanel } from "./screens/CollectionPanel";
import {
  ColourSchemeButton,
  Footer,
  FooterLinks,
} from "@diamondlightsource/sci-react-ui";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function FixedTargetPanels() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <Box
        component="section"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          color: theme.palette.text.secondary,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="secondary"
          centered
        >
          <Tab label="Beamline info" {...a11yProps(0)} />
          <Tab label="Detector position" {...a11yProps(1)} />
          <Tab label="OAV view" {...a11yProps(2)} />
          <Tab label="Fixed Target Collection" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <BeamlineStatsTabPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DetectorMotionTabPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <OavMover />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ParamsPanel />
      </CustomTabPanel>
    </div>
  );
}

function App() {
  const theme = useTheme();

  return (
    <Box
      sx={[
        () => ({
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: "320px",
          margin: 0,
        }),
      ]}
    >
      <FixedTargetPanels />
      <Footer logo={theme.logos.normal} color={theme.palette.primary.main}>
        <FooterLinks>
          <ColourSchemeButton sx={{ marginLeft: "1px", marginTop: "2px" }} />
        </FooterLinks>
      </Footer>
    </Box>
  );
}

export default App;
