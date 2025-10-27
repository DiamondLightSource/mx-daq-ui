import { RawValue } from "../pv/types";
import { forceString, ReadPvRawValue } from "../pv/util";

/**
 * Read the full visit path from the visit PV set by the beamline staff.
 * @returns {string} the full visit pV /dls/i24/data/{year}/{visit}
 */
export function readVisitFromPv(): string {
  const fullVisitPath: RawValue = ReadPvRawValue({
    label: "visit",
    pv: "ca://BL24I-MO-IOC-13:GP100",
  });
  const visitString: string = forceString(fullVisitPath);
  return visitString;
}

/**
 * Parse the full visit path and return only the instrument session.
 * An error will be raised if the instrument session value is undefined or
 * if the PV is not connected.
 * @param {string} visit The full visit path
 * @returns {string} Only the instrument session part of the visit path
 */
export function parseInstrumentSession(visit: string): string {
  let instrumentSession: string | undefined;
  if (visit === "not connected" || visit === "undefined") {
    const msg =
      "Unable to run plan as instrument session not set. Please check visit PV.";
    throw new Error(msg);
  } else {
    instrumentSession = visit.split("/").filter(Boolean).at(-1);
    if (!instrumentSession) {
      throw new Error(
        "Unable to run plan as something appears to be wrong with visit path"
      );
    }
  }
  return instrumentSession;
}
