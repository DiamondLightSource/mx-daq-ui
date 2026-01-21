import { ReactNode, useState } from "react";
import { VisitContext } from "./VisitContext";

const defaultVisit = "cm44177-1"; // Until we can grab it after authentication

export const VisitProvider = ({ children }: { children: ReactNode }) => {
  const [visit, setVisit] = useState<string>(defaultVisit);

  return (
    <VisitContext.Provider value={{ visit, setVisit }}>
      {children}
    </VisitContext.Provider>
  );
};
