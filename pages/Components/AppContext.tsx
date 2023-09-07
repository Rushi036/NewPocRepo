import React, { createContext, useEffect, useState } from "react";

const AppContext = createContext<{
  state: boolean;
  toggleState: () => void;
}>({
  state: true,
  toggleState: () => {},
});

export const AppContextProvider: React.FC<any> = ({ children }: any) => {
  const [state, setState] = useState(true);

  const toggleState = () => {
    setState((prevState) => !prevState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        toggleState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
