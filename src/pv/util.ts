import { DType } from "@diamondlightsource/cs-web-lib";
import { useConnection } from "@diamondlightsource/cs-web-lib";
import { ParsePvProps, PvDescription, RawValue } from "./types";

export function forceString(value: RawValue | string | number): string {
  let displayValue: string;
  if (value != "not connected" && value != undefined) {
    const stringVal =
      typeof (value as DType)["getStringValue"] === "function"
        ? (value as DType).getStringValue()
        : value;
    displayValue = stringVal ? stringVal.toString() : "undefined";
  } else if (value === "not connected") {
    displayValue = "not connected";
  } else {
    displayValue = "undefined";
  }
  return displayValue;
}

export function parseNumericPv(
  value: string | number | DType | undefined,
  decimals?: number,
  scaleFactor?: number
): string {
  const decimalsToUse = decimals ? decimals : 2;
  const scaleFactorToUse = scaleFactor ? scaleFactor : 1;
  if (value === undefined) {
    return "undefined";
  }
  if (typeof (value as DType)["getStringValue"] === "function") {
    const numValue = (value as DType).getDoubleValue();
    if (numValue === undefined) {
      return "undefined";
    } else {
      return (numValue * scaleFactorToUse).toFixed(decimalsToUse);
    }
  } else {
    return value.toString();
  }
}

function intArrayToString(arrValue: number[]) {
  return String.fromCharCode.apply(null, arrValue);
}

export function pvIntArrayToString(value: RawValue): string {
  if (value === undefined) {
    return "undefined";
  } else if (value === "not connected") {
    return "not connected";
  } else {
    const arrValue = value.getArrayValue();
    if (arrValue === undefined) {
      return "undefined";
    } else {
      return intArrayToString(arrValue as unknown as number[]);
    }
  }
}

function ReadPvRawValue(props: PvDescription): RawValue {
  const [_effectivePvName, connected, _readonly, latestValue] = useConnection(
    props.label,
    props.pv
  );
  const rawValue: RawValue = connected ? latestValue : "not connected";
  return rawValue;
}

export function useParsedPvConnection(props: ParsePvProps): number | string {
  const rawValue = ReadPvRawValue({ label: props.label, pv: props.pv });
  let returnValue;
  if (rawValue === "not connected") {
    returnValue = "not connected";
  } else if (!rawValue) {
    console.error("Parsed value was undefined");
    returnValue = "undefined";
  } else {
    returnValue = props.transformValue
      ? props.transformValue(rawValue, props.decimals, props.scaleFactor)
      : rawValue;
  }

  // If it's a Dtype cast to string
  if (typeof returnValue !== "string" || typeof returnValue !== "number") {
    returnValue = returnValue.toString();
  }

  console.log(
    `fetched parsed value ${returnValue} for PV: ${props.pv} labeled ${props.label}`
  );
  return returnValue;
}
