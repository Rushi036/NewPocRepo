import LineChartComponent from "@/pages/Components/Charts/LineChart";
import Loader from "@/pages/Components/loader";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsVariablePie from "highcharts/modules/variable-pie";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import SmallLineChartComponent from "@/pages/Components/Charts/SmallLinechart";

const Reports = () => {
  useEffect(() => {
    // HighchartsExporting(Highcharts);
    // HighchartsExportData(Highcharts);
    HighchartsAccessibility(Highcharts);
    // HighchartsVariablePie(Highcharts);
    NoDataToDisplay(Highcharts);
  }, []);
  const [role, setRole] = useState<any>();
  const data: any = {
    title: "Consumption Trend",
    data: [
      {
        name: "Azure",
        data: [
          ["1 Oct", 10.0],
          ["2 Oct", 95.0],
          ["3 Oct", 2.0],
          ["4 Oct", 11.0],
        ],
      },
      {
        name: "AWS",
        data: [
          ["1 Oct", 80.0],
          ["2 Oct", 40.0],
          ["3 Oct", 70.0],
          ["4 Oct", 50.0],
        ],
      },
    ],
    xAxis: "",
    yAxis: "",
  };
  useEffect(() => {
    setRole(sessionStorage.getItem("userRole"));
  }, []);
  return (
    <>
      <div className="text-xl border-b-2  border-slate-400 pb-2 px-4">
        FinOps
      </div>

      <div className="flex mt-4">
        <div className="w-[50%] h-[130px] mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={"/page/FinOps/newFinops"}
          >
            <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-red-400 absolute left-0 top-0"></div>
              <p className="text-red-400 font-bold text-lg">
                Total Consumption Monthly
              </p>
              <div className="flex flex-col">
                <span>₹12,345.00</span>
                <span className="text-slate-500 text-sm">Last Month’s</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={"/page/FinOps/newFinops"}
          >
            <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-green-400 absolute left-0 top-0"></div>
              <p className="text-green-500 font-bold text-lg">
                Total Consumption Weekly
              </p>

              <div className="flex flex-col">
                <span>₹12,345.00</span>
                <span className="text-slate-500 text-sm">Last Week’s</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
          <Link
            className="w-full flex justify-center items-center h-full"
            href={"/page/FinOps"}
          >
            <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
              <div className="w-[4px] h-full bg-yellow-400 absolute left-0 top-0"></div>
              <div className="w-[4px] h-full bg-blue-400 absolute left-0 top-0"></div>
              <p className="text-blue-500 font-bold text-lg">Cost Governance</p>

              <div className="flex flex-col">
                <span className="">• Cost allocated</span>
                <span className="">• spend/unallocated spend</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-[50%] flex flex-wrap justify-start items-start h-[fit-content]">
          <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={"/page/FinOps"}
            >
              <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-pink-400 absolute left-0 top-0"></div>
                <p className="text-pink-500 font-bold text-lg">Total Asset</p>

                <div className="flex flex-row">
                  <span>1400</span>
                  <span className="">/1500</span>
                  <Loader percent={(1400 / 1500) * 100} color={"pink"} />
                </div>
              </div>
            </Link>
          </div>

          <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={"/page/FinOps"}
            >
              <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-purple-400 absolute left-0 top-0"></div>
                <p className="text-purple-500 font-bold text-lg">
                  Cloud Gateway
                </p>

                <div className="flex flex-col  w-full mt-4">
                  <span>₹12,345.00</span>
                  <span className="text-slate-500 text-sm">Last Month’s</span>
                  {/* <span className="text-purple-400 text-center text-xl">18</span> */}
                </div>
              </div>
            </Link>
          </div>

          <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
            <div
              className="w-full flex justify-center items-center h-full"
              // href={"/page/FinOps"}
            >
              <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-rose-400 absolute left-0 top-0"></div>
                <p className="text-rose-500 font-bold text-lg">
                  Forecast & Recommendation
                </p>

                <div className="flex flex-col  w-full mt-4">
                  {/* <span className="text-purple-400">₹12,345.00</span> */}
                  <span>Coming Soon...</span>
                  {/* <span className="text-purple-400 text-center text-xl">18</span> */}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
            <Link
              className="w-full flex justify-center items-center h-full"
              href={"/page/FinOps"}
            >
              <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                <div className="w-[4px] h-full bg-yellow-300 absolute left-0 top-0"></div>
                <p className="text-yellow-400 font-bold text-lg">
                  Managed Services Cost
                </p>

                <div className="flex flex-col  w-full mt-4">
                  <span>(12% of Consumption)</span>
                  {/* <span className="text-purple-400 text-center text-xl">18</span> */}
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div key={121} className="relative card h-[fit-content] shadow-lg">
          <div className="!w-[4px] h-full bg-orange-400 absolute left-0 top-0"></div>

          <SmallLineChartComponent
            id={121}
            data={data}
            reports={true}
            titleColor={"rgb(251,146,60)"}
          />
        </div>
      </div>
    </>
  );
};

export default Reports;

{
  /* <div className="w-[50%] h-[130px] flex justify-center items-center mb-4">
                        <Link
                            className="w-full flex justify-center items-center h-full"
                            href={"/page/FinOps"}
                        >
                            <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                                <div className="w-[4px] h-full bg-orange-400 absolute left-0 top-0"></div>
                                <p className="text-orange-500 font-bold text-lg">
                                    Consumption Trend
                                </p>
                                <div className="flex flex-col  w-full mt-4">
                                </div>
                            </div>
                        </Link>
                    </div> */
}
