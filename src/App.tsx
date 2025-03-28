import React from "react";
import { Tabs, Tab, useTheme, Box } from "@mui/material";
import { DetectorMotionTabPanel } from "./screens/DetectorMotion";
import { BeamlineStatsTabPanel } from "./screens/BeamlineStats";
import { OavMover } from "./screens/OavMover";
import "./App.css";
import { BlueApiInfo } from "./screens/BlueApiInfo";
import { ParamsPanel } from "./screens/CollectionPanel";

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

function App() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
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
          textColor="primary"
        >
          <Tab label="BlueAPI info" {...a11yProps(0)} />
          <Tab label="Detector position" {...a11yProps(1)} />
          <Tab label="OAV view" {...a11yProps(2)} />
          <Tab label="Beamline stats" {...a11yProps(3)} />
          <Tab label="Fixed Target Collection" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <BlueApiInfo />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <DetectorMotionTabPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <OavMover />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <BeamlineStatsTabPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <ParamsPanel />
      </CustomTabPanel>
    </Box>
  );
}

export default App;
