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
    router.push(
      `/page/FinOps?report=TagCompliance&cloud=${newValue}`,
      undefined,
      { shallow: true }
    );
    setCloudValue(newValue);
  };
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    if (
      resp &&
      resp.AWS &&
      Object.keys(resp.AWS).length > 0 &&
      Object.keys(resp.AZURE).length == 0
    ) {
      // setCloudValue("aws");
      router.push(`/page/FinOps?report=TagCompliance&cloud=aws`, undefined, {
        shallow: true,
      });
    } else if (
      resp &&
      resp.AZURE &&
      Object.keys(resp.AZURE).length > 0 &&
      Object.keys(resp.AWS).length == 0
    ) {
      // setCloudValue("azure");
      router.push(`/page/FinOps?report=TagCompliance&cloud=azure`, undefined, {
        shallow: true,
      });
    } else if (
      resp &&
      resp.AZURE &&
      Object.keys(resp.AZURE).length > 0 &&
      resp.AWS &&
      Object.keys(resp.AWS).length > 0
    ) {
      // setCloudValue("aws");
      router.push(`/page/FinOps?report=TagCompliance&cloud=aws`, undefined, {
        shallow: true,
      });
    }
  }, [resp]);
  useEffect(() => {
    setLoader(true);
    GetTagedAndUnTagedCostResourceType().then((data: any) => {
      setRes(data.data);
      if (
        data.data &&
        data.data.AWS &&
        Object.keys(data.data.AWS).length == 0
      ) {
        setCloudValue("azure");
      }
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
                            className="pl-4 pr-4 pt-2 bg-white rounded-lg mb-4 w-[48%] h-full"
                            style={{
                              borderRadius: "16px",
                              border: "0.5px solid rgba(0, 0, 0, 0.6)",
                              background:
                                "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                              fontFamily: `"Oxygen",sans-serif`,
                            }}
                          >
                            <div className="flex flex-col items-center h-full space-y-6">
                              <div className="w-full justify-between ">
                                <div className="flex justify-between w-full items-center">
                                  <div className="">
                                    <p
                                      className=""
                                      style={{
                                        color: "#000",
                                        fontSize: "17px",
                                        fontStyle: "normal",
                                        fontWeight: 700,
                                        lineHeight: "28px",
                                      }}
                                    >
                                      {e.title} 
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="mt-1"
                                  style={{
                                    borderTop: "2px solid #7B62CA",
                                    width: "100%",
                                    background: "#7B62CA",
                                  }}
                                ></div>
                              </div>
                              <div className="text-3xl md:text-xl lg:text-3xl sm:text-lg xs:text-md py-1 font-bold text-slate-500">
                              {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(e.value.aws)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    {resp && resp.AWS && Object.keys(resp.AWS).length > 0 && (
                      <>
                        <div className="pl-4 w-full">
                          <div
                            className="bg-white p-4 mb-4 rounded-lg"
                            style={{
                              borderRadius: "16px",
                              border: "0.5px solid rgba(0, 0, 0, 0.6)",
                              fontFamily: `"Oxygen",sans-serif`,
                            }}
                          >
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
                          <div
                            className="bg-white p-4 mb-4 rounded-lg"
                            style={{
                              borderRadius: "16px",
                              border: "0.5px solid rgba(0, 0, 0, 0.6)",
                              fontFamily: `"Oxygen",sans-serif`,
                            }}
                          >
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
                              <div
                                className="bg-white p-4 rounded-lg"
                                style={{
                                  borderRadius: "16px",
                                  border: "0.5px solid rgba(0, 0, 0, 0.6)",
                                  fontFamily: `"Oxygen",sans-serif`,
                                }}
                              >
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
                            className="pl-4 pr-4 pt-2 bg-white rounded-lg mb-4 w-[48%] h-full"
                            style={{
                              borderRadius: "16px",
                              border: "0.5px solid rgba(0, 0, 0, 0.6)",
                              background:
                                "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                              fontFamily: `"Oxygen",sans-serif`,
                            }}
                          >
                            <div className="flex flex-col items-center h-full space-y-6">
                              <div className="w-full justify-between ">
                                <div className="flex justify-between w-full items-center">
                                  <div className="">
                                    <p
                                      className=""
                                      style={{
                                        color: "#000",
                                        fontSize: "17px",
                                        fontStyle: "normal",
                                        fontWeight: 700,
                                        lineHeight: "28px",
                                      }}
                                    >
                                      {e.title} 
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="mt-1"
                                  style={{
                                    borderTop: "2px solid #7B62CA",
                                    width: "100%",
                                    background: "#7B62CA",
                                  }}
                                ></div>
                              </div>
                              <div className="text-3xl md:text-xl lg:text-3xl sm:text-lg xs:text-md py-1 font-bold text-slate-500">
                              {new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(e.value.azure)}
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
                            <div
                              className="bg-white p-4 rounded-lg"
                              style={{
                                borderRadius: "16px",
                                border: "0.5px solid rgba(0, 0, 0, 0.6)",
                                fontFamily: `"Oxygen",sans-serif`,
                              }}
                            >
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
                          <div
                            className="bg-white p-4 rounded-lg"
                            style={{
                              borderRadius: "16px",
                              border: "0.5px solid rgba(0, 0, 0, 0.6)",
                              fontFamily: `"Oxygen",sans-serif`,
                            }}
                          >
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
                              <div
                                className="bg-white p-4 rounded-lg"
                                style={{
                                  borderRadius: "16px",
                                  border: "0.5px solid rgba(0, 0, 0, 0.6)",
                                  fontFamily: `"Oxygen",sans-serif`,
                                }}
                              >
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
