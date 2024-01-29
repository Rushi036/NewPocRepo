import LineChartComponent from "@/pages/Components/Charts/LineChart";
import Loader from "@/pages/Components/loader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
// import HighchartsVariablePie from "highcharts/modules/variable-pie";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
// import HighchartsExporting from "highcharts/modules/exporting";
// import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import SmallLineChartComponent from "@/pages/Components/Charts/SmallLinechart";
import { getReportsDashboard } from "@/pages/api/FinopsApi/getReports";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrencyData } from "@/pages/api/getCurrency";
import Divider from "@mui/material/Divider";
import TollIcon from "@mui/icons-material/Toll";
const Reports = () => {
  useEffect(() => {
    // HighchartsExporting(Highcharts);
    // HighchartsExportData(Highcharts);
    HighchartsAccessibility(Highcharts);
    // HighchartsVariablePie(Highcharts);
    NoDataToDisplay(Highcharts);
  }, []);
  const [status, setStatus] = useState<any>();
  const [res, setRes] = useState<any>();
  const [currencyData, setCurrencyData] = useState<any>(true);
  const [userRole, setUserRole] = useState<any>(null); //this will populate from the session storage
  useEffect(() => {
    setUserRole(sessionStorage.getItem("userRole"));
    getReportsDashboard().then((data: any) => {
      getCurrencyData().then((res: any) => setCurrencyData(res.data));
      setRes(data.data);
      if (data && data?.status != 200) {
        //   console.log(Object.keys(data.data).length, data.status)
        setStatus(data.status);
      } else if (Object.keys(data.data).length === 0 && data?.status == 200) {
        setStatus("404");
      }
    });
  }, []);

  useEffect(() => {
    if (status == "404") {
      toast.error("No data for the User", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (status == "400") {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [status]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* <div className="text-xl border-b-2  border-slate-400 pb-2 px-4">
        FinOps
      </div> */}

      <div className="flex mt-2">
        <div className="w-[50%] min-h-[120px] h-hit mb-4 ">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={{
              pathname: "/page/FinOps",
              query: { report: "CostDrillDown" },
            }}
          >
            <div
              className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
              style={{
                borderRadius: "16px",
                border: "0.5px solid rgba(0, 0, 0, 0.6)",
                background:
                  "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                fontFamily: `"Oxygen",sans-serif`,
              }}
            >
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
                    Previous Monthly consumption
                  </p>
                </div>
                <div className="mr-4">
                  <TollIcon style={{ fontSize: "40px", color: "#7B62CA" }} />
                </div>
              </div>

              <div
                className=""
                style={{
                  borderTop: "2px solid #7B62CA",
                  width: "100%",
                  background: "#7B62CA",
                }}
              ></div>
              {res && (
                <table>
                  <tbody>
                    <tr>
                      <td
                        className="bg-white"
                        style={{ width: "50px", textAlign: "left" }}
                      >
                        AWS
                      </td>
                      <td
                        className="bg-white mx-1"
                        style={{ width: "10px", textAlign: "center" }}
                      >
                        -
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "100px", textAlign: "right" }}
                      >
                        {currencyData &&
                        currencyData.status &&
                        currencyData.status === "InActive" &&
                        res.Metric &&
                        res.Metric[0] &&
                        res?.Metric[0]?.value
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(res?.Metric[0]?.value?.AWS)
                          : new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(res?.Metric[0]?.value?.AWS)}
                        {/* {res.Metric && res.Metric[0] && res?.Metric[0]?.value
                          ? res?.Metric[0]?.value?.AWS.toLocaleString("en-IN")
                          : ""} */}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="bg-white"
                        style={{ width: "50px", textAlign: "left" }}
                      >
                        Azure
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "10px", textAlign: "center" }}
                      >
                        -
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "100px", textAlign: "right" }}
                      >
                        {res.Metric && res.Metric[0] && res?.Metric[0]?.value
                          ? new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(res?.Metric[0]?.value?.Azure)
                          : ""}
                      </td>
                    </tr>
                    {currencyData &&
                      currencyData.status &&
                      currencyData.status === "Active" && (
                        <tr>
                          <td
                            className="bg-white"
                            style={{ width: "50px", textAlign: "left" }}
                          >
                            Total
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "10px", textAlign: "center" }}
                          >
                            -
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "100px", textAlign: "right" }}
                          >
                            {res.Metric &&
                            res.Metric[0] &&
                            res?.Metric[0]?.value
                              ? new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(
                                  res?.Metric[0]?.value?.Azure +
                                    res?.Metric[0]?.value?.AWS
                                )
                              : ""}
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              )}
            </div>
          </Link>
        </div>

        <div className="w-[50%] min-h-[120px] h-hit flex justify-center items-center mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={{
              pathname: "/page/FinOps",
              query: { report: "CostDrillDown" },
            }}
          >
            <div
              className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
              style={{
                borderRadius: "16px",
                border: "0.5px solid rgba(0, 0, 0, 0.6)",
                background:
                  "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                fontFamily: `"Oxygen",sans-serif`,
              }}
            >
              <div className="w-[4px] h-full absolute left-0 top-0"></div>
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
                    Previous Week consumption
                  </p>
                </div>
                <div className="mr-4">
                  <TollIcon style={{ fontSize: "40px", color: "#7B62CA" }} />
                </div>
              </div>

              <div
                className=""
                style={{
                  borderTop: "2px solid #7B62CA",
                  width: "100%",
                  background: "#7B62CA",
                }}
              ></div>

              {res && (
                <table>
                  <tbody>
                    <tr>
                      <td
                        className="bg-white"
                        style={{ width: "50px", textAlign: "left" }}
                      >
                        AWS
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "10px", textAlign: "center" }}
                      >
                        -
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "100px", textAlign: "right" }}
                      >
                        {currencyData &&
                        currencyData.status &&
                        currencyData.status === "InActive" &&
                        res.Metric &&
                        res.Metric[1] &&
                        res?.Metric[1]?.value
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(res?.Metric[1]?.value?.AWS)
                          : new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(res?.Metric[1]?.value?.AWS)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="bg-white"
                        style={{ width: "50px", textAlign: "left" }}
                      >
                        Azure
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "10px", textAlign: "center" }}
                      >
                        -
                      </td>
                      <td
                        className="bg-white"
                        style={{ width: "100px", textAlign: "right" }}
                      >
                        {res.Metric && res.Metric[1] && res?.Metric[1]?.value
                          ? new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                            }).format(res?.Metric[1]?.value?.Azure)
                          : ""}
                      </td>
                    </tr>
                    {currencyData &&
                      currencyData.status &&
                      currencyData.status === "Active" && (
                        <tr>
                          <td
                            className="bg-white"
                            style={{ width: "50px", textAlign: "left" }}
                          >
                            Total
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "10px", textAlign: "center" }}
                          >
                            -
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "100px", textAlign: "right" }}
                          >
                            {res.Metric &&
                            res.Metric[1] &&
                            res?.Metric[1]?.value
                              ? new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(
                                  res?.Metric[1]?.value?.Azure +
                                    res?.Metric[1]?.value?.AWS
                                )
                              : ""}
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              )}
            </div>
          </Link>
        </div>

        <div className="w-[50%] min-h-[120px] h-hit flex justify-center items-center mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={{
              pathname: "/page/FinOps",
              query: { report: "TagCompliance", cloud: "aws" },
            }}
          >
            <div
              className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
              style={{
                borderRadius: "16px",
                border: "0.5px solid rgba(0, 0, 0, 0.6)",
                background:
                  "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                fontFamily: `"Oxygen",sans-serif`,
              }}
            >
              <div className="w-[4px] h-full absolute left-0 top-0"></div>
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
                    Cost Governance
                  </p>
                </div>
                <div className="mr-4">
                  <TollIcon style={{ fontSize: "40px", color: "#7B62CA" }} />
                </div>
              </div>

              <div
                className=""
                style={{
                  borderTop: "2px solid #7B62CA",
                  width: "100%",
                  background: "#7B62CA",
                }}
              ></div>

              {res && (
                <div className="flex justify-between w-full pr-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-center  border-b-2 pb-1">
                      Allocated Spent
                    </span>
                    <table>
                      <tbody>
                        <tr>
                          <td
                            className="bg-white"
                            style={{ width: "50px", textAlign: "left" }}
                          >
                            AWS
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "10px", textAlign: "center" }}
                          >
                            -
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "100px", textAlign: "right" }}
                          >
                            {currencyData &&
                            currencyData.status &&
                            currencyData.status === "InActive" &&
                            res.Metric &&
                            res.Metric[3] &&
                            res?.Metric[3]?.value
                              ? new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(res?.Metric[3]?.value?.aws)
                              : new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(res?.Metric[3]?.value?.aws)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="bg-white"
                            style={{ width: "50px", textAlign: "left" }}
                          >
                            Azure
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "10px", textAlign: "center" }}
                          >
                            -
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "100px", textAlign: "right" }}
                          >
                            {res.Metric &&
                            res.Metric[3] &&
                            res?.Metric[3]?.value
                              ? new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(res?.Metric[3]?.value?.azure)
                              : ""}
                          </td>
                        </tr>
                        {currencyData &&
                          currencyData.status &&
                          currencyData.status === "Active" && (
                            <tr>
                              <td
                                className="bg-white"
                                style={{ width: "50px", textAlign: "left" }}
                              >
                                Total
                              </td>
                              <td
                                className="bg-white"
                                style={{ width: "10px", textAlign: "center" }}
                              >
                                -
                              </td>
                              <td
                                className="bg-white"
                                style={{ width: "100px", textAlign: "right" }}
                              >
                                {res.Metric &&
                                res.Metric[3] &&
                                res?.Metric[3]?.value
                                  ? new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    }).format(
                                      res?.Metric[3]?.value?.azure +
                                        res?.Metric[3]?.value?.aws
                                    )
                                  : ""}
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-center border-b-2 pb-1">
                      Unallocated Spent
                    </span>
                    <table>
                      <tbody>
                        <tr>
                          <td
                            className="bg-white"
                            style={{ width: "50px", textAlign: "left" }}
                          >
                            AWS
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "10px", textAlign: "center" }}
                          >
                            -
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "100px", textAlign: "right" }}
                          >
                            {currencyData &&
                            currencyData.status &&
                            currencyData.status === "InActive" &&
                            res.Metric &&
                            res.Metric[4] &&
                            res?.Metric[4]?.value
                              ? new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                }).format(res?.Metric[4]?.value?.aws)
                              : new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(res?.Metric[4]?.value?.aws)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="bg-white"
                            style={{ width: "50px", textAlign: "left" }}
                          >
                            Azure
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "10px", textAlign: "center" }}
                          >
                            -
                          </td>
                          <td
                            className="bg-white"
                            style={{ width: "100px", textAlign: "right" }}
                          >
                            {res.Metric &&
                            res.Metric[4] &&
                            res?.Metric[4]?.value
                              ? new Intl.NumberFormat("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                }).format(res?.Metric[4]?.value?.azure)
                              : ""}
                          </td>
                        </tr>
                        {currencyData &&
                          currencyData.status &&
                          currencyData.status === "Active" && (
                            <tr>
                              <td
                                className="bg-white"
                                style={{ width: "50px", textAlign: "left" }}
                              >
                                Total
                              </td>
                              <td
                                className="bg-white"
                                style={{ width: "10px", textAlign: "center" }}
                              >
                                -
                              </td>
                              <td
                                className="bg-white"
                                style={{ width: "100px", textAlign: "right" }}
                              >
                                {res.Metric &&
                                res.Metric[4] &&
                                res?.Metric[4]?.value
                                  ? new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    }).format(
                                      res?.Metric[4]?.value?.azure +
                                        res?.Metric[4]?.value?.aws
                                    )
                                  : ""}
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-[55%] flex flex-wrap justify-start items-start h-[fit-content]">
          <div className="w-full md:w-[45%] h-[130px] flex justify-center items-center mb-4">
            {/* <Link
              className="w-full flex justify-center items-center h-full"
              href={"/page/FinOps"}
            > */}
            <div
              className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
              style={{
                borderRadius: "16px",
                border: "0.5px solid rgba(0, 0, 0, 0.6)",
                background:
                  "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                fontFamily: `"Oxygen",sans-serif`,
              }}
            >
              <div className="w-[4px] h-full absolute left-0 top-0"></div>
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
                    Cloud Assets
                  </p>
                </div>
                <div className="mr-4">
                  <TollIcon style={{ fontSize: "40px", color: "#7B62CA" }} />
                </div>
              </div>

              <div
                className=""
                style={{
                  borderTop: "2px solid #7B62CA",
                  width: "100%",
                  background: "#7B62CA",
                }}
              ></div>

              {res && (
                <div className="flex flex-row">
                  <span>
                    {res.Metric && res.Metric[2] && res.Metric[2].value
                      ? res?.Metric[2]?.value
                      : ""}
                  </span>

                  {/* <Loader percent={(1400 / 1500) * 100} color={"pink"} /> */}
                </div>
              )}
            </div>
            {/* </Link> */}
          </div>

          <div className="w-full md:w-[55%] h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              // href={
              //   userRole == "ADMIN"
              //     ? "/page/FinOps/CloudGateway"
              //     : "/page/FinOps?report=CostSummary"
              // }
              href={{
                pathname: "/page/FinOps",
                query: { report: "CostSummary", cloud: "CloudGateway" },
              }}
            >
              <div
                className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
                style={{
                  borderRadius: "16px",
                  border: "0.5px solid rgba(0, 0, 0, 0.6)",
                  background:
                    "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                  fontFamily: `"Oxygen",sans-serif`,
                }}
              >
                <div className="w-[4px] h-full absolute left-0 top-0"></div>
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
                      ABG Secure Cloud Gateway Cost
                    </p>
                  </div>
                  <div className="mr-4">
                    <TollIcon style={{ fontSize: "40px", color: "#7B62CA" }} />
                  </div>
                </div>

                <div
                  className=""
                  style={{
                    borderTop: "2px solid #7B62CA",
                    width: "100%",
                    background: "#7B62CA",
                  }}
                ></div>

                {/* <span>Coming Soon...</span> */}
                <span>
                  {res && res.Metric && res.Metric[5] && res.Metric[5].value
                    ? "₹" + res?.Metric[5]?.value.toLocaleString("en-IN")
                    : "No Data"}
                </span>
              </div>
            </Link>
          </div>

          <div className="w-full md:w-[45%] h-[150px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={{
                pathname: "/page/FinOps",
                query: { report: "Forecast" },
              }}
            >
              <div className="cursor-pointer w-full flex justify-center items-center h-full">
                <div
                  className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
                  style={{
                    borderRadius: "16px",
                    border: "0.5px solid rgba(0, 0, 0, 0.6)",
                    background:
                      "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                    fontFamily: `"Oxygen",sans-serif`,
                  }}
                >
                  <div className="w-[4px] h-full absolute left-0 top-0"></div>
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
                        Forecast and Recommendation
                      </p>
                    </div>
                    <div className="mr-4">
                      <TollIcon
                        style={{ fontSize: "40px", color: "#7B62CA" }}
                      />
                    </div>
                  </div>

                  <div
                    className=""
                    style={{
                      borderTop: "2px solid #7B62CA",
                      width: "100%",
                      background: "#7B62CA",
                    }}
                  ></div>

                  {/* {res && ( */}
                  <div className="flex flex-col">
                    {/* <span>
                    AWS - {currencyData && currencyData.status && currencyData.status == "InActive" ? "$" : "₹"}
                    {res.Metric && res.Metric[1] && res.Metric[1].value
                      ? res?.Metric[1]?.value?.AWS
                      : ""}
                  </span> */}
                    <span>
                      Azure - ₹
                      {/* {res.Metric && res.Metric[1] && res.Metric[1].value
                      ? res?.Metric[1]?.value?.Azure
                      : ""} */}
                    </span>
                    {/* {currencyData && currencyData.status && currencyData.status == "Active" && (
                    <span>
                      Total - ₹
                      {res.Metric && res.Metric[1] && res?.Metric[1]?.value
                        ? Math.round(res?.Metric[1]?.value?.Azure + res?.Metric[1]?.value?.AWS)
                        : ""}
                    </span>
                  )} */}
                  </div>
                  {/* )} */}
                </div>
              </div>
            </Link>
          </div>

          <div className="w-full md:w-[55%] h-[150px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={{
                pathname: "/page/FinOps",
                query: { report: "CostSummary", cloud: "CloudGateway" },
              }}
            >
              <div
                className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md "
                style={{
                  borderRadius: "16px",
                  border: "0.5px solid rgba(0, 0, 0, 0.6)",
                  background:
                    "linear-gradient(162deg, rgba(123, 98, 202, 0.11) 11.36%, rgba(123, 98, 202, 0.00) 36.6%), #ffffff",
                  fontFamily: `"Oxygen",sans-serif`,
                }}
              >
                <div className="w-[4px] h-full absolute left-0 top-0"></div>
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
                      Cloud Managed Services Cost
                    </p>
                  </div>
                  <div className="mr-4">
                    <TollIcon style={{ fontSize: "40px", color: "#7B62CA" }} />
                  </div>
                </div>

                <div
                  className=""
                  style={{
                    borderTop: "2px solid #7B62CA",
                    width: "100%",
                    background: "#7B62CA",
                  }}
                ></div>
                {res && (
                  <table>
                    <tbody>
                      <tr>
                        <td
                          className="bg-white"
                          style={{ width: "50px", textAlign: "left" }}
                        >
                          AWS
                        </td>
                        <td
                          className="bg-white"
                          style={{ width: "10px", textAlign: "center" }}
                        >
                          -
                        </td>
                        <td
                          className="bg-white"
                          style={{ width: "100px", textAlign: "right" }}
                        >
                          {currencyData &&
                          currencyData.status &&
                          currencyData.status === "InActive" &&
                          res.Metric &&
                          res.Metric[6] &&
                          res?.Metric[6]?.value
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(res?.Metric[6]?.value?.AWS)
                            : new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(res?.Metric[6]?.value?.AWS)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="bg-white"
                          style={{ width: "50px", textAlign: "left" }}
                        >
                          Azure
                        </td>
                        <td
                          className="bg-white"
                          style={{ width: "10px", textAlign: "center" }}
                        >
                          -
                        </td>
                        <td
                          className="bg-white"
                          style={{ width: "100px", textAlign: "right" }}
                        >
                          {res.Metric && res.Metric[6] && res?.Metric[6]?.value
                            ? new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(res?.Metric[6]?.value?.Azure)
                            : ""}
                        </td>
                      </tr>
                      {currencyData &&
                        currencyData.status &&
                        currencyData.status === "Active" && (
                          <tr>
                            <td
                              className="bg-white"
                              style={{ width: "50px", textAlign: "left" }}
                            >
                              Total
                            </td>
                            <td
                              className="bg-white"
                              style={{ width: "10px", textAlign: "center" }}
                            >
                              -
                            </td>
                            <td
                              className="bg-white"
                              style={{ width: "100px", textAlign: "right" }}
                            >
                            {res.Metric &&
                                res.Metric[6] &&
                                res?.Metric[6]?.value
                                  ? new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                    }).format(
                                      res?.Metric[6]?.value?.Azure +
                                        res?.Metric[6]?.value?.AWS
                                    )
                                  : ""}
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                )}
              </div>
            </Link>
          </div>
        </div>
        <div
          key={121}
          className="relative card h-[296px] shadow-md hover:shadow-lg border border-gray-800 "
          style={{
            borderRadius: "16px",
            border: "0.5px solid rgba(0, 0, 0, 0.6)",
            fontFamily: `"Oxygen",sans-serif`,
          }}
        >
          <Link
            href={{
              pathname: "/page/FinOps",
              query: { report: "CostSummary", cloud: "aws" },
            }}
          >
            {/* <div className="!w-[4px] h-full bg-orange-400 absolute left-0 top-0"></div> */}
            {res && res.Graph && res.Graph[0] && res.Graph[0].LineChart && (
              <SmallLineChartComponent
                id={121}
                data={res.Graph[0].LineChart}
                reports={true}
                currencyDataStatus={
                  currencyData &&
                  currencyData.status &&
                  currencyData.status == "InActive"
                    ? "$"
                    : "₹"
                }
                titleColor={"rgb(0, 0, 0)"}
              />
            )}
            {(!res || !res.Graph) && (
              <p className="text-black font-bold text-lg">
                Cloud Consumption Trend
              </p>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Reports;
