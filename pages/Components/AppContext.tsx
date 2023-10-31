import React, { createContext, useEffect, useState } from "react";
import moment from "moment";
const AppContext = createContext<{
  state: boolean;
  toggleState: () => void;
  estimateCalc: boolean;
  toggleEstimateCalc: () => void;
  time: any;
  toggleTime: (time: any) => void;
  timeEnd: any;
  toggleTimeEnd: (timeEnd: any) => void;
}>({
  state: true,
  toggleState: () => {},
  estimateCalc: false,
  toggleEstimateCalc: () => {},
  time: moment().subtract(15, "day").format("YYYY-MM-DDTHH:mm:ss"),

  toggleTime: (time) => {},

  timeEnd: moment().format("YYYY-MM-DDTHH:mm:ss"),

  toggleTimeEnd: (timeEnd) => {},
});

export const AppContextProvider: React.FC<any> = ({ children }: any) => {
  const [state, setState] = useState(true);
  const [estimateCalc, setEstimateCalc] = useState(false);

  const toggleState = () => {
    setState((prevState) => !prevState);
  };
  const toggleEstimateCalc = () => {
    setEstimateCalc((prevState) => !prevState);
  };

  const [time, setTime] = useState(
    moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss")
  );

  const [timeEnd, setTimeEnd] = useState(
    moment().format("YYYY-MM-DDTHH:mm:ss")
  );

  const toggleTime = (time: any) => {
    setTime(time);
  };

  const toggleTimeEnd = (timeEnd: any) => {
    setTimeEnd(timeEnd);
  };
  // console.log("est in app",estimateCalc)

  return (
    <AppContext.Provider
      value={{
        state,
        toggleState,
        estimateCalc,
        toggleEstimateCalc,
        time,
        toggleTime,
        timeEnd,
        toggleTimeEnd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
export default function fun() {
  return null;
}
