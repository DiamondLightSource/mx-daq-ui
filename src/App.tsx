import React from "react";
import { Tabs, Tab, useTheme, Box } from "@mui/material";
import { DetectorMotionTabPanel } from "./screens/DetectorMotion";
import { TestBoxesTabPanel } from "./screens/TestBoxes";
import "./App.css";

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
      <Box sx={{ borderBottom: 1, borderColor: "divider", color: theme.palette.text.secondary }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="primary"
        >
          <Tab label="Detector position" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <DetectorMotionTabPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TestBoxesTabPanel />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <TestBoxesTabPanel />
      </CustomTabPanel>
    </Box>
  );
}

export default App;
