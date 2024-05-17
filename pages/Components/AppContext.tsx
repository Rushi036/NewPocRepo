import React, { createContext, useEffect, useState } from "react";
import moment from "moment";
const AppContext = createContext<{
  access:string
  toggleAccess: (access:any) => void;
  state: boolean;
  toggleState: () => void;
  estimateCalc: boolean;
  toggleEstimateCalc: () => void;
  time: any;
  toggleTime: (time: any) => void;
  timeEnd: any;
  toggleTimeEnd: (timeEnd: any) => void;
  authenticated: boolean;
  toggleAuthenticated: (isAuth: any) => void;
  cloud: any;
  toggleCloud: (cloud: any) => void;
}>({
  access:"",
  toggleAccess:()=> {},
  state: false,
  toggleState: () => {},
  estimateCalc: false,
  toggleEstimateCalc: () => {},
  time: moment().subtract(15, "day").format("YYYY-MM-DDTHH:mm:ss"),
  toggleTime: (time) => {},
  timeEnd: moment().format("YYYY-MM-DDTHH:mm:ss"),
  toggleTimeEnd: (timeEnd) => {},
  authenticated: false,
  toggleAuthenticated: (isAuth) => {},
  cloud: "AWS",
  toggleCloud: (cloud: any) => {},
});

export const AppContextProvider: React.FC<any> = ({ children }: any) => {
  const [access,setAccess] = useState('');
  const [state, setState] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [estimateCalc, setEstimateCalc] = useState(false);
  const [cloud, setCloud] = useState("AWS");


  const toggleAccess = (access:any) => {
    setAccess(access);
  }

  const toggleState = () => {
    setState(!state);
  };
  const toggleAuthenticated = (isAuth: any) => {
    // console.log('dskjjk')
    setAuthenticated(isAuth);
  };
  // console.log("jhejfehjh")
  const toggleEstimateCalc = () => {
    setEstimateCalc((prevState) => !prevState);
  };

  const [time, setTime] = useState(
    moment().subtract(90, "day").format("YYYY-MM-DD")
  );

  const [timeEnd, setTimeEnd] = useState(moment().format("YYYY-MM-DD"));

  const toggleTime = (time: any) => {
    setTime(time);
  };

  const toggleTimeEnd = (timeEnd: any) => {
    setTimeEnd(timeEnd);
  };
  // console.log("est in app",estimateCalc)
  const toggleCloud = (cloud: any) => {
    setCloud(cloud);
  };
  return (
    <AppContext.Provider
      value={{
        access,
        toggleAccess,
        state,
        toggleState,
        estimateCalc,
        toggleEstimateCalc,
        time,
        toggleTime,
        timeEnd,
        toggleTimeEnd,
        authenticated,
        toggleAuthenticated,
        cloud,
        toggleCloud,
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
