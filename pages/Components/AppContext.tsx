import React, { createContext, useEffect, useState } from "react";

const AppContext = createContext<{
  state: boolean;
  toggleState: () => void;
  estimateCalc: boolean;
  toggleEstimateCalc: () => void;
}>({
  state: true,
  toggleState: () => {},
  estimateCalc: false,
  toggleEstimateCalc: () => {}
});

export const AppContextProvider: React.FC<any> = ({ children }: any) => {
  const [state, setState] = useState(true);
  const [estimateCalc , setEstimateCalc] = useState(false);

  const toggleState = () => {
    setState((prevState) => !prevState);
  };
  const toggleEstimateCalc = () => {
    setEstimateCalc((prevState) => !prevState);
  };
console.log("est in app",estimateCalc)

  return (
    <AppContext.Provider
      value={{
        state,
        toggleState,
        estimateCalc,
        toggleEstimateCalc
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
export default function fun(){
  return(null);
};