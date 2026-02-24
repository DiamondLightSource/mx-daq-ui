export function fullStorageDirectory(currentVisit: string): string {
  return `${currentVisit}jungfrau`;
}

export function getCurrentVisit(instrumentSession: string): string {
  const date = new Date();
  const year = date.getFullYear();
  return `/dls/i24/data/${year}/${instrumentSession}/`;
}
