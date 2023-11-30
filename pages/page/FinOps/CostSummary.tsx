import BarGraph from "@/pages/Components/Charts/BarChart";
import LineChartComponent from "@/pages/Components/Charts/LineChart";
import PieChartComponent from "../../Components/Charts/PieChart";
import { TabPanel, TabContext } from "@mui/lab";
import { Card, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { useAppContext } from "@/pages/Components/AppContext";
import { getAWSNavigationDashboard } from "@/pages/api/FinopsApi/getAWSNavibationDashboard";
import Table from "@/pages/Components/Charts/Table";
import { useRouter } from "next/router";
const CostSummary = () => {
  const { time, toggleTime } = useAppContext();
  const { timeEnd, toggleTimeEnd } = useAppContext();

  const [timePeriod, setTimePeriod] = React.useState<any>([
    new Date(time),
    new Date(timeEnd),
  ]);
  const dummyData1: any = {
    title: "Cost By Month",
    data: [
      {
        name: "Unblended Cost",
        data: [
          ["Jun", 2687.2],
          ["Jul", 2287.2],
          ["Aug", 987.2],
          ["Sep", 3083.57],
          ["Oct", 1014.77],
          ["Nov", 1287.2],
        ],
      },
    ],
    xAxis: "Month",
    yAxis: "cost($)",
  };
  const dummyData2: any = {
    title: "Cost By Service",
    type: "column",
    stacking: "false",
    categories: [
      "47239",
      "749203",
      "18209",
      "89232",
      "72893",
      "12891",
      "732901",
      "74293",
    ],
    data: [
      {
        name: "",
        data: [506, 132, 232, 234, 23, 42, 34, 323],
      },
    ],
    xAxis: "Account ID",
    yAxis: "Total Cost($)",
  };
  const dummyData3: any = {
    title: "Cost By Region",
    type: "column",
    stacking: "false",
    categories: [
      "EastUS",
      "CentralUS",
      "WestUS",
      "India",
      "SouthUS",
      "AllRegions",
    ],
    data: [
      {
        name: "",
        data: [15, 21, 32, 42, 5, 23],
      },
    ],
    xAxis: "Region",
    yAxis: "Cost($)",
  };
  const dummyData4: any = {
    title: "Cost Distribution",
    data: [
      ["running", 125],
      ["terminated", 10],
      ["stopped", 3],
      ["shutting-down", 2],
    ],
  };
  const dummyData5: any = {
    title: "Cost By Month",
    data: [
      {
        name: "Unblended Cost",
        data: [
          ["Jun", 687.2],
          ["Jul", 287.2],
          ["Aug", 87.2],
          ["Sep", 83.57],
          ["Oct", 14.77],
          ["Nov", 287.2],
        ],
      },
    ],
    xAxis: "Month",
    yAxis: "cost($)",
  };
  const dummyData6: any = {
    title: "Cost By Service",
    type: "column",
    stacking: "false",
    categories: [
      "47239",
      "749203",
      "18209",
      "89232",
      "72893",
      "12891",
      "732901",
      "74293",
    ],
    data: [
      {
        name: "",
        data: [1506, 1132, 1232, 2134, 123, 412, 314, 1323],
      },
    ],
    xAxis: "Account ID",
    yAxis: "Total Cost($)",
  };
  const dummyData7: any = {
    title: "Cost By Region",
    type: "column",
    stacking: "false",
    categories: [
      "EastUS",
      "CentralUS",
      "WestUS",
      "India",
      "SouthUS",
      "AllRegions",
    ],
    data: [
      {
        name: "",
        data: [215, 221, 232, 422, 52, 223],
      },
    ],
    xAxis: "Region",
    yAxis: "Cost($)",
  };
  const dummyData8: any = {
    title: "Cost Distribution",
    data: [
      ["running", 1525],
      ["terminated", 210],
      ["stopped", 36],
      ["shutting-down", 112],
    ],
  };
  const router = useRouter();
  const { report, cloud }: any = router.query;
  const [cloudValue, setCloudValue] = useState(cloud || "CloudGateway");
  const predefinedRanges: any = [
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
    {
      label: "Last 120 days",

      value: [
        new Date(moment().subtract(120, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },
    {
      label: "Last 180 days",

      value: [
        new Date(moment().subtract(180, "day").format("YYYY-MM-DDTHH:mm:ss")),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],

      placement: "left",
    },
  ];
  const { afterToday }: any = DateRangePicker;
  const CloudChange = (event: React.SyntheticEvent, newValue: any) => {
    setCloudValue(newValue);
  };
  const [res, setRes] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    getAWSNavigationDashboard(
      timePeriod[0].toISOString(),
      timePeriod[1].toISOString()
    ).then((data: any) => {
      setRes(data.data);
      if (data && data?.status != 200) {
        //   console.log(Object.keys(data.data).length, data.status)
        setStatus(data.status);
      } else if (Object.keys(data.data).length === 0 && data?.status == 200) {
        setStatus("404");
      }
    });
  }, [timePeriod[0], timePeriod[1]]);

  res && console.log("response", res.Metric);
  return (
    <>
      {true && (
        <TabContext value={cloudValue}>
          <div className="cloud-tabs flex w-full h-full">
            <div className=" mb-4 rounded-lg">
              <Tabs
                value={cloudValue}
                onChange={CloudChange}
                centered
                orientation="vertical"
                className=""
              >
                <Tab
                  value={"aws"}
                  label={
                    <div className="flex flex-col items-center">
                      <img
                        src="/aws.png"
                        alt="AWS Logo"
                        style={{ width: "60px", height: "40px" }}
                        className=""
                      />
                      {/* AWS */}
                    </div>
                  }
                  className={`${
                    cloudValue === "aws" ? "shadow-xl border-gray-500" : ""
                  } bg-white border border-gray-300 border-solid !text-black !rounded-lg !mb-4 !max-h-[7rem] !h-[8rem] !w-[8rem]`}
                />
                <Tab
                  value={"azure"}
                  label={
                    <div className="flex flex-col items-center">
                      <img
                        src="/azure.png"
                        alt="Azure Logo"
                        style={{ width: "50px", height: "40px" }}
                        className=""
                      />
                      {/* Azure */}
                    </div>
                  }
                  className={`${
                    cloudValue === "azure" ? "shadow-xl border-gray-500" : ""
                  } bg-white border border-gray-300 border-solid !text-black !rounded-lg !mb-4 !max-h-[7rem] !h-[8rem] !w-[8rem]`}
                />
                <Tab
                  value={"CloudGateway"}
                  label={
                    <div className="flex flex-col items-center">
                      <img
                        src="/cloud.png"
                        alt="Cloud Gateway Logo"
                        style={{ width: "60px", height: "50px" }}
                        className=""
                      />
                      {/* Cloud gateway & Managed services */}
                    </div>
                  }
                  className={`${
                    cloudValue === "CloudGateway"
                      ? "shadow-xl border-gray-500"
                      : ""
                  } bg-white border border-gray-300 border-solid !text-black !rounded-lg !mb-4 !max-h-[7rem] !h-[8rem] !w-[8rem]`}
                />
              </Tabs>
            </div>
            <div className="w-full">
              <TabPanel value="aws">
                <div className="flex h-11 max-w-[25rem] min-w-[25rem] bg-white mb-4 rounded-xl ml-auto justify-center  pl-4 pb-4">
                  <div className="justify-center py-3 px-2 text-md text-gray-600">
                    Select Date Range :
                  </div>
                  <div className="px-2 py-1">
                    <DateRangePicker
                      placement="auto"
                      value={timePeriod}
                      onChange={setTimePeriod}
                      ranges={predefinedRanges}
                      // showOneCalendar
                      style={{ width: "100%" }}
                      shouldDisableDate={afterToday()}
                      placeholder="Select Date Range"
                      format="yyyy-MM-dd"
                      className="hover:bg-gray-50 focus:bg-gray-50"
                    />
                  </div>{" "}
                </div>
                <div
                  className="w-full flex flex-wrap overflow-hidden"
                  style={{ height: "max-content" }}
                >
                  <div
                    className="w-[50%] flex flex-wrap"
                    style={{ height: "max-content" }}
                  >
                    <div className="flex flex-wrap min-h-[10rem] w-[100%] pl-4 pb-4 justify-between">
                      {res &&
                        res.Metric?.map((e: any, i: any) => (
                          <div
                            key={i}
                            className="pl-4 bg-white rounded-lg mb-4 w-[48%] h-full"
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="text-4xl py-1 font-bold text-slate-500">
                                {e.value.aws}
                              </div>
                              <div className="text-lg text-slate-500">
                                {e.title}
                                {" ($)"}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {res &&
                      res.Table?.map((e: any, i: any) => {
                        return (
                          <>
                            <div key={i} className="pl-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                {/* Third Chart */}
                                <Table data={e} />
                              </div>
                            </div>
                            ;
                          </>
                        );
                      })}
                  </div>

                  {/* Second Column */}
                  <div
                    className="w-[50%] flex flex-wrap gap-4"
                    style={{ height: "max-content" }}
                  >
                    {res &&
                      res.Graph?.map((e: any, i: any) => {
                        if (
                          e &&
                          e.BarGraph &&
                          e.BarGraph.data &&
                          Array.isArray(e.BarGraph.data)
                        ) {
                          return (
                            <div key={i} className="pl-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                <BarGraph
                                  // id={"new2"}
                                  // date={""}
                                  height={260}
                                  data={e.BarGraph}
                                  legendEnabled={false}
                                />
                              </div>
                            </div>
                          );
                        }
                      })}
                    {/* First Chart */}

                    {/* Second Chart */}
                    {res &&
                      res.Graph?.map((e: any, i: any) => {
                        if (
                          e &&
                          e.LineChart &&
                          e.LineChart.data &&
                          Array.isArray(e.LineChart.data)
                        ) {
                          return (
                            <div  key={i} className="pl-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                <LineChartComponent
                                  // id={i}
                                  data={e.LineChart}
                                  height={260}
                                  legendEnabled={false}
                                />
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="azure">
                <div className="w-full flex flex-wrap">
                  <div className="pl-4 mb-4 w-[50%]">
                    <div className="bg-white p-4 rounded-lg h-full">
                      <LineChartComponent id={"new5"} data={dummyData5} />
                    </div>
                  </div>
                  <div className="pl-4 mb-4 w-[50%]">
                    <div className="bg-white p-4 rounded-lg h-full">
                      <BarGraph id={"new6"} date={""} data={dummyData6} />
                    </div>
                  </div>
                  <div className="pl-4 mb-4 w-[50%]">
                    <div className="bg-white p-4 rounded-lg h-full">
                      <BarGraph id={"new7"} date={""} data={dummyData7} />
                    </div>
                  </div>
                  <div className="pl-4 mb-4 w-[50%]">
                    <div className="bg-white p-4 rounded-lg h-full">
                      <PieChartComponent id={"new8"} data={dummyData8} />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="CloudGateway">
                <div className="w-full h-[52vh] flex justify-center items-center text-4xl font-sans ">
                  COMING SOON
                </div>
              </TabPanel>
            </div>
          </div>
        </TabContext>
      )}
    </>
  );
};

export default CostSummary;
