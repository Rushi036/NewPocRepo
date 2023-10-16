import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StackChartComponent = (props:any) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      const options:any = {
        chart: {
          type: "column",
        },
        title: {
          text: "Resource Group Application Level Diagram",
          align: "left",
        },
        xAxis: {
          categories: [
            "Quality Tonner Management DB Server",
            "QLTY - Tonner Management App (SAP SURROUND)",
            "Quality OmniDocs Server -02",
            "Quality OmniDocs Server",
            "QUALITY - SAFAL Server (App + DB)",
            "DB PaaS Backup",
            "QAS-DB+App (SAP Server)",
          ],
        },
        yAxis: {
          min: 0,
          title: {
            text: "Count trophies",
          },
          stackLabels: {
            enabled: true,
          },
        },
        legend: {
          align: "left",
          x: 70,
          verticalAlign: "top",
          y: 70,
          floating: true,
          backgroundColor: "white",
          borderColor: "#CCC",
          borderWidth: 1,
          shadow: false,
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
          },
        },
        series: [
          {
            name: "Q1",
            data: [3, 5, 1, 13, 20, 3, 5],
          },
          {
            name: "Q2",
            data: [14, 8, 8, 12, 12, 5, 6],
          },
          {
            name: "Q3",
            data: [0, 2, 6, 3, 5, 8, 9],
          },
          {
            name: "Q4",
            data: [0, 2, 6, 14, 4, 10, 2],
          },
          {
            name: "Q5",
            data: [0, 2, 6, 7, 8, 11, 3],
          },
          {
            name: "Q6",
            data: [0, 2, 6, 8, 5, 3, 7],
          },
          {
            name: "Q7",
            data: [0, 2, 6, 9, 9, 4, 6],
          },
        ],
      };

      Highcharts.chart(chartContainer.current, options);
    }
  }, []); // Empty dependency array ensures the effect runs once after initial render

  return <div ref={chartContainer} style={{ height: "400px" }} />;
};

export default StackChartComponent;
