import React, { createContext } from "react";

export type VisitContextType = {
  visit: string;
  setVisit: React.Dispatch<React.SetStateAction<string>>;
};

export const VisitContext = createContext<VisitContextType>(
  null as unknown as VisitContextType,
);
