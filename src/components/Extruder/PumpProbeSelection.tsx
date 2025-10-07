import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";

export function PumpProbeSelection({
  pumpProbe,
  setPumpProbe,
}: {
  pumpProbe: boolean;
  setPumpProbe: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleChange = (choice: string) => {
    let newValue: boolean;
    if (choice.toLowerCase() === "true") {
      newValue = true;
    } else {
      newValue = false;
    }
    setPumpProbe(newValue);
  };
  return (
    <Tooltip title="Is this a pump probe experiment?" placement="right">
      <FormControl size="small" style={{ width: 180 }}>
        <InputLabel id="pp-ex">Pump Probe</InputLabel>
        <Select
          labelId="pp-ex"
          id="pp"
          value={String(pumpProbe)}
          label="Pump Probe"
          onChange={(e) => handleChange(e.target.value)}
        >
          <MenuItem value={"true"}>True</MenuItem>
          <MenuItem value={"false"}>False</MenuItem>
        </Select>
      </FormControl>
    </Tooltip>
  );
}
