import { finopsServerBaseUrl } from "@/const";
import NTable from "@/pages/Components/Charts/NestedTable";
import Table from "@/pages/Components/Charts/Table";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Switch from "react-switch";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getCurrencyData, updateCurrencyData } from "@/pages/api/getCurrency";
import fun from "@/pages/Components/AppContext";
function CloudGateway() {
  // const cloudGatewayData = {
  //   title: "Cloud Gateway",
  //   headers: [
  //     "S No",
  //     "Business User",
  //     "Number of Services",
  //     "Total gateway charges",
  //   ],
  //   data: [
  //     [
  //       ["S no", "1"],
  //       ["Business User", "Birla Carbon"],
  //       ["Number of Services", 2],
  //       ["Total gateway charges", 5000],
  //       [
  //         "NestedTableData",
  //         {
  //           title: "Gateway Charges",
  //           headers: [
  //             "Service Name",
  //             "Unit Price",
  //             "Type of Service",
  //             "Total Cost",
  //           ],
  //           data: [
  //             [
  //               ["Service Name", "Cat1"],
  //               ["Unit Price", "1"],
  //               ["Type of Service", "internal"],
  //               ["Total Cost", "2500"],
  //             ],
  //             [
  //               ["Service Name", "Cat2"],
  //               ["Unit Price", "1"],
  //               ["Type of Service", "internal"],
  //               ["Total Cost", "2500"],
  //             ],
  //           ],
  //         },
  //       ],
  //     ],
  //     [
  //       ["S no", "2"],
  //       ["Business User", "UTCL"],
  //       ["Number of Services", 1],
  //       ["Total gateway charges", 2500],
  //       [
  //         "NestedTableData",
  //         {
  //           title: "Gateway Charges",
  //           headers: [
  //             "Service Name",
  //             "Unit Price",
  //             "Type of Service",
  //             "Total Cost",
  //           ],
  //           data: [
  //             [
  //               ["Service Name", "Cat1"],
  //               ["Unit Price", "1"],
  //               ["Type of Service", "internal"],
  //               ["Total Cost", "2500"],
  //             ],
  //           ],
  //         },
  //         ,
  //       ],
  //     ],
  //   ],
  // };
  // const serviceTypeCostData = {
  //   title: "Service Type Cost",
  //   headers: ["category", "aligned services", "unit measure", "status"],
  //   data: [
  //     [
  //       ["category ", "PaaS"],
  //       ["aligned services", 117580],
  //       ["unit measure", 1],
  //       ["status", "Enabled"],
  //     ],
  //     [
  //       ["category ", "VM"],
  //       ["aligned services", 4694],
  //       ["unit measure", 1],
  //       ["status", "Enabled"],
  //     ],
  //     [
  //       ["category ", "Disk"],
  //       ["aligned services", 574],
  //       ["unit measure", 0],
  //       ["status", "Enabled"],
  //     ],
  //     [
  //       ["category ", "Others"],
  //       ["aligned services", 7917],
  //       ["unit measure", 0],
  //       ["status", "Enabled"],
  //     ],
  //   ],
  // };
  // const zoneMappingData = {
  //   title: "Zone Mapping",
  //   headers: ["Zones", "Cost", "Type", "Status"],
  //   data: [
  //     [
  //       ["Zones ", "Cloud G/W Service DC"],
  //       ["Cost", 2500],
  //       ["Type", "Internal"],
  //       ["Status", "Enabled"],
  //     ],
  //     [
  //       ["Zones ", "Cloud G/W Service DB"],
  //       ["Cost", 2500],
  //       ["Type", "Internal"],
  //       ["Status", "Enabled"],
  //     ],
  //     [
  //       ["Zones ", "Cloud G/W Service App"],
  //       ["Cost", 2500],
  //       ["Type", "Internal"],
  //       ["Status", "Enabled"],
  //     ],
  //     [
  //       ["Zones ", "Cloud G/W Service User"],
  //       ["Cost", 2500],
  //       ["Type", "Internal"],
  //       ["Status", "Enabled"],
  //     ],
  //     [
  //       ["Zones ", "Cloud G/W Service DMZ"],
  //       ["Cost", 6000],
  //       ["Type", "External"],
  //       ["Status", "Enabled"],
  //     ],
  //   ],
  // };

  const [serviceTypeCostIsOpen, setServiceTypeCostIsOpen] =
    useState<any>(false);
  const [serviceTypeCostTableView, setServiceTypeCostTableView] =
    useState<any>(true);

  const [cloudGatewayData, setCloudGatewayData] = useState<any>();
  const [serviceTypeCostData, setServiceTypeCostData] = useState<any>();
  const [zoneMappingData, setZoneMappingData] = useState<any>();

  const [zoneMappingIsOpen, setZoneMappingIsOpen] = useState<any>(false);
  const [serviceTypeCostNestedRowOpen, setServiceTypeCostNestedRowOpen] =
    useState<any>();
  const [gatewayChargesNestedRowOpen, setGatewayChargesNestedRowOpen] =
    useState<any>(-1);
  const [zoneMappingTableView, setZoneMappingTableView] = useState<any>(true);
  const [currencyData, setCurrencyData] = useState<any>(true);
  const [userRole, setUserRole] = useState<any>(null); //this will populate from the session storage
  const [dataChanged, setDataChanged] = useState<any>(false);
  const [loader, setLoader] = useState<any>(false);
  useEffect(() => {
    setServiceTypeCostNestedRowOpen(-1);
  }, []);
  // console.log("filtered data", filteredData);
  useEffect(() => {
    setUserRole(sessionStorage.getItem("userRole"));
  }, []);

  useEffect(() => {
    setLoader(true);
    async function getData() {
      // fetchGatewayChargeData().then((res) => setCloudGatewayData(res));
      fetchServiceCategoryData().then((res) => setServiceTypeCostData(res));
      fetchZoneMappingData().then((res) => setZoneMappingData(res));
      getCurrencyData().then((res: any) => setCurrencyData(res.data));
    }

    getData().then(() => setLoader(false));
  }, []);
  // console.log("cloud gatewya data",cloudGatewayData)
  // async function fetchGatewayChargeData() {
  //   let resData: any;
  //   try {
  //     resData = await fetch(
  //       `${finopsServerBaseUrl}/AWSAndAzureDashBordChartsAPIGatewayCharge?role=ADMIN`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     resData = await resData.json();
  //   } catch {
  //     resData = "";
  //   }
  //   return resData;
  // }

  async function fetchServiceCategoryData() {
    let resData: any;
    try {
      resData = await fetch(`${finopsServerBaseUrl}/getServiceCategory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      resData = await resData.json();
    } catch {
      resData = "";
    }
    return resData;
  }

  async function fetchZoneMappingData() {
    let resData: any;
    try {
      resData = await fetch(`${finopsServerBaseUrl}/getZoneData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      resData = await resData.json();
    } catch {
      resData = "";
    }
    return resData;
  }

  function changeStatus(res: any) {
    setCurrencyData({ ...currencyData, status: res ? "Active" : "InActive" });
    setDataChanged(true)
  }
  function changeDollarValue(res: any) {
    setCurrencyData({ ...currencyData, dollar_value: res });
    setDataChanged(true)
  }

  function updateCurrencyValues(){
    updateCurrencyData(currencyData).then(()=> setDataChanged(false))
  }
  return (
    <>
      <div className="text-xl border-b-2 border-slate-400 pb-2">
        <Link href="/page/FinOps/reports">
          <ArrowBackIcon />
        </Link>
      </div>
      {loader && <div className="circle-loader"></div>}
      <div className="mt-4 finops-container h-auto flex  gap-4">
        <div className="flex flex-col gap-4 h-fit">
          {serviceTypeCostData && (
            <div className="card h-fit">
              <label className="text-sm font-semibold">
                {serviceTypeCostData.title ? serviceTypeCostData?.title : ""}
              </label>
              <table className="w-full text-sm text-center mt-2 text-gray-800">
                <thead className="text-[9px] text-white uppercase bg-red-800">
                  <tr>
                    {/* <th>SrNo</th> */}
                    {serviceTypeCostData.headers &&
                      serviceTypeCostData?.headers?.map(
                        (header: any, index: any) => (
                          <th className="px-auto py-1" key={index} scope="col">
                            {header}
                          </th>
                        )
                      )}
                  </tr>
                </thead>
                <tbody>
                  {serviceTypeCostData.data &&
                    serviceTypeCostData?.data?.map(
                      (rowData: any, rowIndex: any) => (
                        <>
                          <tr
                            key={rowIndex}
                            className={
                              serviceTypeCostNestedRowOpen == rowIndex
                                ? "bg-slate-100 "
                                : ""
                            }
                            onClick={() =>
                              setServiceTypeCostNestedRowOpen(
                                serviceTypeCostNestedRowOpen == rowIndex
                                  ? "-1"
                                  : rowIndex
                              )
                            }
                          >
                            {/* <td>{rowIndex + 1}</td> */}
                            {rowData.map((item: any, index: any) =>
                              item[0] != "NestedTableData" ? (
                                <td
                                  className={
                                    item[0] == "Status" || item[0] == "status"
                                      ? item[1] == "Enabled"
                                        ? "text-green-500"
                                        : "text-red-500"
                                      : "px-auto py-1"
                                  }
                                  key={index}
                                >
                                  {item[1]}
                                </td>
                              ) : (
                                ""
                              )
                            )}
                          </tr>
                          <tr key={rowIndex + 1000}>
                            {rowData.map((item: any, trindex: any) =>
                              item[0] == "NestedTableData" ? (
                                <td
                                  key={trindex + 1000}
                                  colSpan={100}
                                  className={
                                    serviceTypeCostNestedRowOpen != rowIndex
                                      ? "hidden"
                                      : ""
                                  }
                                >
                                  <table className="w-full">
                                    <thead className="bg-slate-300">
                                      <tr>
                                        {item[1]?.headers?.map(
                                          (data: any, thindex: any) => {
                                            return (
                                              <th key={thindex}>{data}</th>
                                            );
                                          }
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item[1]?.data?.map(
                                        (data: any, thindex: any) => {
                                          return (
                                            <tr key={thindex}>
                                              {data?.map(
                                                (row: any, index: any) => {
                                                  return (
                                                    <td key={index}>
                                                      {row[1]}
                                                    </td>
                                                  );
                                                }
                                              )}
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              ) : (
                                ""
                              )
                            )}
                          </tr>
                        </>
                      )
                    )}
                  {serviceTypeCostData?.data?.length == 0 ? (
                    <tr>
                      <td colSpan={100}>No data</td>
                    </tr>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
          )}

          {zoneMappingData && (
            <div className="card !h-fit">
              <label className="text-sm font-semibold">
                {zoneMappingData.title ? zoneMappingData?.title : ""}
              </label>
              <table className="w-full text-sm text-center mt-2 text-gray-800">
                <thead className="text-[9px] uppercase bg-red-800 text-white">
                  {/* <th>SrNo</th> */}
                  {zoneMappingData.headers &&
                    zoneMappingData?.headers?.map((header: any, index: any) => (
                      <th className="px-auto py-1" key={index} scope="col">
                        {header}
                      </th>
                    ))}
                </thead>
                <tbody>
                  {zoneMappingData.data &&
                    zoneMappingData?.data?.map(
                      (rowData: any, rowIndex: any) => (
                        <tr key={rowIndex}>
                          {/* <td>{rowIndex + 1}</td> */}
                          {rowData.map((item: any, index: any) => (
                            <td
                              className={
                                item[0] == "Status"
                                  ? item[1] == "Enabled"
                                    ? "text-green-500"
                                    : "text-red-500"
                                  : "px-auto py-1"
                              }
                              key={index}
                            >
                              {item[1]}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  {zoneMappingData.data &&
                  zoneMappingData?.data?.length == 0 ? (
                    <tr>
                      <td colSpan={100}>No data</td>
                    </tr>
                  ) : (
                    ""
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="!h-fit p-3 !w-fit bg-white rounded-lg">
          <label className="text-sm font-semibold">Currency Converter</label>
          <div className="flex mt-2 gap-4">
            <div>
              <label htmlFor="currencyValue">Dollar Rate :₹</label>
              <input
                className="border rounded p-1 pl-3 w-14"
                value={
                  currencyData?.dollar_value ? currencyData?.dollar_value : 0
                }
                onChange={(e: any) => {
                  changeDollarValue(e.target.value);
                }}
                type="number"
                name="currencyValue"
                id="currencyValue"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="currencyValue">Conversion :</label>
              <Switch
                onChange={(res: any) => {
                  changeStatus(res);
                }}
                checked={currencyData && currencyData.status && currencyData.status == "InActive" ? false : true}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={20}
                width={40}
              />
              {currencyData && currencyData.status && currencyData.status}
            </div>
          </div>
          {dataChanged && (
            <button onClick={updateCurrencyValues} className="bg-blue-600 text-white px-3 py-1 mt-2 rounded">
              Save
            </button>
          )}
        </div>

        {/* <div className="card">
          {cloudGatewayData  && <NTable data={cloudGatewayData} />}{" "}
        </div> */}

        {serviceTypeCostIsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-800 px-4 py-2 flex items-center justify-between">
                  <h3 className="text-xl text-white">
                    {serviceTypeCostData.title ? serviceTypeCostData.title : ""}
                  </h3>
                  <button
                    className="p-2 text-xl text-white"
                    onClick={() => {
                      setServiceTypeCostIsOpen(false);
                      setServiceTypeCostTableView(true);
                      setServiceTypeCostNestedRowOpen("-1");
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="p-4">
                  <div className="relative overflow-x-auto">
                    {serviceTypeCostTableView && (
                      <>
                        <button
                          className="btn mb-2 bg-blue-400 px-2 py-1 rounded-sm text-white font-medium"
                          onClick={() => setServiceTypeCostTableView(false)}
                        >
                          Add
                        </button>
                        <table className="w-full text-sm text-center text-gray-800">
                          <thead className="text-xs uppercase bg-gray-200">
                            {serviceTypeCostData.headers &&
                              serviceTypeCostData?.headers?.map(
                                (header: any, index: any) => (
                                  <th
                                    className="px-auto py-1"
                                    key={index}
                                    scope="col"
                                  >
                                    {header}
                                  </th>
                                )
                              )}
                          </thead>
                          <tbody>
                            {serviceTypeCostData.data &&
                              serviceTypeCostData?.data.map(
                                (rowData: any, rowIndex: any) => (
                                  <>
                                    <tr key={rowIndex}>
                                      <td>
                                        <button
                                          onClick={() =>
                                            setServiceTypeCostNestedRowOpen(
                                              serviceTypeCostNestedRowOpen ==
                                                rowIndex
                                                ? "-1"
                                                : rowIndex
                                            )
                                          }
                                        >
                                          {serviceTypeCostNestedRowOpen ==
                                          rowIndex
                                            ? "-"
                                            : "+"}
                                        </button>
                                      </td>
                                      {rowData.map((item: any, index: any) =>
                                        item[0] != "NestedTableData" ? (
                                          <td
                                            className="px-auto py-1"
                                            key={index}
                                          >
                                            {item[1]}
                                          </td>
                                        ) : (
                                          ""
                                        )
                                      )}
                                    </tr>
                                    <tr key={rowIndex}>
                                      {rowData.map((item: any, index: any) =>
                                        item[0] == "NestedTableData" ? (
                                          <td
                                            key={index}
                                            colSpan={100}
                                            className={
                                              serviceTypeCostNestedRowOpen !=
                                              rowIndex
                                                ? "hidden"
                                                : ""
                                            }
                                          >
                                            <table className="w-full">
                                              <thead>
                                                <th colSpan={100}>
                                                  <td>Service Type</td>
                                                </th>
                                              </thead>
                                              <tbody>
                                                {item[1].map(
                                                  (data: any, index: any) => (
                                                    <tr key={index}>
                                                      <td colSpan={100}>
                                                        {data}
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                              </tbody>
                                            </table>
                                          </td>
                                        ) : (
                                          ""
                                        )
                                      )}
                                    </tr>
                                  </>
                                )
                              )}
                            {serviceTypeCostData.data &&
                            serviceTypeCostData.data.length == 0 ? (
                              <tr>
                                <td colSpan={100}>No data</td>
                              </tr>
                            ) : (
                              ""
                            )}
                          </tbody>
                        </table>
                      </>
                    )}
                    {!serviceTypeCostTableView && (
                      <>
                        <button
                          className="btn mb-2 bg-blue-400 px-2 py-1 rounded-sm text-white font-medium"
                          onClick={() => setServiceTypeCostTableView(true)}
                        >
                          see table
                        </button>
                        <form action="" method="post">
                          <div className="flex flex-col">
                            <label htmlFor="">Service Type</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Service Type"
                            />
                            <label htmlFor="">Unit Measure</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Unit Measure"
                            />
                            <label htmlFor="">Status</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Status"
                            />
                            <button className="btn mb-2 bg-red-500 px-2 py-1 rounded-sm text-white font-medium">
                              Submit
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {zoneMappingIsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-800 px-4 py-2 flex items-center justify-between">
                  <h3 className="text-xl text-white">
                    {zoneMappingData.title}
                  </h3>
                  <button
                    className="p-2 text-xl text-white"
                    onClick={() => {
                      setZoneMappingIsOpen(false);
                      setZoneMappingTableView(true);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="p-4">
                  <div className="relative overflow-x-auto">
                    {zoneMappingTableView && (
                      <>
                        <button
                          className="btn mb-2 bg-blue-400 px-2 py-1 rounded-sm text-white font-medium"
                          onClick={() => setZoneMappingTableView(false)}
                        >
                          Add
                        </button>
                        <table className="w-full text-sm text-center text-gray-800">
                          <thead className="text-xs uppercase bg-gray-200">
                            {zoneMappingData?.headers?.map(
                              (header: any, index: any) => (
                                <th
                                  className="px-auto py-1"
                                  key={index}
                                  scope="col"
                                >
                                  {header}
                                </th>
                              )
                            )}
                          </thead>
                          <tbody>
                            {zoneMappingData?.data.map(
                              (rowData: any, rowIndex: any) => (
                                <tr key={rowIndex}>
                                  {rowData.map((item: any, index: any) => (
                                    <td className="px-auto py-1" key={index}>
                                      {item[1]}
                                    </td>
                                  ))}
                                </tr>
                              )
                            )}
                            {zoneMappingData.data.length == 0 ? (
                              <tr>
                                <td colSpan={100}>No data</td>
                              </tr>
                            ) : (
                              ""
                            )}
                          </tbody>
                        </table>
                      </>
                    )}
                    {!zoneMappingTableView && (
                      <>
                        <button
                          className="btn mb-2 bg-blue-400 px-2 py-1 rounded-sm text-white font-medium"
                          onClick={() => setZoneMappingTableView(true)}
                        >
                          see table
                        </button>
                        <form action="" method="post">
                          <div className="flex flex-col">
                            <label htmlFor="">Zone</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Zone"
                            />
                            <label htmlFor="">Cost</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Cost"
                            />
                            <label htmlFor="">Type</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Type"
                            />
                            <label htmlFor="">Status</label>
                            <input
                              type="text"
                              className="border mb-4 pl-2"
                              placeholder="Status"
                            />
                            <button className="btn mb-2 bg-red-500 px-2 py-1 rounded-sm text-white font-medium">
                              Submit
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CloudGateway;
