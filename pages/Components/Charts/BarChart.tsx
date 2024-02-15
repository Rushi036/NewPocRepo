import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";
const BarGraph = (props: any) => {
  console.log("props in bargraph", props);
  const chartContainer = useRef(null);
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
      // console.log("data in bargraph",props.data.data)
      const newData =
        props.data &&
        props.data.data &&
        props.data.data.map((series: any, index: any) => {
          return {
            ...series,
            color: series.name == "Forecasted Cost" && "#00008B",
          };
        });
      const options: any = {
        chart: {
          // height: (9 / 16 * 100) + '%',
          height: props.height || 500,
          type: props?.data?.type || "column",
        },
        title: {
          text: props?.data?.title || "",
          align: "left",
          style: {
            fontWeight: "bold",
            fontSize: "14px",
            fontFamily: `"Oxygen",sans-serif`,
          },
        },
        xAxis: {
          categories: props?.data?.categories || [],
          title: {
            text: props?.data?.xAxis || "",
          },
        },
        lang: {
          noData: "No Data to Display",
        },
        credits: {
          enabled: false,
        },
        noData: {
          style: {
            fontWeight: "bold",
            fontSize: "15px",
            color: "#303030",
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: props?.data?.yAxis || "",
          },
          stackLabels: {
            enabled: false,
          },
        },
        legend: {
          enabled: props.legendEnabled ?? true,
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
          itemStyle: {
            fontSize: "10px",
          },
          itemWidth: 150,
          itemDistance: 5,
        },
        tooltip: {
          pointFormatter: function (this: Highcharts.Point): string {
            const chartTitle: any = this?.series?.chart?.options?.title?.text;
            const yAxisText = props?.data?.yAxis || "";

            if (
              ["Cost", "cost"].some((substring) =>
                chartTitle.includes(substring)
              ) ||
              ["Cost(₹)", "Cost($)", "cost(₹)", "cost($)"].some((substring) =>
                yAxisText.includes(substring)
              )
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
        plotOptions: {
          column: {
            stacking:
              props?.data?.stacking == "true" || props?.data?.stacking == true
                ? "normal"
                : false,
            dataLabels: {
              enabled: false,
            },
          },
        },
        series: newData || [], //name should be sent here and it will come from the api
        exporting: {
          showTable: false,
          csv: {
            columnHeaderFormatter: function (item: any, key: any) {
              if (!item || item instanceof Highcharts.Axis) {
                return firstHead ? firstHead : ""; //this will be the column heading
              } else if (
                props &&
                props.data &&
                props.data.data &&
                props?.data?.data.length == 1
              ) {
                return secHead ? secHead : "";
              } else {
                return item.name ? item.name : "";
              }
            },
          },
        },
      };

      // console.log(props.data)

      Highcharts.chart(chartContainer.current, options);
    }
  }, [props.data]); // Empty dependency array ensures the effect runs once after initial render

  return <div ref={chartContainer} />;
};

export default BarGraph;
