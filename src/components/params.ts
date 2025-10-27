export const chipTypes = ["Oxford", "OxfordInner", "Custom", "MISP"];

export const MapTypes = ["Full Chip", "Lite"];

export const pumpProbeMode = [
  "NoPP",
  "Short1",
  "Short2",
  "Repeat1",
  "Repeat2",
  "Repeat3",
  "Repeat5",
  "Repeat10",
  "Medium1",
];

export type EavaRequest = {
  laserDwell: number; // Laser exposure time, in s
  expTime: number; // Collection exposure time, in s
};

/**
 * Calculate laser delay for EAVA (Excite And Visit Again) pump probe settings.
 * These are the options labeles as "repeat#" in the UI, the number after repeat
 * indicating how many rows are pumped at a time.
 *
 * @param {number} laserDwell - laser exposure time
 * @param {number} expTime - collection exposure time for each window
 * @param {number} factor - number of rows pumped at the time, multiplied by 2
 * @returns {number} The laser delay to set
 */
export function calculateEAVA(
  laserDwell: number,
  expTime: number,
  factor: number,
): number {
  const movetime: number = 0.008;
  const windowsPerRow: number = 20;
  const delay =
    factor * windowsPerRow * (movetime + (laserDwell + expTime) / 2);
  return Number(delay.toFixed(4));
}
