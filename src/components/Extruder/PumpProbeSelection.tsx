import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";

// NOTE THIS DOESN'T WORK BECAUSE IT DOES NOT LIKE BOOLEANS!!!
// TODO LOTS OF CASTING
export function PumpProbeSelection({
  pumpProbe,
  setPumpProbe,
}: {
  pumpProbe: boolean;
  setPumpProbe: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleChange = (choice: string | boolean) => {
    const ppVal = String(pumpProbe);
    console.log(ppVal);
    console.log(choice);
    console.log(Boolean(choice));
    setPumpProbe(Boolean(choice));
  };
  return (
    <Tooltip title="Is this a pump probe experiment?" placement="right">
      <FormControl size="small" style={{ width: 180 }}>
        <InputLabel id="pp-ex">Pump Probe</InputLabel>
        <Select
          labelId="pp-ex"
          id="pp"
          value={pumpProbe}
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
