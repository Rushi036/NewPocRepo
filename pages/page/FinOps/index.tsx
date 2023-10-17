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
import { getSubscriptionIds } from "@/pages/api/FinopsApi/GetSubscriptionId";
import { getAllSubscriptions } from "@/pages/api/FinopsApi/GetAllSubscriptions";
// import BubbleChartComponent from "./Charts/BubbleChart";

const FinOps = () => {
  // const userADID
  // let userRole: string | null;
  const [url, setUrl] = useState<any>();
  const [data, setData] = useState<any>(null);
  const { time, toggleTime } = useAppContext();
  const { timeEnd, toggleTimeEnd } = useAppContext();
  const [cloud, setCloud] = useState("Azure");
  const [subACCName, setSubACCName] = useState();
  // const res: any = cloud == "Azure" ? AzureData : AWSData;
  const [res, setRes] = useState<any>(null)
  const [subData, setSubData] = useState<any>();
  const [subscId, setSubscId] = useState<any>();
  const [userADID, setUserADID] = useState<any>(null); //this will populate from the session storage
  const [userRole, setUserRole] = useState<any>(null); //this will populate from the session storage
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

  useEffect(() => {
    setUserADID(sessionStorage.getItem("userEmail"));
    setUserRole(sessionStorage.getItem("userRole"));
  }, []);

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
  };
  useEffect(() => {
    // console.log(cloud,subData, userRole)
    if (userRole == "BE") {
      callApi();
    } else if (userRole == "ADMIN") {
      getAllsubsData();
    }
  }, [cloud, userRole]);

  const callApi = async () => {
    //For BE
    await getSubscriptionIds(cloud, userADID).then((res: any) => {
      setSubData(res.data);
    })
  };

  const getAllsubsData = async () => {
    //For Admin
    await getAllSubscriptions(cloud).then((res: any) => {
      // console.info("res - ",res)
      setSubData(res.data);
    })
  };

  useEffect(() => {
    value && toggleTime(value[0]);
    value && toggleTimeEnd(value[1]);
  }, [value]);


  useEffect(() => {
    if (cloud == "Azure") {

      let body = {
        gte: value[0],
        lte: value[1],
        subscription_name: [subACCName],
      };
      fetchData(body).then(res => { return res.json() }).then((data) => setRes(data))
    }
    else {
      setRes(AWSData);
    }
  }, [cloud, value, subACCName]);

  async function fetchData(body: any) {
    return await fetch("http://10.47.98.164:9201/AzureFinopsDashboardData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

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
              <span>{res && res.Metric ? res.Metric.title + " " : "No data"} </span>
            </b>
            <br />
            <span>Total Subscription Cost - </span>
            <span>₹ {res && res.Metric ? res.Metric.value : ""} </span>
          </div>
          <div className="card !w-1/2">
            <b>
              <span>Subscription Id - </span>
            </b>
            <span>{subscId}</span>
          </div>
        </div>
        <div className="mt-4 h-auto flex flex-wrap gap-4">
          {res && res.Graph.map((e: any, i: any) => {
            if (e && e.PieChart) {
              return (
                <div key={i} className="card">
                  <PieChartComponent id={i} data={e.PieChart} />
                </div>
              );
            } else if (e && e.LineChart) {
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
            } else if (e && e.HorizontalStackBarGraph) {
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
            else if (e && e.HorizontalBarGraph) {
              return (
                <div key={i} className="card">
                  <StackChartComponent id={i} data={e.HorizontalBarGraph} />
                </div>
              );
            }
          })}
        </div>

      </div>
    </div>
  );
};

export default FinOps;
