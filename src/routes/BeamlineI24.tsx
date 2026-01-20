import { Box, Tab, Tabs, useTheme } from "@mui/material";
import { BeamlineStatsTabPanel } from "screens/BeamlineStats";
import { DetectorMotionTabPanel } from "screens/DetectorMotion";
import { OavMover } from "screens/OavMover/OAVStageController";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackScreen } from "screens/FallbackScreen";

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

export function BeamlineI24() {
  const theme = useTheme();
  const [tab, setTab] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };
  return (
    <ErrorBoundary fallback={<FallbackScreen />}>
      <Box>
        <Box
          component="section"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            color: theme.palette.text.secondary,
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="secondary"
            centered
          >
            <Tab label="Beamline info" {...a11yProps(0)} />
            <Tab label="Detector position" {...a11yProps(1)} />
            <Tab label="OAV view" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <BeamlineStatsTabPanel />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <DetectorMotionTabPanel />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={2}>
          <OavMover />
        </CustomTabPanel>
      </Box>
    </ErrorBoundary>
  );
}
