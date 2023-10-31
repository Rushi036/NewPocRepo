import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const BarGraph = (props: any) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      const options: any = {
        chart: {
          // height: (9 / 16 * 100) + '%',
          height: 400,
          type: props?.data?.type || "column",
        },
        title: {
          text: props?.data?.title || "",
          align: "left",
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
            enabled: props?.data?.stacking || false,
          },
        },
        legend: {
          // align: "left",
          // x: 70,
          // verticalAlign: "top",
          // y: 70,
          // floating: true,
          // backgroundColor: "white",
          // borderColor: "#CCC",
          // borderWidth: 1,
          // shadow: false,
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}",
        },
        plotOptions: {
          column: {
            stacking: props?.data?.stacking == "true" || props?.data?.stacking == true ? "normal" : false,
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: props?.data?.data || [],
      };

      // console.log(props.data)

      Highcharts.chart(chartContainer.current, options);
    }
  }, [props.data]); // Empty dependency array ensures the effect runs once after initial render

  return <div ref={chartContainer} />;
};

export default BarGraph;
