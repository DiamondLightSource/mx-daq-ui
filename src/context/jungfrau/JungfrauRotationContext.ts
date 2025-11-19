// Note not adding visit to it as I want to get that into an overall context

import { createContext } from "react";

// changeble only by staff. For now just a text field
export type JungfrauRotationContextType = {
  directory: string;
  fileName: string;
  expTime: number;
  detDist: number;
  shutterOpenT: number;
  transFract: number[];
  omegaStart: number;
  omegaIncrement: number;
  scanWidth: number;
  setDirectory: React.Dispatch<React.SetStateAction<string>>;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setExpTime: React.Dispatch<React.SetStateAction<number>>;
  setDetDist: React.Dispatch<React.SetStateAction<number>>;
  setShutterOpenT: React.Dispatch<React.SetStateAction<number>>;
  setTransFract: React.Dispatch<React.SetStateAction<number[]>>;
  setOmegaStart: React.Dispatch<React.SetStateAction<number>>;
  setOmegaIncrement: React.Dispatch<React.SetStateAction<number>>;
  setScanWidth: React.Dispatch<React.SetStateAction<number>>;
};

export const JungfrauRotationContext =
  createContext<JungfrauRotationContextType>(
    null as unknown as JungfrauRotationContextType
  );
