import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import { getUnBlendedCost } from "@/pages/api/FinopsApi/GetUnblendedCost";

const SmallLineChartComponent = (props: any) => {
  const chartContainer = useRef(null);
 
  useEffect(() => {
    if (chartContainer.current) {
      const newData =
        props &&
        props.data &&
        props.data.data &&
        props?.data?.data.map((e: any) => {
          let changedData = e.data?.map((x: any) => {
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];

            const isValidMonth = monthNames.includes(x[0]);
            const formattedDate = isValidMonth
              ? x[0] // If it's a valid month name, use it as-is
              : new Date(x[0]).toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
              });

            return [formattedDate, x[1]];
          });
          return { name: e.name, data: changedData };
        });

      const options: any = {
        title: {
          text: props?.data?.title ?? "Consumption Trend",
          align: "left",
          style: {
            color: props?.titleColor ?? "#000",
            fontWeight: 'bold'
          }
        },

        yAxis: [
          {
            title: {
              text: props?.data?.firstYAxis || "Rupees",
            },
          },
          {
            title: {
              text: props?.data?.secondYAxis || "Dollar",
            },
            opposite: true, // Place this y-axis on the opposite side
          },
        ],
        xAxis: {
          title: {
            text: props?.data?.xAxis || "",
          },
          type: "category",
        },
        credits: {
          enabled: false,
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
          height: 245, // Adjust the height of the chart based on the reports prop
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
  }, [props?.data, props?.reports]);

  return <div ref={chartContainer} />;
};

export default SmallLineChartComponent;
