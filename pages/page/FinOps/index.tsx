"use client";
import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
// import CostSummary from "./CostSummary";
// import TagCompliance from "./TagCompliance";
// import Forecast from "./Forecast";
import dynamic from "next/dynamic";
// import router from "next/router";
import CostDrillDown from "./CostDrillDown";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import { red } from "@mui/material/colors";
import { useRouter } from "next/router";
// import ForecastLatest from "./Forecast";
// import Forecast from "./Forecast";
const CostSummary = dynamic(() => import("./CostSummary"));
// const CostDrillDown = dynamic(() => import('./CostDrillDown'))
const TagCompliance = dynamic(() => import("./TagCompliance"));
// const Forecast = dynamic(() => import("./ForecastLatest"));
const Forecast = dynamic(() => import("./Forecast"));

function FinOps() {
  // const userADID
  // let userRole: string | null;
  // const DynamicDateRangePicker = dynamic(() => import('rsuite').then((mod) => mod.DateRangePicker), {
  //   ssr: false, // Set this to false to disable server-side rendering for the component
  // });
  //   CostDrillDown
  const router = useRouter();
  const { report }: any = router.query;
  // const [value1, setValue1] = useState<any>("CostDrillDown");
  const [value1, setValue1] = useState<any>(report || "CostSummary");
  const [redBg, setRedBg] = useState(false);


  // code for access control
  const [access, setAccess] = useState(true);

  useEffect(()=>
  {
    if(!sessionStorage.getItem("access") || sessionStorage.getItem("access") === "SSP" )
    {
      console.log(sessionStorage.getItem("access"));
      setAccess(false);
      router.replace("/page/Errors");
    }
    else
    {
      setAccess(true);
    }
  },[]);

  // console.log("report - ",value1)
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    router.push(`/page/FinOps?report=${newValue}`, undefined, {
      shallow: true,
    });
    setValue1(newValue);
  };
  const customTabsStyle = {
    width: "fit-content",
    borderRadius: "50vw",
    overflow: "hidden",
    border: "1px solid #d5c5ee",
    height: "max-content",
    zIndex: 1,
    margin: "auto",
    minHeight: "10px",
    maxHeight: "36px",
    display: "flex", // Add display flex
    alignItems: "center", // Center vertically
  };

  const tabIndicatorStyle = {
    background:
      "transparent linear-gradient(90deg, #AF1E23 -43.96%, #F37032 112.99%)",
    position: "absolute" as "absolute", // Add type assertion for position
    top: 0,
    transform: "translateY(50%)",
    zIndex: 2,
    height: "50%",
    borderRadius: "50vw",
  };

  return (
    access &&
    <div className="Newfinops-container h-auto">
      <div className="h-auto">
        <TabContext value={value1}>
          <div
            className="relative mb-4 p-3 rounded-lg"
            style={{ backgroundColor: "rgba(254, 241, 235, 0.40)" }}
          >
            <Link
              className="z-10 absolute left-2 h-fit w-fit cursor-pointer top-1/2 -translate-y-1/2 flex justify-center items-center"
              href={"/page/FinOps/reports"}
            >
              <IoIosArrowBack size={25} />
            </Link>
            <Tabs
              value={value1}
              onChange={handleChange}
              style={customTabsStyle}
              centered
              TabIndicatorProps={{ style: tabIndicatorStyle }}
            >
              <Tab
                value={"CostSummary"}
                label="Multi-cloud Cost Summary"
                style={{
                  margin: "0 5px",
                  color: value1 === "CostSummary" ? "white" : "black",
                  zIndex: value1 === "CostSummary" ? 3 : 0,
                  fontFamily: `"Oxygen",sans-serif`,
                }}
              />
              <Tab
                value={"CostDrillDown"}
                label="Granular Cost Drill Down"
                style={{
                  margin: "0 5px",
                  color: value1 === "CostDrillDown" ? "white" : "black",
                  zIndex: value1 === "CostDrillDown" ? 3 : 0,
                  fontFamily: `"Oxygen",sans-serif`,
                }}
              />
              <Tab
                value={"TagCompliance"}
                label="Tag Compliance"
                style={{
                  margin: "0 5px",
                  color: value1 === "TagCompliance" ? "white" : "black",
                  zIndex: value1 === "TagCompliance" ? 3 : 0,
                  fontFamily: `"Oxygen",sans-serif`,
                }}
              />
              <Tab
                value={"Forecast"}
                label="Forecast & Recommendations"
                style={{
                  margin: "0 5px",
                  color: value1 === "Forecast" ? "white" : "black",
                  zIndex: value1 === "Forecast" ? 3 : 0,
                  fontFamily: `"Oxygen",sans-serif`,
                }}
              />
            </Tabs>
          </div>

          <TabPanel value="CostSummary">
            <CostSummary />
          </TabPanel>
          <TabPanel value="CostDrillDown">
            <CostDrillDown />
          </TabPanel>
          <TabPanel value="TagCompliance">
            <TagCompliance />
          </TabPanel>
          <TabPanel value="Forecast">
            {/* <ForecastLatest /> */}
            <Forecast />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default FinOps;
