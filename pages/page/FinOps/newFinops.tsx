import React, { useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { useAppContext } from "../../Components/AppContext";
import "rsuite/dist/rsuite.min.css";
import PieChartComponent from "../../Components/Charts/PieChart";
import LineChartComponent from "../../Components/Charts/LineChart";
import { BsPinAngleFill, BsPinAngle, BsTable } from "react-icons/bs";
import { getSubscriptionIds } from "@/pages/api/FinopsApi/GetSubscriptionId";
import { getAllSubscriptions } from "@/pages/api/FinopsApi/GetAllSubscriptions";
import {
  getCurrentUserData,
  unpinGraphAPI,
} from "@/pages/api/FinopsApi/GetGraphFormat";
import BarGraph from "@/pages/Components/Charts/BarChart";
import Table from "@/pages/Components/Charts/Table";
import { Tab, Tabs } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
// import CostSummary from "./CostSummary";
import TagCompliance from "./TagCompliance";
import Forecast from "./Forecast";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
// import CostDrillDown from "./CostDrillDown";
// import LazyLoad from "react-lazyload";

const CostSummary = dynamic(() => import('./CostSummary'))
const CostDrillDown = dynamic(() => import('./CostDrillDown'))

// import BubbleChartComponent from "./Charts/BubbleChart";

const FinOps = () => {
  // const userADID
  // let userRole: string | null;
  // const DynamicDateRangePicker = dynamic(() => import('rsuite').then((mod) => mod.DateRangePicker), {
  //   ssr: false, // Set this to false to disable server-side rendering for the component
  // });


  const [value1, setValue1] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setValue1(newValue);
  };

  return (
    <div className="finops-container h-auto">
      <div className="p-4 h-auto">
        <TabContext value={value1}>
          <div className=" mb-4 p-3 bg-white rounded-lg">
            <Tabs value={value1} onChange={handleChange} centered>
              <Tab value={"1"} label="Multi-cloud Cost Summary" />
              <Tab value={"2"} label="Granular Cost Drill Down" />
              <Tab value={"3"} label="Tag Compliance" />
              <Tab value={"4"} label="Forecast & Recommendations" />
            </Tabs>
          </div>

          <TabPanel value="1">
            <CostSummary />
          </TabPanel>
          <TabPanel value="2">
            <CostDrillDown/>
          </TabPanel>
          <TabPanel value="3">
            <TagCompliance />
          </TabPanel>
          <TabPanel value="4">
            <Forecast />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

export default FinOps;
