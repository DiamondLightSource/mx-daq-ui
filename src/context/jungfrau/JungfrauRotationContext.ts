import { createContext } from "react";

export type JungfrauRotationContextType = {
  fileName: string;
  expTime: number;
  detDist: number;
  transFract: number[];
  omegaStart: number;
  omegaIncrement: number;
  sampleId: number;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setExpTime: React.Dispatch<React.SetStateAction<number>>;
  setDetDist: React.Dispatch<React.SetStateAction<number>>;
  setTransFract: React.Dispatch<React.SetStateAction<number[]>>;
  setOmegaStart: React.Dispatch<React.SetStateAction<number>>;
  setOmegaIncrement: React.Dispatch<React.SetStateAction<number>>;
  setSampleId: React.Dispatch<React.SetStateAction<number>>;
};

export const JungfrauRotationContext =
  createContext<JungfrauRotationContextType>(
    null as unknown as JungfrauRotationContextType,
  );
