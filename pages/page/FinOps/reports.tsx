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
  useEffect(() => {
    getReportsDashboard().then((data: any) => {
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
        <div className="w-[50%] h-[130px] mb-4">
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
                    AWS - ${res?.Metric ? res?.Metric[0]?.value?.AWS : ""}
                  </span>
                  <span>
                    Azure - ₹{res?.Metric ? res?.Metric[0]?.value?.Azure : ""}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
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
                    AWS - ${res?.Metric ? res?.Metric[1]?.value?.AWS : ""}
                  </span>
                  <span>
                    Azure - ₹{res?.Metric ? res?.Metric[1]?.value?.Azure : ""}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
          {/* <Link
            className="w-full flex justify-center items-center h-full"
            href={"/page/FinOps"}
          > */}
          <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
            <div className="w-[4px] h-full bg-yellow-400 absolute left-0 top-0"></div>
            <div className="w-[4px] h-full bg-blue-400 absolute left-0 top-0"></div>
            <p className="text-blue-500 font-bold text-lg">Cost Governance</p>

            <div className="flex flex-col">
              <span>Coming Soon...</span>
            </div>
          </div>
          {/* </Link> */}
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
                  <span>{res?.Metric ? res?.Metric[2]?.value : ""}</span>
                  {/* <Loader percent={(1400 / 1500) * 100} color={"pink"} /> */}
                </div>
              )}
            </div>
            {/* </Link> */}
          </div>

          <div className="w-full md:w-1/2 h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={"/page/FinOps/CloudGateway"}
            >
              <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-purple-400 absolute left-0 top-0"></div>
                <p className="text-purple-500 font-bold text-lg">
                  Cloud Gateway
                </p>

                <div className="flex flex-col  w-full mt-4">
                  <span>Coming Soon...</span>
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
            {/* <Link
                            className="w-full flex justify-center items-center h-full"
                            href={"/page/FinOps"}
                        > */}
            <div className="hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-yellow-300 absolute left-0 top-0"></div>
              <p className="text-yellow-400 font-bold text-lg">
                Managed Services Cost
              </p>

              <div className="flex flex-col  w-full mt-4">
                <span>Coming Soon...</span>
              </div>
            </div>
            {/* </Link> */}
          </div>
        </div>
        <div
          key={121}
          className="relative card h-[276px] shadow-md hover:shadow-lg"
        >
          <div className="!w-[4px] h-full bg-orange-400 absolute left-0 top-0"></div>
          {res && res?.Graph && (
            <SmallLineChartComponent
              id={121}
              data={res.Graph[0].LineChart}
              reports={true}
              titleColor={"rgb(251,146,60)"}
            />
          )}
          {(!res || !res.Graph) && (
            <p className="text-orange-400 font-bold text-lg">
              Consumption Trend
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Reports;
