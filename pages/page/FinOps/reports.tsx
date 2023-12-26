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
      <div className="text-xl border-b-2  border-slate-400 pb-2 px-4">
        FinOps
      </div>

      <div className="flex mt-4">
        <div className="w-[50%] min-h-[120px] h-hit mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={{
              pathname: "/page/FinOps",
              query: { report: "CostDrillDown" },
            }}
          >
            <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-red-400 absolute left-0 top-0"></div>
              <p className="text-red-400 font-bold text-lg">
                Total Consumption Monthly
              </p>
              {res && (
                <div className="flex flex-col">
                  <span>
                    AWS - {currencyData.status == "InActive" ? "$" : "₹"}
                    {res.Metric && res.Metric[0] && res?.Metric[0]?.value
                      ? res?.Metric[0]?.value?.AWS
                      : ""}
                  </span>
                  <span>
                    Azure - ₹
                    {res.Metric && res.Metric[0] && res?.Metric[0]?.value
                      ? res?.Metric[0]?.value?.Azure
                      : ""}
                  </span>
                  {currencyData.status == "Active" && (
                    <span>
                      Total - ₹
                      {res.Metric && res.Metric[0] && res?.Metric[0]?.value
                        ? Math.round(res?.Metric[0]?.value?.Azure + res?.Metric[0]?.value?.AWS)
                        : ""}
                    </span>
                  )}
                </div>
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
            <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-green-400 absolute left-0 top-0"></div>
              <p className="text-green-500 font-bold text-lg">
                Total Consumption Weekly
              </p>

              {res && (
                <div className="flex flex-col">
                  <span>
                    AWS - {currencyData.status == "InActive" ? "$" : "₹"}
                    {res.Metric && res.Metric[1] && res.Metric[1].value
                      ? res?.Metric[1]?.value?.AWS
                      : ""}
                  </span>
                  <span>
                    Azure - ₹
                    {res.Metric && res.Metric[1] && res.Metric[1].value
                      ? res?.Metric[1]?.value?.Azure
                      : ""}
                  </span>
                  {currencyData.status == "Active" && (
                    <span>
                      Total - ₹
                      {res.Metric && res.Metric[1] && res?.Metric[1]?.value
                        ? Math.round(res?.Metric[1]?.value?.Azure + res?.Metric[1]?.value?.AWS)
                        : ""}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="w-[50%] min-h-[120px] h-hit flex justify-center items-center mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={{
              pathname: "/page/FinOps",
              query: { report: "3", cloud: "aws" },
            }}
          >
            <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-yellow-400 absolute left-0 top-0"></div>
              <div className="w-[4px] h-full bg-blue-400 absolute left-0 top-0"></div>
              <p className="text-blue-500 font-bold text-lg">Cost Governance</p>

              {res && (
                <div className="flex justify-between w-full pr-2">
                  <div className="flex flex-col">
                    <span className="font-bold  border-b-2 pb-1">
                      Allocated Spent
                    </span>
                    <span>
                      AWS - {currencyData.status == "InActive" ? "$" : "₹"}
                      {res.Metric && res.Metric[3] && res.Metric[3].value
                        ? res?.Metric[3]?.value?.aws
                        : ""}
                    </span>
                    <span>
                      Azure - ₹
                      {res.Metric && res.Metric[3] && res.Metric[3].value
                        ? res?.Metric[3]?.value?.azure
                        : ""}
                    </span>
                    {currencyData.status == "Active" && (
                    <span>
                      Total - ₹
                      {res.Metric && res.Metric[3] && res?.Metric[3]?.value
                        ? Math.round(res?.Metric[3]?.value?.azure + res?.Metric[3]?.value?.aws)
                        : ""}
                    </span>
                  )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold border-b-2 pb-1">
                      Unallocated Spent
                    </span>
                    <span>
                      AWS - {currencyData.status == "InActive" ? "$" : "₹"}
                      {res.Metric && res.Metric[4] && res.Metric[4].value
                        ? res?.Metric[4]?.value?.aws
                        : ""}
                    </span>
                    <span>
                      Azure - ₹
                      {res.Metric && res.Metric[4] && res.Metric[4].value
                        ? res?.Metric[4]?.value?.azure
                        : ""}
                    </span>
                    {currencyData.status == "Active" && (
                    <span>
                      Total - ₹
                      {res.Metric && res.Metric[4] && res?.Metric[4]?.value
                        ? Math.round(res?.Metric[4]?.value?.azure + res?.Metric[4]?.value?.aws)
                        : ""}
                    </span>
                  )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-[50%] flex flex-wrap justify-start items-start h-[fit-content]">
          <div className="w-full md:w-1/2 h-[130px] flex justify-center items-center mb-4">
            {/* <Link
              className="w-full flex justify-center items-center h-full"
              href={"/page/FinOps"}
            > */}
            <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-pink-400 absolute left-0 top-0"></div>
              <p className="text-pink-500 font-bold text-lg">Total Asset</p>

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

          <div className="w-full md:w-1/2 h-[130px] flex justify-center items-center mb-4">
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
              <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-purple-400 absolute left-0 top-0"></div>
                <p className="text-purple-500 font-bold text-lg">
                  Cloud Gateway
                </p>

                <div className="flex flex-col  w-full mt-4">
                  {/* <span>Coming Soon...</span> */}
                  <span>
                    {res && res.Metric && res.Metric[5] && res.Metric[5].value
                      ? "₹" + res?.Metric[5]?.value
                      : "No Data"}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="w-full md:w-1/2 h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={{
                pathname: "/page/FinOps",
                query: { report: "Forcast" },
              }}
            >
              <div className="cursor-pointer w-full flex justify-center items-center h-full">
                <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                  <div className="w-[4px] h-full bg-rose-400 absolute left-0 top-0"></div>
                  <p className="text-rose-500 font-bold text-lg">
                    Forecast & Recommendation
                  </p>

                  <div className="flex flex-col  w-full mt-4">
                    <span>Coming Soon...</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="w-full md:w-1/2 h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={{
                pathname: "/page/FinOps",
                query: { report: "CostSummary", cloud: "CloudGateway" },
              }}
            >
              <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-yellow-300 absolute left-0 top-0"></div>
                <p className="text-yellow-400 font-bold text-lg">
                  Managed Services Cost
                </p>

                {res && (
                  <div className="flex flex-col">
                    <span>
                      AWS - {currencyData.status == "InActive" ? "$" : "₹"}
                      {res.Metric && res.Metric[6] && res.Metric[6].value
                        ? res?.Metric[6]?.value?.AWS
                        : ""}
                    </span>
                    <span>
                      Azure - ₹
                      {res.Metric && res.Metric[6] && res.Metric[6].value
                        ? res?.Metric[6]?.value?.Azure
                        : ""}
                    </span>
                    {currencyData.status == "Active" && (
                    <span>
                      Total - ₹
                      {res.Metric && res.Metric[6] && res?.Metric[6]?.value
                        ? Math.round(res?.Metric[6]?.value?.Azure + res?.Metric[6]?.value?.AWS)
                        : ""}
                    </span>
                  )}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
        <div
          key={121}
          className="relative card h-[276px] shadow-md hover:shadow-lg"
        >
          <Link
            href={{
              pathname: "/page/FinOps",
              query: { report: "CostSummary", cloud: "aws" },
            }}
          >
            <div className="!w-[4px] h-full bg-orange-400 absolute left-0 top-0"></div>
            {res && res.Graph && res.Graph[0] && res.Graph[0].LineChart && (
              <SmallLineChartComponent
                id={121}
                data={res.Graph[0].LineChart}
                reports={true}
                currencyDataStatus={
                  currencyData.status == "InActive" ? "$" : "₹"
                }
                titleColor={"rgb(251,146,60)"}
              />
            )}
            {(!res || !res.Graph) && (
              <p className="text-orange-400 font-bold text-lg">
                Consumption Trend
              </p>
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Reports;
