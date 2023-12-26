import BarGraph from "@/pages/Components/Charts/BarChart";
import LineChartComponent from "@/pages/Components/Charts/LineChart";
import PieChartComponent from "../../Components/Charts/PieChart";
import { TabPanel, TabContext } from "@mui/lab";
import { Card, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { useAppContext } from "@/pages/Components/AppContext";
import { allInOneAwsAzureCloud } from "@/pages/api/FinopsApi/getAWSNavibationDashboard";
import Table from "@/pages/Components/Charts/Table";
import { useRouter } from "next/router";
import NTable from "@/pages/Components/Charts/NestedTable";
import { finopsServerBaseUrl } from "@/const";
const CostSummary = () => {
  const { time, toggleTime } = useAppContext();
  const { timeEnd, toggleTimeEnd } = useAppContext();

  const [timePeriod, setTimePeriod] = React.useState<any>([
    new Date(time),
    new Date(timeEnd),
  ]);

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
    {
      label: "Current FY",
      value: [
        new Date(
          moment()
            .startOf("year")
            .month(3)
            .date(1)
            .format("YYYY-MM-DDTHH:mm:ss")
        ),
        new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
      ],
      placement: "left",
    },
  ];
  const { afterToday }: any = DateRangePicker;
  const CloudChange = (event: React.SyntheticEvent, newValue: any) => {
    setCloudValue(newValue);
  };
  const [resp, setRes] = useState<any>(null);
  const [loader, setLoader] = useState<any>(false);
  const [cloudGatewayData, setCloudGatewayData] = useState<any>();
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    setLoader(true);
    allInOneAwsAzureCloud(
      timePeriod[0].toISOString(),
      timePeriod[1].toISOString()
    ).then((data: any) => {
      setRes(data);
      if(data && data.AWS && Object.keys(data.AWS).length == 0){
        setCloudValue('azure') 
      }
      setLoader(false);
      if (data && data?.status != 200) {
        //   console.log(Object.keys(data.data).length, data.status)
        setStatus(data.status);
      } else if (Object.keys(data.data).length === 0 && data?.status == 200) {
        setStatus("404");
      }
    });
  }, [timePeriod[0], timePeriod[1]]);
  // useEffect(() => {
  //   setLoader(true);
  //   async function getData() {
  //     fetchGatewayChargeData().then((res) => setCloudGatewayData(res));
  //   }
  //   getData().then(() => setLoader(false));
  // }, []);
  // async function fetchGatewayChargeData() {
  //   let resData: any;
  //   try {
  //     resData = await fetch(
  //       `${finopsServerBaseUrl}/AWSAndAzureDashBordChartsAPIGatewayCharge?role=ADMIN`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     resData = await resData.json();
  //   } catch {
  //     resData = "";
  //   }
  //   return resData;
  // }
  // resp && console.log("response", resp);
  return (
    <>
      {loader && <div className="circle-loader"></div>}
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
                {resp && resp.AWS && Object.keys(resp.AWS).length > 0 && (
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
                )}
                {resp && resp.AZURE && Object.keys(resp.AZURE).length > 0 && (
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
                )}
                {resp && resp.ClOUD && Object.keys(resp.ClOUD).length > 0 && (
                  <Tab
                    value={"CloudGateway"}
                    label={
                      <div className="flex flex-col items-center">
                        <img
                          src="/abgCloud (1).png"
                          alt="Cloud Gateway Logo"
                          style={{ width: "80px", height: "70px" }}
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
                )}
              </Tabs>
            </div>
            <div className="w-full">
              <TabPanel value="aws">
                {/* <div className="flex h-11 max-w-[25rem] min-w-[25rem] bg-white mb-4 rounded-xl ml-auto justify-center  pl-4 pb-4">
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
                </div> */}
                <div
                  className="w-full flex flex-wrap overflow-hidden"
                  style={{ height: "max-content" }}
                >
                  <div
                    className="w-[50%] flex flex-wrap"
                    style={{ height: "max-content" }}
                  >
                    <div className="flex flex-wrap min-h-[10rem] w-[100%] pl-4 pb-4 justify-between">
                      {resp &&
                        resp.AWS &&
                        resp.AWS.Metric &&
                        resp.AWS.Metric?.map((e: any, i: any) => (
                          <div
                            key={i}
                            className="pl-4 bg-white rounded-lg mb-4 w-[48%] h-full"
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="text-4xl md:text-xl lg:text-4xl sm:text-lg xs:text-md py-1 font-bold text-slate-500">
                                {e.value.aws}
                              </div>
                              <div className="text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl sm:text-md xs:text-sm text-slate-500">
                                {e.title} ($)
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {resp &&
                      resp.AWS &&
                      resp.AWS.Table &&
                      resp.AWS.Table?.map((e: any, i: any) => {
                        return (
                          <>
                            <div key={i} className="pl-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                {/* Third Chart */}
                                <Table data={e} />
                              </div>
                            </div>
                            
                          </>
                        );
                      })}
                  </div>

                  {/* Second Column */}
                  <div
                    className="w-[50%] flex flex-wrap gap-4"
                    style={{ height: "max-content" }}
                  >
                    <div className="flex h-11  w-full min-w-[25rem] ml-4 bg-white pl-4 rounded-xl  justify-center  pl-4 pb-4">
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
                    {resp &&
                      resp.AWS &&
                      resp.AWS.Graph &&
                      resp.AWS.Graph?.map((e: any, i: any) => {
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

                    {resp &&
                      resp.AWS &&
                      resp.AWS.Graph &&
                      resp.AWS.Graph?.map((e: any, i: any) => {
                        if (
                          e &&
                          e.LineChart &&
                          e.LineChart.data &&
                          Array.isArray(e.LineChart.data)
                        ) {
                          return (
                            <div key={i} className="pl-4 w-full">
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
                <div
                  className="w-full flex flex-wrap overflow-hidden"
                  style={{ height: "max-content" }}
                >
                  <div
                    className="w-[50%] flex flex-wrap"
                    style={{ height: "max-content" }}
                  >
                    <div className="flex flex-wrap min-h-[10rem] w-[100%] pl-4 pb-4 justify-between">
                      {resp &&
                        resp.AZURE &&
                        resp.AZURE.Metric &&
                        resp.AZURE.Metric?.map((e: any, i: any) => (
                          <div
                            key={i}
                            className="pl-4 bg-white rounded-lg mb-4 w-[48%] h-full"
                          >
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="text-4xl md:text-xl lg:text-4xl sm:text-lg xs:text-md py-1 font-bold text-slate-500">
                                {/* <div className="text-4xl py-1 font-bold text-slate-500"> */}
                                {e.value.azure}
                              </div>
                              <div className="text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl sm:text-md xs:text-sm text-slate-500">
                                {/* <div className="text-lg text-slate-500"> */}
                                {e.title}
                                {" (₹)"}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {resp &&
                      resp.AZURE &&
                      resp.AZURE.Table &&
                      resp.AZURE.Table?.map((e: any, i: any) => {
                        return (
                          <>
                            <div key={i} className="pl-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                {/* Third Chart */}
                                <Table data={e} />
                              </div>
                            </div>
                            
                          </>
                        );
                      })}
                  </div>

                  {/* Second Column */}
                  <div
                    className="w-[50%] flex flex-wrap gap-4"
                    style={{ height: "max-content" }}
                  >
                    <div className="flex h-11  w-full min-w-[25rem] ml-4 bg-white pl-4 rounded-xl  justify-center  pl-4 pb-4">
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
                    {resp &&
                      resp.AZURE &&
                      resp.AZURE.Graph &&
                      resp.AZURE.Graph?.map((e: any, i: any) => {
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
                    {resp &&
                      resp.AZURE &&
                      resp.AZURE.Graph &&
                      resp.AZURE.Graph?.map((e: any, i: any) => {
                        if (
                          e &&
                          e.LineChart &&
                          e.LineChart.data &&
                          Array.isArray(e.LineChart.data)
                        ) {
                          return (
                            <div key={i} className="pl-4 w-full">
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
                {/* <div className="w-full flex flex-wrap"> */}
                {/* <div className="pl-4 mb-4 w-[50%]">
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
                  </div> */}
                {/* </div> */}
              </TabPanel>
              <TabPanel value="CloudGateway">
                {/* <div className="w-full h-[52vh] flex justify-center items-center text-4xl font-sans "> */}
                <div
                  className="w-full flex flex-wrap overflow-hidden"
                  style={{ height: "max-content" }}
                >
                  <div className="flex flex-wrap min-h-[2rem] w-[100%] pl-4 pb-4 justify-between">
                    {resp &&
                      resp.ClOUD &&
                      resp.ClOUD.Metric &&
                      resp.ClOUD.Metric?.map((e: any, i: any) => (
                        <div
                          key={i}
                          className="pl-4 bg-white rounded-lg mb-4 w-full h-full"
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="text-4xl md:text-3xl lg:text-4xl sm:text-xl xs:text-md py-1 font-bold text-slate-500">
                              {/* <div className="text-4xl py-1 font-bold text-slate-500"> */}
                              {e.value}
                            </div>
                            <div className="text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl sm:text-md xs:text-sm text-slate-500">
                              {/* <div className="text-lg text-slate-500"> */}
                              {e.title}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {resp &&
                    resp.ClOUD &&
                    resp.ClOUD.Table &&
                    resp.ClOUD.Table?.map((e: any, i: any) => {
                      return (
                        <>
                          <div key={i} className="pl-4 pb-4 w-full">
                            <div className="bg-white p-4 rounded-lg">
                              {/* Third Chart */}
                              <NTable data={e} />
                            </div>
                          </div>
                        </>
                      );
                    })}
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
