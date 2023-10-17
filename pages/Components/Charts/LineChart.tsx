import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getUnBlendedCost } from "@/pages/api/FinopsApi/GetUnblendedCost";

const LineChartComponent = (props: any) => {
  //   console.log("props in chart", id);
  const chartContainer = useRef(null);
  // const [unBlendCostData, setUnBlendCostData] = useState<any>();
  // const getData = async () => {
  //   await getUnBlendedCost(id).then((res) => {
  //     // console.log("res in chart", res);
  //     setUnBlendCostData(res);
  //   });
  // };
  // useEffect(() => {
  //   getData();
  // }, [id]);
  useEffect(() => {
    // console.log("unblend in chart", props.data);
    if (chartContainer.current) {
      const newData = props?.data?.data.map((e: any) => {
        let changedData = e.data?.map((x: any) => {
          return [
            new Date(x[0]).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              // hour: "2-digit",
              // minute: "2-digit",
            }),
            x[1],
          ];
        });
        return { name: e.name, data: changedData };
      });
      // console.log("tline chart data ", newData)
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
          type: "category"
        },

        legend: {
          layout: "vertical",
          align: "right",
          verticalAlign: "middle",
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
      };

      // console.log(options);

      Highcharts.chart(chartContainer.current, options);
    }
  }, [props.data]); // Empty dependency array ensures the effect runs once after initial render

  return <div ref={chartContainer} style={{ height: "400px" }} />;
};

export default LineChartComponent;
