import React, { useEffect, useState } from "react";
import { finOps } from "../../api/finOps";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { useAppContext } from "../../Components/AppContext";
import "rsuite/dist/rsuite.min.css";
import PieChartComponent from "../../Components/Charts/PieChart";
import StackChartComponent from "../../Components/Charts/StackChart";
import LineChartComponent from "../../Components/Charts/LineChart";
import AzureData from "./Azure.json";
import AWSData from "./AWS.json";
import Table from "@/pages/Components/Table";
import { getSubscriptionIds } from "@/pages/api/FinopsApi/GetSubscriptionId";
import { getAllSubscriptions } from "@/pages/api/FinopsApi/GetAllSubscriptions";
// import BubbleChartComponent from "./Charts/BubbleChart";

const FinOps = () => {
  let bu_id: string | null;
  const [url, setUrl] = useState<any>();
  const [data, setData] = useState<any>(null);
  const { time, toggleTime } = useAppContext();
  const { timeEnd, toggleTimeEnd } = useAppContext();
  const [cloud, setCloud] = useState("Azure");
  const [subACCName, setSubACCName] = useState();
  const res: any = cloud == "Azure" ? AzureData : AWSData;
  const [subData, setSubData] = useState<any>();
  const [subscId, setSubscId] = useState<any>();
  const [userADID, setUserADID] = useState<any>("keshav.keshu@adityabirla.com"); //this will populate from the session storage
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
  const handleSubNameChange = (e: any) => {
    const selectedSubAccName = e.target.value;
    setSubACCName(selectedSubAccName);
    const selectedSubAcc = subData.find(
      (item: any) => item.subsAccName === selectedSubAccName
    );
    if (selectedSubAcc) {
      setSubscId(selectedSubAcc.subsAccId);
    } else {
      setSubscId("");
    }
  };
  const handleCloudChange = (e: any) => {
    setCloud(e.target.value);
    // setUserADID("keshav.keshu@adityabirla.com");
    // callApi();
  };
  useEffect(() => {
    //user role condition will be here - if role BE then this
    callApi();
  }, [cloud]);

  const callApi = async () => {
    // if (cloud && userADID) {
    const res = await getSubscriptionIds(cloud, userADID);
    if (res && res.data) {
      setSubData(res.data);
    }
    // console.log("subs response", res);
    // }
  };
  // console.log("subs ID", subscId);
  // console.log("subs Name", subACCName);

  const getAllsubsData = async () => {
    //For Admin
    const res = await getAllSubscriptions(cloud);
    if (res) {
      console.log("All Data", res);
    }
  };
  useEffect(() => {
    //user role condition will be here - if role Admin then this
    getAllsubsData();
  }, [cloud]);

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
            {/* {cloud == "Azure" ? ( */}
            {/* <label className="text-lg">Select Account Id : </label> */}
            {/* // ) : ( */}
            <label className="text-lg">Select Subscription Name : </label>
            {/* )} */}
            {/* <label className="text-lg ">Select Id : </label> */}
            <select
              className="block w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => handleSubNameChange(e)}
            >
              {/* subscription id or account id */}
              <option>Select Id</option>
              {subData &&
                subData.map((e: any, i: any) => (
                  <option key={i}>{e.subsAccName}</option>
                ))}
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
        <div className="flex space-x-4 justify-content-between">
          <div className="card !w-1/2">
            <b>
              <span>{res.Metric?.title} - </span>
            </b>
            <span>{res.Metric?.value}</span>
          </div>
          <div className="card !w-1/2">
            <b>
              <span>Subscription Id - </span>
            </b>
            <span>{subscId}</span>
          </div>
        </div>
        <div className="mt-4 h-auto flex flex-wrap gap-4">
          {res.Graph.map((e: any, i: any) => {
            if (e.PieChart) {
              return (
                <div key={i} className="card">
                  <PieChartComponent id={i} data={e.PieChart} />
                </div>
              );
            } else if (e.LineChart) {
              return (
                <div
                  key={i}
                  className={
                    e.LineChart.series?.data?.length >= 20
                      ? "card !min-w-full"
                      : "card"
                  }
                >
                  <LineChartComponent id={i} data={e.LineChart} />
                </div>
              );
            } else if (e.HorizontalStackBarGraph) {
              return (
                <div
                  key={i}
                  className={
                    e.HorizontalStackBarGraph.data.length >= 10
                      ? "card !min-w-full"
                      : "card"
                  }
                >
                  <StackChartComponent id={i} date={value} />
                </div>
              );
            }
          })}
        </div>

        {res.Table?.map((e: any, i: any) => {
          // console.log("table data", e);
          return (
            <div className="card">
              <Table data={e} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinOps;
