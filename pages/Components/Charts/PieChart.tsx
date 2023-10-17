import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsVariablePie from "highcharts/modules/variable-pie";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";

// Initialize Highcharts modules

const ChartComponent = (props: any) => {
  useEffect(() => {
    HighchartsVariablePie(Highcharts);
    NoDataToDisplay(Highcharts);
  }, []);
  useEffect(() => {
    // console.log(props.data.data);
    if (props.data) {

      const options: any = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
        },
        title: {
          text: props.data.title,
          align: "left",
        },
        plotOptions: {
          pie: {
            size:'150px',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '{point.percentage:.1f} %'
            },
            showInLegend: true
          }
        },
        tooltip: {
          headerFormat: "",
          pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>'
          +
          `Total: <b>{point.y}</b> ${props.data.xAxis || ""}<br/>`,
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
          // align: 'right',
          // verticalAlign: 'top',
          // layout: 'vertical',
        },
        series: [
          {
            type: "pie",
            minPointSize: 100,
            innerSize: "40%",
            zMin: 0,
            name: "networks",
            borderRadius: 0,
            colorByPoint: true,
            data: props.data.data
          }
        ]
      }

      Highcharts.chart("container-" + props.id, options);
    }
  }, [props.data]); // Empty dependency array ensures the effect runs once after initial render

  return <div id={"container-" + props.id} style={{ height: "400px" }} />;
};

export default ChartComponent;
