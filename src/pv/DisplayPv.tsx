import { PvDescription, PvItemComponent, readPvRawValue } from "./PvComponent";

type RoPvProps = PvDescription & {
  render: PvItemComponent;
  transformValue?: Transformer;
  decimals?: number;
  scaleFactor?: number;
};

export function DisplayPvBox(props: RoPvProps) {
  const rawValue = readPvRawValue(props.label, props.pv);
  if rawValue === "not connected" {
    valueToRender = rawValue
  } else {
    valueToRender = props.transformValue ? props.transformValue(rawValue) : rawValue;
  }
}
