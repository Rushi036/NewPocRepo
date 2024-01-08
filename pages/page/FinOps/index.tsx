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
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { report }: any = router.query;
  // const [value1, setValue1] = useState<any>("CostDrillDown");
  const [value1, setValue1] = useState<any>(report || "CostSummary");
  const [redBg, setRedBg] = useState(false);
  // console.log("report - ",value1)
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    router.push(`/page/FinOps?report=${newValue}`, undefined, { shallow: true });
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
  };
  const tabIndicatorStyle = {
    background: `transparent linear-gradient(273deg, #c52828 0%, #e95555 100%)`,
    border: "4px solid white",
  };
  return (
    <div className="Newfinops-container h-auto">
      <div className="h-auto">
        <TabContext value={value1}>
          <div className="relative mb-4 p-3 bg-white rounded-lg">
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
              <Tab value={"CostSummary"} label="Multi-cloud Cost Summary" />
              <Tab value={"CostDrillDown"} label="Granular Cost Drill Down" />
              <Tab value={"TagCompliance"} label="Tag Compliance" />
              <Tab value={"Forcast"} label="Forecast & Recommendations" />
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
          <TabPanel value="Forcast">
            <Forecast />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}

export default FinOps;
