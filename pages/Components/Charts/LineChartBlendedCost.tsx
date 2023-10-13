import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getUnBlendedCost } from "@/pages/api/FinopsApi/GetUnblendedCost";

const LineChartComponent = (Id: any, dates: any) => {
  //   console.log("props in chart", Id);
  const chartContainer = useRef(null);
  const [unBlendCostData, setUnBlendCostData] = useState<any>();
  const getData = async () => {
    await getUnBlendedCost(Id).then((res) => {
      console.log("res in chart", res);
      setUnBlendCostData(res);
    });
  };
  useEffect(() => {
    getData();
  }, [Id]);
  console.log("unblend in chart", unBlendCostData);
  useEffect(() => {
    if (chartContainer.current) {
      const newData = unBlendCostData?.data.map((e: any) => {
        return [
          new Date(e[0]).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          e[1],
        ];
      });
      console.log(newData);
      const options: any = {
        title: {
          text: "Cost Trend Over Time",
          align: "left",
        },

        // subtitle: {
        //   text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
        //   align: "left",
        // },

        yAxis: {
          title: {
            text: "Unblended Cost",
          },
        },

        xAxis: {
          type: "category",
          //     accessibility: {
          //         rangeDescription: 'Range: 2010 to 2020'
          //     }
        },

        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            // pointStart: 1,
          },
        },

        series: [
          {
            name: "app",
            // data: [["hi",4394], 567, 5678, 5678, 43934, 4567, 45678, 5678],
            data: newData ? newData : [],
          },
        ],

        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                },
              },
            },
          ],
        },
      };

      Highcharts.chart(chartContainer.current, options);
      console.log(newData);
    }
  }, [unBlendCostData]); // Empty dependency array ensures the effect runs once after initial render

  return <div ref={chartContainer} style={{ height: "400px" }} />;
};

export default LineChartComponent;
