import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getUnBlendedCost } from "@/pages/api/FinopsApi/GetUnblendedCost";

const LineChartComponent = (props: any) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      const newData =
        props &&
        props.data &&
        props.data.data &&
        props?.data?.data.map((e: any) => {
          let changedData = e.data?.map((x: any) => {
            return [
              new Date(x[0]).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
              }),
              x[1],
            ];
          });
          return { name: e.name, data: changedData };
        });

      const options: any = {
        title: {
          text: props.data.title,
          align: "left",
        },

        yAxis: {
          title: {
            text: props.data.yAxis || "",
          },
        },

        xAxis: {
          title: {
            text: props.data.xAxis || "",
          },
          type: "category",
        },
        legend: {
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
          itemStyle: {
            fontSize: "10px", // Adjust font size of legends
          },
          itemWidth: 150, // Set the width of each legend item
          itemDistance: 5,
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
          },
        },

        series: newData,

        chart: {
          height: 600, // Increase the height of the chart
        },

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
    }
  }, [props.data]);

  return <div ref={chartContainer} style={{ height: "600px" }} />;
};

export default LineChartComponent;
