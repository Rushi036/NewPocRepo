import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsVariablePie from "highcharts/modules/variable-pie";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
import HighchartsAccessibility from "highcharts/modules/accessibility";

// Initialize Highcharts modules

const ChartComponent = (props: any) => {
  const chartRef = useRef(null);
  const tableRef = useRef(null);
  // console.log("props", props.data.data);
  const [openTable, setOpenTable] = useState(false);
  const [openTableId, setOpenTableID] = useState<any>();
  const openTableForId = (id: any) => {
    setOpenTableID(id);
    setOpenTable(true);
  };
  const closeTableForId = (id: any) => {
    setOpenTableID(id);
    setOpenTable(false);
  };
  // function convertData(originalData:any) {
  //   console.log("data for conversion", originalData);
  //   const convertedData = {
  //     id: props.id,
  //     data: {
  //       title: originalData.title,
  //       data: originalData.data.map(([account, cost]:any) => ({
  //         account,
  //         cost,
  //       })),
  //       firstHeader: originalData.firstHeader,
  //       secondHeader: originalData.secondHeader,
  //     },
  //     height: originalData.height,
  //     legendEnabled: originalData.legendEnabled,
  //   };

  //   return convertedData;
  // }
  useEffect(() => {
    HighchartsExporting(Highcharts);
    HighchartsExportData(Highcharts);
    HighchartsAccessibility(Highcharts);
    HighchartsVariablePie(Highcharts);
    NoDataToDisplay(Highcharts);
  }, []);
  useEffect(() => {
    if (props?.data) {
      // const d = convertData(props.data);
      // console.log("converted data", d);
      const ids = props.id;
      console.log("data in pie", props.data);
      const firstHead = props && props.data && props.data.firstHeader;
      const secHead = props && props.data && props.data.secondHeader;
      const options: any = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          events: {
            fullscreenOpen: function () {
              (this as any).update({
                plotOptions: {
                  pie: {
                    size: "90%",
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                      enabled: true,
                      format: "{point.percentage:.1f} %",
                    },
                    showInLegend: true,
                  },
                },
              });
            },
            fullscreenClose: function () {
              (this as any).update({
                plotOptions: {
                  pie: {
                    size: props.height / 3 || "200px",
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                      enabled: true,
                      format: "{point.percentage:.1f} %",
                    },
                    showInLegend: true,
                  },
                },
              });
            },
          },
        },
        credits: {
          enabled: false,
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
        plotOptions: {
          pie: {
            size: props.height / 3 || "200px",
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "{point.percentage:.1f} %",
            },
            showInLegend: true,
            center: ["50%", "50%"],
            tooltip: {
              pointFormatter: function (this: Highcharts.Point): string {
                const chartTitle: any =
                  this?.series?.chart?.options?.title?.text;

                if (
                  ["Cost", "cost"].some((substring) =>
                    chartTitle.includes(substring)
                  ) ||
                  firstHead == "Cost(₹)" ||
                  firstHead == "Cost($)" ||
                  secHead == "Cost(₹)" ||
                  secHead == "Cost($)"
                ) {
                  return (
                    '<span style="color:' +
                    this.color +
                    '">\u25CF</span> ' +
                    this.name +
                    ": <b>" +
                    this.y?.toLocaleString("en-IN") +
                    "</b><br/>" +
                    this.percentage?.toFixed(1) +
                    "%" +
                    "</b><br/>"
                  );
                } else {
                  return (
                    '<span style="color:' +
                    this.color +
                    '">\u25CF</span> ' +
                    this.name +
                    ": <b>" +
                    this.y +
                    "</b><br/>" +
                    this.percentage?.toFixed(1) +
                    "%" +
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
        // tooltip: {
        //   headerFormat: "",
        //   pointFormat:
        //     '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        //     `Total: <b>{point.y} ({point.percentage:.1f}%) </b> ${
        //       props?.data?.xAxis || ""
        //     }<br/>`,
        // },
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
        series: [
          {
            type: "pie",
            minPointSize: 100,
            innerSize: "40%",
            zMin: 0,
            name: secHead, //this will come from api
            borderRadius: 0,
            colorByPoint: true,
            data: props?.data?.data || [],
          },
        ],
        exporting: {
          showTable: false,
          // buttons: {
          //   contextButton: {
          //     menuItems: [
          //       "downloadPNG",
          //       "downloadJPEG",
          //       "downloadPDF",
          //       "downloadSVG",
          //       "separator",
          //       "downloadXLS",
          //       "downloadCSV",
          //       {
          //         text: !openTable ? "View Data Table" : "HideDataTable", // Custom text for the menu item
          //         onclick: function () {
          //           !openTable
          //             ? openTableForId(props.id)
          //             : closeTableForId(props.id);
          //           // setOpenTable(true);
          //         },
          //       },
          //     ],
          //   },
          // },
          csv: {
            columnHeaderFormatter: function (item: any, key: any) {
              if (!item || item instanceof Highcharts.Axis) {
                return firstHead ? firstHead : ""; //this will be the column heading
              } else if (
                props?.data &&
                props?.data?.data &&
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

      Highcharts.chart("container-" + props.id, options);
    }
  }, [props.data, openTable, props.id]);
  const containerStyle = {
    height: props.height || "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div>
      <div id={"container-" + props.id} style={containerStyle} />
      <div ref={tableRef}>
        {/* only id needs different for each chart */}
        {/* {props.data && openTable && openTableId == props.id && (
          <table>
            <thead>
              <tr>
                <th>{props.data.firstHeader}</th>
                <th>{props.data.secondHeader}</th>
              </tr>
            </thead>
            <tbody>
              {props.data.data.map((row: any, index: any) => (
                <tr key={index}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )} */}
      </div>
    </div>
  );
};

export default ChartComponent;
