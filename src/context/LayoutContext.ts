import { useOutletContext } from "react-router-dom";

export type LayoutContext = {
  beamlineTab: number;
  setBeamlineTab: (tab: number) => void;
};

export function useLayoutContext() {
  return useOutletContext<LayoutContext>();
}
