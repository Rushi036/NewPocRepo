import React, { useEffect, useState } from "react";
import { finOps } from "../../api/finOps";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { useAppContext } from "../../Components/AppContext";
import "rsuite/dist/rsuite.min.css";
import PieChartComponent from "../../Components/Charts/PieChart";
import StackChartComponent from "../../Components/Charts/StackChart";
import LineChartComponent from "../../Components/Charts/LineChartBlendedCost";
// import BubbleChartComponent from "./Charts/BubbleChart";

const FinOps = () => {
  let bu_id: string | null;
  const [url, setUrl] = useState<any>();
  const [data, setData] = useState<any>(null);
  const { time, toggleTime } = useAppContext();
  const { timeEnd, toggleTimeEnd } = useAppContext();
  const [cloud, setCloud] = useState("Azure");
  const [Id, setId] = useState();
  const res = [
    {
      PieChart: {
        title: "Resource Group consumption",
        data: [
          ["grcd-az-sap-dp-rsg-01", 1616],
          ["digitalexdrprod-resource", 287],
          ["grcd-az-sur-pp-rsg-01-asr", 146],
          ["grcd-az-sur-dp-rsg-asr-01", 644],
          ["grcd-az-sur-dp-rsg-01", 817],
        ],
      },
    },
    {
      Mertric: {
        title: "Grasim Chemical Division - DR PROD",
        value: 328460.59684130736,
      },
    },
    {
      PieChart: {
        title: "Cost Distribution at application level",
        data: [
          ["ECC-DR-DB+CI (On Demand)", 29778.70211209737],
          ["DR-GRC Tool (SAP SURROUND)", 1251.6276209803618],
          ["DR-Central Mfg Cockpit (SAP SURROUND)", 1202.8653640140838],
          ["DR - TrueCopy Digital Sign (SAP SURROUND)", 2404.4580796147857],
          ["DR-Surakhsha (SAP SURROUND)", 4585.552786759836],
          ["ECC-DR-APP1", 648.4713706970215],
          ["DR-Tonner Management DB (SAP SURROUND)", 5015.091064453125],
          ["ECC-DR-APP2", 573.1545715332031],
          ["DR-Tonner Management App (SAP SURROUND)", 0],
        ],
      },
    },
  ];
  const [value, setValue] = React.useState<any>([
    new Date(time),
    new Date(timeEnd),
  ]);
  const { afterToday }: any = DateRangePicker;
  const predefinedRanges: any = [
    {
      label: "Last 1 hour",
      value: [
        new Date(moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],
      placement: "left",
    },
    {
      label: "Last 7 hour",
      value: [
        new Date(moment().subtract(7, "hour").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last day",

      value: [
        new Date(moment().subtract(1, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 7 days",

      value: [
        new Date(moment().subtract(7, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 15 days",

      value: [
        new Date(moment().subtract(15, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 30 days",

      value: [
        new Date(moment().subtract(30, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },

    {
      label: "Last 90 days",

      value: [
        new Date(moment().subtract(90, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },
  ];
  const handleIdChange = (e: any) => {
    setId(e.target.value);
  };
  const handleCloudChange = (e: any) => {
    setCloud(e.target.value);
  };
  useEffect(() => {
    value && toggleTime(value[0]);
    value && toggleTimeEnd(value[1]);
  }, [value]);
  useEffect(() => {
    bu_id = localStorage.getItem("bu_id");
    dataFetch();
  }, []);
  // }
  async function dataFetch() {
    // const res: any = await finOps(bu_id);
    // setData(res.data);
    // setUrl(data[1]);
  }
  // console.log("api payload data", Id, value);
  return (
    <div className="h-auto">
      <div className="text-xl border-b-2 px-4 border-slate-400 pb-2">
        FinOps
      </div>
      {/* {data ? ( */}
      <div className="p-4 mt-4 h-auto">
        <div className="flex justify-between items-center mb-4 p-3 bg-slate-300 rounded-lg">
          <div className="w-1/3">
            <label className="text-lg">Select Cloud : </label>
            <select
              className="block w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => handleCloudChange(e)}
            >
              <option disabled>Select Cloud</option>
              <option value="Azure">Azure</option>
              <option value="AWS">AWS</option>
            </select>
          </div>
          <div className="w-1/3 mx-2">
            {cloud == "Azure" ? (
              <label className="text-lg">Select Account Id : </label>
            ) : (
              <label className="text-lg">Select Subscription Id : </label>
            )}
            {/* <label className="text-lg ">Select Id : </label> */}
            <select
              className="block w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => handleIdChange(e)}
            >
              {/* subscription id or account id */}
              <option disabled>Select Id</option>
              <option value="718927010207">718927010207</option>{" "}
              <option value="718927010107">718927010107</option>
            </select>
          </div>
          <div className="w-1/3">
            <label className="text-lg">Select Date Range : </label>
            <DateRangePicker
              placement="auto"
              value={value}
              onChange={setValue}
              ranges={predefinedRanges}
              // showOneCalendar
              style={{ width: "100%" }}
              shouldDisableDate={afterToday()}
              placeholder="Select Date Range"
              format="yyyy-MM-dd HH:mm:ss"
            />
          </div>
        </div>
        <div className="card !w-full">
          <b>
            <span>Lorem ipsum dolor sit - </span>
          </b>
          <span>83012.123</span>
        </div>
        <div className="mt-4 h-auto flex flex-wrap gap-4">
          <div className="card">
            <LineChartComponent Id={Id ? Id : 0} date={value} />
          </div>
          <div className="card">
            <PieChartComponent id="1" />
          </div>
          <div className="card">
            <StackChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinOps;
