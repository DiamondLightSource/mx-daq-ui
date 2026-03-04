import { createContext } from "react";

type BeamCenterQueryResult = {
  data: string | null | undefined;
  refetch: () => void;
};

export const BeamCenterContext = createContext<BeamCenterQueryResult>({
  data: null,
  refetch: () => {},
});
