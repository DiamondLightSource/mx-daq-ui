import { ReactNode, useState } from "react";
import { JungfrauRotationContext } from "./JungfrauRotationContext";

export const JungfrauRotationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [fileName, setFileName] = useState<string>("jf_rotation");
  const [expTime, setExpTime] = useState<number>(0.001);
  const [detDist, setDetDist] = useState<number>(200);
  const [transFract, setTransFract] = useState<number[]>([0.5]);
  const [omegaStart, setOmegaStart] = useState<number>(0);
  const [omegaIncrement, setOmegaIncrement] = useState<number>(0.1);
  const [sampleId, setSampleId] = useState<number>(0);

  return (
    <JungfrauRotationContext.Provider
      value={{
        fileName,
        expTime,
        detDist,
        transFract,
        omegaStart,
        omegaIncrement,
        sampleId,
        setFileName,
        setExpTime,
        setDetDist,
        setTransFract,
        setOmegaStart,
        setOmegaIncrement,
        setSampleId,
      }}
    >
      {children}
    </JungfrauRotationContext.Provider>
  );
};
