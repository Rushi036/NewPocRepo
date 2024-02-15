import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import { getUnBlendedCost } from "@/pages/api/FinopsApi/GetUnblendedCost";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";

const LineChartComponent = (props: any) => {
  const chartContainer = useRef(null);
  // const props : any = {}
  // console.log("linechart props", props);

  useEffect(() => {
    HighchartsExporting(Highcharts);
    HighchartsExportData(Highcharts);
    HighchartsAccessibility(Highcharts);
    NoDataToDisplay(Highcharts);
  }, []);

  useEffect(() => {
    if (chartContainer.current) {
      const firstHead = props && props.data && props.data.firstHeader;
      const secHead = props && props.data && props.data.secondHeader;
      // console.log(firstHead, secHead);
      const newData =
        props &&
        props.data &&
        props.data.data &&
        props?.data?.data.map((e: any) => {
          let changedData =
            e &&
            e.data &&
            e.data?.map((x: any) => {
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
          return {
            name: e.name,
            data: changedData,
            color:
              (e.name == "Forecasted Cost" ||
                e.name == "Forecast Cost Trend " ||
                e.name == "Forecast Cost Trend") &&
              "#00008B ",
          };
        });
      // console.log("newdata", newData);
      // console.log("headaer", secHead);
      const options: any = {
        chart: {
          animation: false,
          height: props && props.height ? props.height : 500, // Adjust the height of the chart based on the reports prop
          zoomType: "x",
        },
        title: {
          text: props?.data?.title,
          align: "left",
          style: {
            fontWeight: "bold",
            fontSize: "14px",
            fontFamily: `"Oxygen",sans-serif`,
          },
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          crosshairs: true,
          animation: true,
          shared: true,
          // pointFormat: "<span>{series.name}</span>: <b>{point.y}</b><br />",
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
          type: "category",
        },
        legend: {
          enabled: props?.legendEnabled ?? true,
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
            tooltip: {
              pointFormatter: function (this: Highcharts.Point): string {
                const chartTitle: any =
                  this?.series?.chart?.options?.title?.text;
                const yAxisText = props?.data?.yAxis || "";

                if (
                  ["Cost", "cost"].some((substring) =>
                    chartTitle.includes(substring)
                  ) ||
                  [
                    "Cost(₹)",
                    "Cost($)",
                    "cost(₹)",
                    "cost($)",
                    "Azure(₹)",
                    "AWS($)",
                  ].some((substring) => yAxisText.includes(substring))
                ) {
                  return (
                    '<span style="color:' +
                    this.color +
                    '">\u25CF</span> ' +
                    this.series.name +
                    ": <b>" +
                    this.y?.toLocaleString("en-IN") +
                    "</b><br/>"
                  );
                } else {
                  return (
                    '<span style="color:' +
                    this.color +
                    '">\u25CF</span> ' +
                    this.series.name +
                    ": <b>" +
                    this.y +
                    "</b><br/>"
                  );
                }
              },
              headerFormat: "",
              footerFormat: "",
              shared: true,
              useHTML: true,
            },
          },
        },

        series: newData,

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
        exporting: {
          showTable: false,
          csv: {
            columnHeaderFormatter: function (item: any, key: any) {
              if (!item || item instanceof Highcharts.Axis) {
                return firstHead ? firstHead : ""; //this will be the column heading
              } else if (newData && newData.length == 1) {
                return secHead ? secHead : "";
              } else {
                return item.name ? item.name : "";
              }
            },
          },
        },
      };
      Highcharts.chart(chartContainer.current, options);
    }
  }, [props?.data, props?.reports]);

  return <div ref={chartContainer} />;
};

export default LineChartComponent;
