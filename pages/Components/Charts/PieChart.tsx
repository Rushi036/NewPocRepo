import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsVariablePie from "highcharts/modules/variable-pie";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";

// Initialize Highcharts modules

const ChartComponent = () => {
  useEffect(() => {
    HighchartsVariablePie(Highcharts);
    NoDataToDisplay(Highcharts);
    Highcharts.chart("container", {
      chart: {
        type: "variablepie",
      },
      title: {
        text: "Resource Group Distribution of Most Used Subscriptions",
        align: "left",
      },
      tooltip: {
        headerFormat: "",
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' 
          // +
          // "Area (square km): <b>{point.y}</b><br/>" +
          // "Population density (people per square km): <b>{point.z}</b><br/>",
      },
      lang: {
        noData: "Please select atleast one Application",
      },
      noData: {
        style: {
          fontWeight: "bold",

          fontSize: "15px",

          color: "#303030",
        },
      },
      legend: {
        enabled: true,
      },
      series: [
        {
          type: "variablepie",
          minPointSize: 100,
          innerSize: "40%",
          zMin: 0,
          name: "countries",
          borderRadius: 5,
          data: [
            ["GRCD-AZ-AUT-PNP-R", 505992, 92],
            ["Digitalexnonprod-Resource", 551695, 119],
            ["GRCD-AZ-SUR-DP-RSG-01", 312679, 121],
            ["grcd-az-sap-pnp-rsg-01", 78865, 136],
            ["GRCD-AZ-SAP-PNP-RSG-01", 301336, 200],
            ["GRCD-AZ-SUR-PNP-RSG-01", 41284, 213],
            ["grcd-az-sur-pnp-rsg-01", 357114, 235],
          ],
          colors: [
            "#63ace5", // Light Blue
        "#98d26d", // Light Green
        "#ffb366", // Light Orange
        "#d18bff", // Light Purple
        "#ff85a2", // Light Pink
        "#ffdb5c", // Light Yellow
        "#4fd1c5", // Light Teal
          ],
        },
      ],
    });
  }, []); // Empty dependency array ensures the effect runs once after initial render

  return <div id="container" style={{ height: "400px" }} />;
};

export default ChartComponent;
