import Table from "@/pages/Components/Charts/Table";
import React, { useEffect, useState } from "react";
import PieChartComponent from "../../Components/Charts/PieChartDummy";
import { TabPanel, TabContext } from "@mui/lab";
import { Card, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { GetTagedAndUnTagedCostResourceType } from "@/pages/api/FinopsApi/GetTagedAndUnTagedCostResourceType";
import TableWithDropdown from "@/pages/Components/Charts/TableWithDropdown";
import TableWithSecondDropdown from "@/pages/Components/Charts/TableWithSecondDropdown";
const TagCompliance = () => {
  const [resp, setRes] = useState<any>(null);
  const [loader, setLoader] = useState<any>(false);
  const router = useRouter();
  const { report, cloud }: any = router.query;
  const [cloudValue, setCloudValue] = useState("aws");
  const CloudChange = (event: React.SyntheticEvent, newValue: any) => {
    setCloudValue(newValue);
  };
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    setLoader(true);
    GetTagedAndUnTagedCostResourceType().then((data: any) => {
      setRes(data.data);
      setLoader(false);
      if (data && data?.status != 200) {
        //   console.log(Object.keys(data.data).length, data.status)
        setStatus(data.status);
      } else if (Object.keys(data.data).length === 0 && data?.status == 200) {
        setStatus("404");
      }
    });
  }, []);

  // console.log("response", resp);
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
                )}
              </Tabs>
            </div>
            <div className="w-full">
              <TabPanel value="aws">
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
                                {e.value && e.value.aws && e.value.aws}
                              </div>
                              <div className="text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl sm:text-md xs:text-sm text-slate-500">
                                {e.title && e.title} ($)
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {resp && resp.AWS && Object.keys(resp.AWS).length > 0 && (
                      <>
                        <div className="pl-4 w-full">
                          <div className="bg-white p-4 mb-4 rounded-lg">
                            <TableWithDropdown
                              cloud={"AWS"}
                              type={"firstDropdown"}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {resp && resp.AWS && Object.keys(resp.AWS).length > 0 && (
                      <>
                        <div className="pl-4 w-full">
                          <div className="bg-white p-4 mb-4 rounded-lg">
                            <TableWithSecondDropdown
                              cloud={"AWS"}
                              type={"secondDropdown"}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Second Column */}
                  <div
                    className="w-[50%] flex flex-wrap"
                    style={{ height: "max-content" }}
                  >
                    {resp &&
                      resp.AWS &&
                      resp.AWS.Table &&
                      resp.AWS.Table?.map((e: any, i: any) => {
                        return (
                          <>
                            <div key={i} className="pl-4 mb-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                <Table data={e} />
                              </div>
                            </div>
                          </>
                        );
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
                                {e.value && e.value.azure && e.value.azure}
                              </div>
                              <div className="text-base md:text-lg lg:text-base xl:text-lg 2xl:text-xl sm:text-md xs:text-sm text-slate-500">
                                {/* <div className="text-lg text-slate-500"> */}
                                {e.title && e.title}
                                {" (₹)"}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {resp &&
                      resp.AZURE &&
                      Object.keys(resp.AZURE).length > 0 && (
                        <>
                          <div className="pl-4 mb-4 w-full">
                            <div className="bg-white p-4 rounded-lg">
                              <TableWithDropdown
                                cloud={"Azure"}
                                type={"firstDropdown"}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    {resp &&
                      resp.AZURE &&
                      Object.keys(resp.AZURE).length > 0 && (
                        <div className="pl-4 mb-4 w-full">
                          <div className="bg-white p-4 rounded-lg">
                            <TableWithSecondDropdown
                              cloud={"Azure"}
                              type={"secondDropdown"}
                            />
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Second Column */}
                  <div
                    className="w-[50%] flex flex-wrap"
                    style={{ height: "max-content" }}
                  >
                    {resp &&
                      resp.AZURE &&
                      resp.AZURE.Table &&
                      resp.AZURE.Table?.map((e: any, i: any) => {
                        return (
                          <>
                            <div key={i} className="pl-4 mb-4 w-full">
                              <div className="bg-white p-4 rounded-lg">
                                {/* Third Chart */}
                                <Table data={e} />
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              </TabPanel>
            </div>
          </div>
        </TabContext>
      )}
    </>
  );
};

export default TagCompliance;
