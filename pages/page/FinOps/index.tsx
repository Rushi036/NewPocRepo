"use client";
import React, { useState } from "react";
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
const CostSummary = dynamic(() => import("./CostSummary"));
// const CostDrillDown = dynamic(() => import('./CostDrillDown'))
const TagCompliance = dynamic(() => import("./TagCompliance"));
const Forecast = dynamic(() => import("./Forecast"));

function FinOps() {
  // const userADID
  // let userRole: string | null;
  // const DynamicDateRangePicker = dynamic(() => import('rsuite').then((mod) => mod.DateRangePicker), {
  //   ssr: false, // Set this to false to disable server-side rendering for the component
  // });
  //   CostDrillDown
  // const { report }:any = router.query;
  const [value1, setValue1] = useState<any>("CostDrillDown");
  // const [value1, setValue1] = useState<any>(report || "CostSummary");
  // console.log("report - ",value1)
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue1(newValue);
  };

  return (
    <div className="Newfinops-container h-auto">
      <div className=" h-auto">
        <TabContext value={value1}>
          <div className="relative mb-4 p-3 bg-white rounded-lg">
            <Link
              className="z-10 absolute left-2 h-fit w-fit cursor-pointer top-1/2 -translate-y-1/2 flex justify-center items-center"
              href={"/page/FinOps/reports"}
            >
              <IoIosArrowBack size={25} />
            </Link>
            <Tabs value={value1} onChange={handleChange} centered>
              <Tab value={"CostSummary"} label="Multi-cloud Cost Summary" />
              <Tab value={"CostDrillDown"} label="Granular Cost Drill Down" />
              <Tab value={"3"} label="Tag Compliance" />
              <Tab value={"Forcast"} label="Forecast & Recommendations" />
            </Tabs>
          </div>

          <TabPanel value="CostSummary">
            <CostSummary />
          </TabPanel>
          <TabPanel value="CostDrillDown">
            <CostDrillDown />
          </TabPanel>
          <TabPanel value="3">
            <TagCompliance />
          </TabPanel>
          <TabPanel value="Forcast">
            <Forecast />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default FinOps;
