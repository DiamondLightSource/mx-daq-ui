import { createContext } from "react";
import { UseQueryResult } from "react-query";

type BeamCenterQueryResult = UseQueryResult<string, unknown>;

export const BeamCenterContext = createContext<BeamCenterQueryResult>(
  null as unknown as BeamCenterQueryResult,
);
