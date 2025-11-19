import { ReactNode, useState } from "react";
import { JungfrauRotationContext } from "./JungfrauRotationContext";

export const JungfrauRotationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [directory, setDirectory] = useState<string>("test");
  const [fileName, setFileName] = useState<string>("thau");
  const [expTime, setExpTime] = useState<number>(0.001);
  const [detDist, setDetDist] = useState<number>(200);
  const [shutterOpenT, setShutterOpenT] = useState<number>(0.25);
  const [transFract, setTransFract] = useState<number[]>([0.5]);
  const [omegaStart, setOmegaStart] = useState<number>(0);
  const [omegaIncrement, setOmegaIncrement] = useState<number>(0.1);
  const [scanWidth, setScanWidth] = useState<number>(360);

  return (
    <JungfrauRotationContext.Provider
      value={{
        directory,
        fileName,
        expTime,
        detDist,
        shutterOpenT,
        transFract,
        omegaStart,
        omegaIncrement,
        scanWidth,
        setDirectory,
        setFileName,
        setExpTime,
        setDetDist,
        setShutterOpenT,
        setTransFract,
        setOmegaStart,
        setOmegaIncrement,
        setScanWidth,
      }}
    >
      {children}
    </JungfrauRotationContext.Provider>
  );
};
