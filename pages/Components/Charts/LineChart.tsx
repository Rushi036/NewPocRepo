import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getUnBlendedCost } from "@/pages/api/FinopsApi/GetUnblendedCost";

const LineChartComponent = (props: any) => {
  const chartContainer = useRef(null);
  useEffect(() => {
    if (chartContainer.current) {
      const newData = (props?.data?.data || []).map((e: any) => {
        let changedData = e?.data?.map((x: any) => {
          // new Date(x[0]).toLocaleString("en-US", {
          //   month: "short",
          //   day: "2-digit",
          //   // year: "numeric",
          //   // hour: "2-digit",
          //   // minute: "2-digit",
          // }),
          return [
            x[0],x[1],
          ];
        });
        return { name: e.name, data: changedData };
      });
      const options: any = {
        chart: {
          height: props?.reports ? "244" : "",
          zoomType: 'x'
        },
        title: {
          text: props?.data?.title || "",
          align: "left",
          style: {
            color: props.titleColor? props.titleColor:'#000',
          }
        },

        yAxis: {
          title: {
            text: props?.data?.yAxis || "",
          },
        },

        xAxis: {
          title: {
            text: props?.data?.xAxis || "",
          },
          type: "category"
        },

        legend: {
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
        },
        noData: {
          style: {
            fontWeight: "bold",
            fontSize: "15px",
            color: "#303030",
          },
        },
        lang: {
          noData: "No Data to Display",
        },
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
            // pointStart: 1,
          },
        },
        tooltip: {
          shared: true,
          crosshairs: true
        },

        series: newData || [],

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

      // console.log(options);

      Highcharts.chart(chartContainer.current, options);
    }
  }, [props.data]); // Empty dependency array ensures the effect runs once after initial render

  // return <div ref={chartContainer} />;
  return <div ref={chartContainer} style={{ height: props?.reports ? "auto" : "400px" }} />;
};

export default LineChartComponent;
