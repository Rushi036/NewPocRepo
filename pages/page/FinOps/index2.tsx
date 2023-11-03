"use client";
import React, { useEffect, useState } from "react";
import { finOps } from "../../api/finOps";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import fun, { useAppContext } from "../../Components/AppContext";
import "rsuite/dist/rsuite.min.css";
import PieChartComponent from "../../Components/Charts/PieChart";
import StackChartComponent from "../../Components/Charts/StackChart";
import LineChartComponent from "../../Components/Charts/LineChart";
import AzureData from "./Azure.json";
import AWSData from "./AWS.json";
import { BsPinAngleFill, BsPinAngle, BsTable } from "react-icons/bs"
import { getSubscriptionIds } from "@/pages/api/FinopsApi/GetSubscriptionId";
import { getAllSubscriptions } from "@/pages/api/FinopsApi/GetAllSubscriptions";
import { getCurrentUserData, unpinGraphAPI } from "@/pages/api/FinopsApi/GetGraphFormat";
import BarGraph from "@/pages/Components/Charts/BarChart";
// import Table from "@/pages/Components/Table";
import dynamic from "next/dynamic";
// import BubbleChartComponent from "./Charts/BubbleChart";

const FinOps = () => {
  // const userADID
  // let userRole: string | null;
  // const DynamicDateRangePicker = dynamic(() => import('rsuite').then((mod) => mod.DateRangePicker), {
  //   ssr: false, // Set this to false to disable server-side rendering for the component
  // });
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
  const [graphFormat, setGraphFormat] = useState<any>(null);
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

  const tableData = {
    Table: [
      {
        headers: ["Sr. no", "Application Name", "Min", "Max", "Avg"],
        data: [
          [
            ["srno", 1],
            ["appname", "HTTP"],
            ["min", 0],
            ["max", 37966029.86666667],
            ["avg", 761918.7798981322],
          ],
          [
            ["srno", 2],
            ["appname", "tcp/5671"],
            ["min", 0],
            ["max", 8792770.133333333],
            ["avg", 170468.6151443124],
          ],
        ],
      },
      {
        headers: ["Sr. no", "Application Name", "Min", "Max", "Avg"],
        data: [
          [
            ["srno", 3],
            ["appname", "HTTP"],
            ["min", 0],
            ["max", 37966029.86666667],
            ["avg", 761918.7798981322],
          ],
          [
            ["srno", 4],
            ["appname", "tcp/5671"],
            ["min", 0],
            ["max", 8792770.133333333],
            ["avg", 170468.6151443124],
          ]
        ]
      }
    ]
  }

  console.log(tableData.Table)

  async function getGraphFormat() {
    await getCurrentUserData().then((res) => setGraphFormat(res.data[0]))
  }
  useEffect(() => {
    // setUserADID(sessionStorage.getItem("userEmail"));
    // setUserRole(sessionStorage.getItem("userRole"));   --------these are for sso login
    setUserADID(localStorage.getItem("userEmail"));
    setUserRole(localStorage.getItem("userRole"));
    getGraphFormat();
  }, []);

  // console.log("graph format",graphFormat)

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
      // console.info("res - ",res.data)
      setSubData(res.data);
      setSubACCName(res.data[0]?.subsAccName)
      setSubscId(res.data[0]?.subsAccId);

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
      fetchDataAzure(body).then(res => { return res.json() }).then((data) => setRes(data))
    }
    else {
      let body = {
        gte: value[0],
        lte: value[1],
        account_id: [subscId],
        account_name: [subACCName],
      };
      // fetchDataAWS(body).then(res => { return res.json() }).then((data) => setRes(data))
      setRes(AWSData);
    }
  }, [cloud, value, subACCName, subscId]);

  async function fetchDataAzure(body: any) {
    return await fetch("http://10.47.98.164:9201/AzureFinopsDashboardData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async function fetchDataAWS(body: any) {
    return await fetch("http://10.47.98.164:9201/AwsFinopsDashboardData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async function unpinGraph(title: any) {
    let chartOrder;
    if (cloud == "AWS") {
      let awsData = graphFormat?.chartOrder?.AWS;
      delete awsData?.[title];
      chartOrder = { AWS: awsData, Azure: graphFormat?.chartOrder?.Azure }
    }
    if (cloud == "Azure") {
      let azureData = graphFormat?.chartOrder?.Azure;
      delete azureData?.[title];
      chartOrder = { Azure: azureData, AWS: graphFormat?.chartOrder?.AWS }
    }
    let data = { ...graphFormat, chartOrder: chartOrder };
    await unpinGraphAPI(graphFormat?.id, data).then(getGraphFormat)
  }

  async function pinGraph(title: any) {
    let chartOrder;
    if (cloud == "AWS") {
      let awsData: any = graphFormat?.chartOrder?.AWS;
      awsData[title] = true;
      chartOrder = { AWS: awsData, Azure: graphFormat?.chartOrder?.Azure }
    }
    if (cloud == "Azure") {
      let azureData = graphFormat?.chartOrder?.Azure;
      azureData[title] = true;
      chartOrder = { Azure: azureData, AWS: graphFormat?.chartOrder?.AWS }
    }
    let data = { ...graphFormat, chartOrder: chartOrder };
    await unpinGraphAPI(graphFormat?.id, data).then(getGraphFormat)
  }

  // function fullScreenTable() {
  //   let myDocument = document.documentElement;
  //   if (myDocument.requestFullscreen) {
  //     myDocument.requestFullscreen();
  //   }
  //   else if (myDocument.msRequestFullscreen) {
  //     myDocument.msRequestFullscreen();
  //   }
  //   else if (myDocument.mozRequestFullScreen) {
  //     myDocument.mozRequestFullScreen();
  //   }
  //   else if (myDocument.webkitRequestFullscreen) {
  //     myDocument.webkitRequestFullscreen();
  //   }
  // }

  // function closeFullScreenTable() {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   }
  //   else if (document.msexitFullscreen) {
  //     document.msexitFullscreen();
  //   }
  //   else if (document.mozexitFullscreen) {
  //     document.mozexitFullscreen();
  //   }
  //   else if (document.webkitexitFullscreen) {
  //     document.webkitexitFullscreen();
  //   }

  

  return (
    <div className="finops-container h-auto">
      <div className="text-xl border-b-2 px-4 border-slate-400 pb-2">
        FinOps
      </div>
      {/* {data ? ( */}
      <div className="p-4 mt-4 h-auto">
        <div className="flex justify-between items-center mb-4 p-3 bg-white rounded-lg">
          <div className="w-1/3">
            <label className="text-lg">Select Cloud : </label>
            <select
              className="block w-full py-2 px-4 border hover:bg-gray-50 focus:bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
            <label className="text-lg">{cloud == "Azure" ? "Select Subscription Name" : "Select Account Name"} : </label>
            {/* )} */}
            {/* <label className="text-lg ">Select Id : </label> */}
            <select
              className="block w-full py-2 px-4 border hover:bg-gray-50 focus:bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => handleSubNameChange(e)}
              value={subACCName}
            >
              {/* subscription id or account id */}
              <option>Select Id</option>
              {subData &&
                subData.map((e: any, i: any) => (
                  <option key={i} value={e.subsAccName}>{e.subsAccName}</option>
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
              className="hover:bg-gray-50 focus:bg-gray-50"
            />
          </div>
        </div>
        <div className="flex space-x-4 justify-content-between">
          <div className="card !w-1/2">
            <b>
              {/* <span className="flex w-full items-center justify-between">{res && res.Metric ? res.Metric[0]?.title + " " : "No data"} <span className="cursor-pointer" onClick={fullScreenTable}><BsTable /></span></span> */}
            </b>

            {/* <br /> */}
            <span>{cloud == "Azure" ? "Total Subscription Cost" : "Total Account Cost"} - </span>
            <span>{cloud == "Azure" ? "₹" : "$"} {res && res.Metric ? res.Metric[0]?.value : ""} </span>
          </div>
          <div className="card !w-1/2">
            <b>
              <span>Subscription Id - </span>
            </b>
            <span>{subscId}</span>
          </div>
        </div>
        <div className="mt-4 h-auto flex flex-wrap gap-4">
          {res && res.Graph?.map((e: any, i: any) => {
            if (e && e.PieChart && graphFormat?.chartOrder?.[cloud]?.[e.PieChart.title]) {
              return (
                <div key={i} className="card">
                  <span className="flex justify-end cursor-pointer" onClick={() => unpinGraph(e.PieChart.title)}>
                    <BsPinAngleFill />
                  </span>
                  <PieChartComponent id={i} data={e.PieChart} />
                </div>
              );
            } else if (e && e.LineChart && graphFormat?.chartOrder?.[cloud]?.[e.LineChart.title]) {
              return (
                <div
                  key={i}
                  className={
                    e.LineChart.series?.data?.length >= 20
                      ? "card !min-w-full"
                      : "card"
                  }
                >
                  <span className="flex justify-end cursor-pointer" onClick={() => unpinGraph(e.LineChart.title)}>
                    <BsPinAngleFill />
                  </span>
                  <LineChartComponent id={i} data={e.LineChart} />
                </div>
              );
            }
            else if (e && e.BarGraph && graphFormat?.chartOrder?.[cloud]?.[e.BarGraph.title]) {
              return (
                <div
                  key={i}
                  className={
                    e.BarGraph.data.length >= 8
                      ? "card !min-w-full"
                      : "card"
                  }
                >
                  <span className="flex justify-end cursor-pointer" onClick={() => unpinGraph(e.BarGraph.title)}>
                    <BsPinAngleFill />
                  </span>
                  <BarGraph id={i} date={value} data={e.BarGraph} />
                </div>
              );
            }

          })}


          {res && res.Graph?.map((e: any, i: any) => {
            if (e && e.PieChart && !graphFormat.chartOrder?.[cloud]?.[e.PieChart.title]) {
              return (
                <div key={i} className="card">
                  <span className="flex justify-end cursor-pointer" onClick={() => pinGraph(e.PieChart.title)}>
                    <BsPinAngle />
                  </span>
                  <PieChartComponent id={i} data={e.PieChart} />
                </div>
              );
            } else if (e && e.LineChart && !graphFormat.chartOrder?.[cloud]?.[e.LineChart.title]) {
              return (
                <div
                  key={i}
                  className={
                    e.LineChart.series?.data?.length >= 20
                      ? "card !min-w-full"
                      : "card"
                  }
                >
                  <span className="flex justify-end cursor-pointer" onClick={() => pinGraph(e.LineChart.title)}>
                    <BsPinAngle />
                  </span>
                  <LineChartComponent id={i} data={e.LineChart} />
                </div>
              );
            }
            else if (e && e.BarGraph && !graphFormat.chartOrder?.[cloud]?.[e.BarGraph.title]) {
              return (
                <div
                  key={i}
                  className={
                    e.BarGraph.data.length >= 8
                      ? "card !min-w-full"
                      : "card"
                  }
                >
                  <span className="flex justify-end cursor-pointer" onClick={() => pinGraph(e.BarGraph.title)}>
                    <BsPinAngle />
                  </span>
                  <BarGraph id={i} date={value} data={e.BarGraph} />
                </div>
              );
            }
          })}

          {res && res.Table?.map((e: any, i: any) => {
            return (
              <>
                <div key={i} className="card">
                  {/* <Table data={e} /> */}
                </div>
              </>
            )
          })}

          {/* 
          {tableData.Table?.map((e: any, i: any) => {
            // <Table data={e} />
            <div>hi</div>
          })} */}
        </div>

      </div>
    </div>
  );
};

export default FinOps;
