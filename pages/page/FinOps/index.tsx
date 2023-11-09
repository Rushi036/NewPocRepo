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
import { BsPinAngleFill, BsPinAngle } from "react-icons/bs";
import { getSubscriptionIds } from "@/pages/api/FinopsApi/GetSubscriptionId";
import { getAllSubscriptions } from "@/pages/api/FinopsApi/GetAllSubscriptions";
import {
  getCurrentUserData,
  unpinGraphAPI,
} from "@/pages/api/FinopsApi/GetGraphFormat";
import { finopsServerBaseUrl, localHostBaseUrl } from "@/const";
import BarGraph from "@/pages/Components/Charts/BarChart";
import Table from "@/pages/Components/Charts/Table";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
// import BubbleChartComponent from "./Charts/BubbleChart";
import CloseIcon from "@mui/icons-material/Close";

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
  const [res, setRes] = useState<any>(null);
  const [subData, setSubData] = useState<any>();
  const [subscId, setSubscId] = useState<any>();
  const [subsIndexName, setSubsIndexName] = useState<any>();
  const [graphFormat, setGraphFormat] = useState<any>(null);
  const [userADID, setUserADID] = useState<any>(null); //this will populate from the session storage
  const [userRole, setUserRole] = useState<any>(null); //this will populate from the session storage
  const [titleValueCount, setTitleValueCount] = useState(0);
  const [isOpen, setIsOpen] = useState<any>(false);
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

  async function getGraphFormat() {
    await getCurrentUserData().then((res) => setGraphFormat(res.data[0]));
  }
  useEffect(() => {
    setUserADID(sessionStorage.getItem("userEmail"));
    setUserRole(sessionStorage.getItem("userRole"));
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
      setSubsIndexName(selectedSubAcc.subsIndexName);
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
    });
  };

  const getAllsubsData = async () => {
    //For Admin
    await getAllSubscriptions(cloud).then((res: any) => {
      // console.info("res - ",res.data)
      setSubData(res.data);
      setSubACCName(res.data[0]?.subsAccName);
      setSubsIndexName(res.data[0]?.subsIndexName);
      setSubscId(res.data[0]?.subsAccId);
    });
  };
  // console.log("sub data", subData);
  // res && console.log("res data", res.Metric[1].Table[0].data);
  useEffect(() => {
    value && toggleTime(value[0]);
    value && toggleTimeEnd(value[1]);
  }, [value]);

  useEffect(() => {
    // Function to count the titles and values in Metric array
    const countTitleValues = () => {
      let count = 0;
      if (res && res.Metric) {
        count = res.Metric.reduce((total: any, metric: any) => {
          if (metric && metric.title && metric.value) {
            return total + 1;
          }
          return total;
        }, 0);
      }
      return count;
    };

    // Set the title and value count to the state
    setTitleValueCount(countTitleValues());
  }, [res]);
  // console.log("count", titleValueCount);
  useEffect(() => {
    if (cloud == "Azure") {
      let body = {
        gte: value[0],
        lte: value[1],
        subscription_name: [subACCName],
      };
      fetchDataAzure(body)
        .then((res) => {
          return res.json();
        })
        .then((data) => setRes(data));
    } else {
      let body = {
        gte: value[0],
        lte: value[1],
        account_id: subscId,
        account_name: subsIndexName,
      };
      fetchDataAWS(body)
        .then((res) => {
          return res.json();
        })
        .then((data) => setRes(data));
    }
  }, [cloud, value, subsIndexName, subscId]);

  async function fetchDataAzure(body: any) {
    return await fetch(`${finopsServerBaseUrl}/AzureFinopsDashboardData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async function fetchDataAWS(body: any) {
    return await fetch(`${finopsServerBaseUrl}/awsFinopsDashboardData`, {
      // return await fetch(`${localHostBaseUrl}/awsFinopsDashboardData`, {
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
      chartOrder = { AWS: awsData, Azure: graphFormat?.chartOrder?.Azure };
    }
    if (cloud == "Azure") {
      let azureData = graphFormat?.chartOrder?.Azure;
      delete azureData?.[title];
      chartOrder = { Azure: azureData, AWS: graphFormat?.chartOrder?.AWS };
    }
    let data = { ...graphFormat, chartOrder: chartOrder };
    await unpinGraphAPI(graphFormat?.id, data).then(getGraphFormat);
  }

  async function pinGraph(title: any) {
    let chartOrder;
    if (cloud == "AWS") {
      let awsData: any = graphFormat?.chartOrder?.AWS;
      awsData[title] = true;
      chartOrder = { AWS: awsData, Azure: graphFormat?.chartOrder?.Azure };
    }
    if (cloud == "Azure") {
      let azureData = graphFormat?.chartOrder?.Azure;
      azureData[title] = true;
      chartOrder = { Azure: azureData, AWS: graphFormat?.chartOrder?.AWS };
    }
    let data = { ...graphFormat, chartOrder: chartOrder };
    await unpinGraphAPI(graphFormat?.id, data).then(getGraphFormat);
  }

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
            <label className="text-lg">
              {cloud == "Azure"
                ? "Select Subscription Name"
                : "Select Account Name"}{" "}
              :{" "}
            </label>
            {/* )} */}
            {/* <label className="text-lg ">Select Id : </label> */}
            <select
              className="block w-full py-2 px-4 border hover:bg-gray-50 focus:bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => handleSubNameChange(e)}
              value={subACCName}
            >
              {/* subscription id or account id */}
              <option>Select Name</option>
              {subData &&
                subData.map((e: any, i: any) => (
                  <option key={i} value={e.subsAccName}>
                    {e.subsAccName}
                  </option>
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
        {/* <div className="flex space-x-4 justify-content-between">
          <div className="card !w-1/2">
            <span>
              {cloud == "Azure"
                ? "Total Subscription Cost"
                : "Total Account Cost"}{" "}
              -{" "}
            </span>
            <span>
              {cloud == "Azure" ? "₹" : "$"}{" "}
              {res && res.Metric ? res.Metric[0]?.value : ""}{" "}
            </span>
          </div>
          <div className="card !w-1/2">
            <b>
              <span>Subscription Id - </span>
            </b>
            <span>{subscId}</span>
          </div>
        </div> */}
        <div className="flex flex-wrap gap-4">
          {/* Conditional rendering based on titleValueCount */}
          <div className="card w-full md:w-1/2">
            <b>Subscription Id : </b>
            <span>{subscId}</span>
          </div>
          {titleValueCount >= 1 && (
            <div className="card flex w-full md:w-1/2 justify-content-between">
              <div>
                <b>{res.Metric && res.Metric[0] && res.Metric[0].title} : </b>
                <span>
                  {cloud === "Azure" ? "₹" : ""}
                  {res.Metric && res.Metric[0] && res.Metric[0].value}
                </span>
              </div>

              <span className="ml-auto">
                {cloud === "Azure" ? (
                  <button className="" onClick={() => setIsOpen(true)}>
                    <ViewCompactIcon />
                  </button>
                ) : (
                  ""
                )}
              </span>
            </div>
          )}
          {titleValueCount >= 2 && (
            <div className="card w-full md:w-1/2">
              <b>{res.Metric && res.Metric[1] && res.Metric[1].title} : </b>
              <span>
                {cloud === "Azure" ? "₹" : "$"}
                {res.Metric && res.Metric[1] && res.Metric[1].value}
              </span>
            </div>
          )}

          {titleValueCount === 3 && (
            <div className="card w-full md:w-1/2">
              <b>{res.Metric && res.Metric[2] && res.Metric[2].title} : </b>
              <span>
                {cloud === "Azure" ? "₹" : "$"}
                {res.Metric && res.Metric[2] && res.Metric[2].value}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 h-auto flex flex-wrap gap-4">
          {res &&
            res.Graph?.map((e: any, i: any) => {
              if (
                e &&
                e.PieChart &&
                e.PieChart.data &&
                Array.isArray(e.PieChart.data) &&
                graphFormat &&
                graphFormat?.chartOrder?.[cloud]?.[e.PieChart.title]
              ) {
                return (
                  <div key={i} className="card">
                    <span
                      className="flex justify-end cursor-pointer"
                      onClick={() => unpinGraph(e.PieChart.title)}
                    >
                      <BsPinAngleFill />
                    </span>
                    <PieChartComponent id={i} data={e.PieChart} />
                  </div>
                );
              } else if (
                e &&
                e.LineChart &&
                e.LineChart.data &&
                Array.isArray(e.LineChart.data) &&
                graphFormat &&
                graphFormat?.chartOrder?.[cloud]?.[e.LineChart.title]
              ) {
                return (
                  <div
                    key={i}
                    className={
                      e.LineChart.series?.data?.length >= 20
                        ? "card !min-w-full"
                        : "card"
                    }
                  >
                    <span
                      className="flex justify-end cursor-pointer"
                      onClick={() => unpinGraph(e.LineChart.title)}
                    >
                      <BsPinAngleFill />
                    </span>
                    <LineChartComponent id={i} data={e.LineChart} />
                  </div>
                );
              } else if (
                e &&
                e.BarGraph &&
                e.BarGraph.data &&
                Array.isArray(e.BarGraph.data) &&
                graphFormat &&
                graphFormat?.chartOrder?.[cloud]?.[e.BarGraph.title]
              ) {
                return (
                  <div
                    key={i}
                    className={
                      e.BarGraph.data.length >= 8 ? "card !min-w-full" : "card"
                    }
                  >
                    <span
                      className="flex justify-end cursor-pointer"
                      onClick={() => unpinGraph(e.BarGraph.title)}
                    >
                      <BsPinAngleFill />
                    </span>
                    <BarGraph id={i} date={value} data={e.BarGraph} />
                  </div>
                );
              }
            })}

          {res &&
            res.Graph?.map((e: any, i: any) => {
              if (
                e &&
                e.PieChart &&
                e.PieChart.data &&
                Array.isArray(e.PieChart.data) &&
                graphFormat &&
                !graphFormat.chartOrder?.[cloud]?.[e.PieChart.title]
              ) {
                return (
                  <div key={i} className="card">
                    <span
                      className="flex justify-end cursor-pointer"
                      onClick={() => pinGraph(e.PieChart.title)}
                    >
                      <BsPinAngle />
                    </span>
                    <PieChartComponent id={i} data={e.PieChart} />
                  </div>
                );
              } else if (
                e &&
                e.LineChart &&
                e.LineChart.data &&
                Array.isArray(e.LineChart.data) &&
                graphFormat &&
                !graphFormat.chartOrder?.[cloud]?.[e.LineChart.title]
              ) {
                return (
                  <div
                    key={i}
                    className={
                      e.LineChart.series?.data?.length >= 10
                        ? "card !min-w-full"
                        : "card"
                    }
                  >
                    <span
                      className="flex justify-end cursor-pointer"
                      onClick={() => pinGraph(e.LineChart.title)}
                    >
                      <BsPinAngle />
                    </span>
                    <LineChartComponent id={i} data={e.LineChart} />
                  </div>
                );
              } else if (
                e &&
                e.BarGraph &&
                e.BarGraph.data &&
                Array.isArray(e.BarGraph.data) &&
                graphFormat &&
                !graphFormat.chartOrder?.[cloud]?.[e.BarGraph.title]
              ) {
                return (
                  <div
                    key={i}
                    className={
                      e.BarGraph.data.length >= 8 ? "card !min-w-full" : "card"
                    }
                  >
                    <span
                      className="flex justify-end cursor-pointer"
                      onClick={() => pinGraph(e.BarGraph.title)}
                    >
                      <BsPinAngle />
                    </span>
                    <BarGraph id={i} date={value} data={e.BarGraph} />
                  </div>
                );
              }
            })}

          {res &&
            res.Table &&
            res.Table?.map((e: any, i: any) => {
              return (
                <>
                  <div key={i} className="card">
                    <Table data={e} />
                  </div>
                </>
              );
            })}

          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-red-800 px-4 py-2 flex items-center justify-between">
                    <h3 className="text-xl text-white">
                      Service wise cost for Each Subscription
                    </h3>
                    <button
                      className="p-2 text-xl text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-center text-gray-800">
                        <thead className="text-xs uppercase bg-gray-200">
                          <tr>
                            <th scope="col" className="px-2 py-3">
                              Month
                            </th>
                            <th scope="col" className="px-2 py-3">
                              Application Name
                            </th>
                            <th scope="col" className="px-2 py-3">
                              Cost (₹)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {res &&
                            res.Metric[1].Table[0].data.map(
                              (item: any, index: number) => (
                                <tr
                                  key={index}
                                  className="bg-white border-b text-center"
                                >
                                  <td className="px-2 py-3">{item[0][1]}</td>
                                  <td className="px-2 py-3">{item[1][1]}</td>
                                  <td className="px-2 py-3">{item[2][1]}</td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinOps;
