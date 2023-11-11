import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SmallLineChartComponent = (props: any) => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer.current) {
      const options: any = {
        title: {
          text: props.data.title,
          align: "left",
        },
        xAxis: {
          title: {
            text: props.data.xAxis || "Date",
          },
          type: "category",
        },
        yAxis: [
          {
            title: {
              text: props.data.firstYAxis || "Rupees",
            },
          },
          {
            title: {
              text: props.data.secondYAxis || "Dollar",
            },
            opposite: true, // Place this y-axis on the opposite side
          },
        ],
        legend: {
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
          itemStyle: {
            fontSize: "10px",
          },
          itemWidth: 150,
          itemDistance: 5,
        },
        series: props.data.series,
        chart: {
          height: 245,
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

  return <div ref={chartContainer} />;
};

export default SmallLineChartComponent;
