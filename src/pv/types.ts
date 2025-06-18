import { DType } from "@diamondlightsource/cs-web-lib";

type NotConnected = "not connected";
export type RawValue = DType | undefined | NotConnected;

type TransformString = (value: RawValue) => string | number;
type TransformNumeric = (
  value: RawValue,
  decimals?: number,
  scaleFactor?: number
) => string | number;
export type PvTransformer = TransformString | TransformNumeric;

export type PvDescription = {
  label: string;
  pv: string;
};

type PvItem = { label: string; value: RawValue | number | string };
type PvItemComponent = ({ label, value }: PvItem) => JSX.Element;

export type RenderedPvValue = RawValue | string | number;

export type ParsePvProps = PvDescription & {
  transformValue?: PvTransformer;
  decimals?: number;
  scaleFactor?: number;
};

export type PvComponentProps = ParsePvProps & { render?: PvItemComponent };
