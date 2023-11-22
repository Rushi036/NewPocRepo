import Table from "@/pages/Components/Charts/Table";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

function CloudGateway() {
  const tableDummyData = {
    title: "",
    headers: [
      "S No",
      "Business User",
      "Number of Services",
      "Total gateway charges",
      "Action",
    ],
    data: [
      [
        ["S no", "1"],
        ["Business User", "Birla Carbon"],
        ["Number of Services", 2],
        ["Total gateway charges", 2500],
        ["actionButtonViewTable", null],
      ],
    ],
  };
  const serviceTypeCostTableDummyData = {
    title: "Service Type Cost",
    headers: ["", "Category", "Aligned Services", "Unit Measure", "Status"],
    data: [
      [
        ["Category", "PaaS"],
        ["Aligned Services", "3"],
        ["Unit Measure", "1"],
        ["Status", "Enabled"],
        [
          "NestedTableData",
          [
            "Amazon DevOps Guru",
            "Amazon DynamoDB",
            "Amazon EC2 Container Registry (ECR)",
          ],
        ],
      ],
      [
        ["Category", "VM"],
        ["Aligned Services", "2"],
        ["Unit Measure", "0.5"],
        ["Status", "Enabled"],
        [
          "NestedTableData",
          [
            "Amazon Elastic Compute Cloud - Compute",
            "CentOS 7 with support by ProComputers",
          ],
        ],
      ],
      [
        ["Category", "Disk"],
        ["Aligned Services", "2"],
        ["Unit Measure", "0.25"],
        ["Status", "Enabled"],
        [
          "NestedTableData",
          ["Amazon Glacier", "Amazon Simple Storage Service"],
        ],
      ],
      [
        ["Category", "Others"],
        ["Aligned Services", "2"],
        ["Unit Measure", "0"],
        ["Status", "Enabled"],
        ["NestedTableData", ["AWS Amplify", "AWS Backup"]],
      ],
    ],
  };
  const [serviceTypeCostIsOpen, setServiceTypeCostIsOpen] =
    useState<any>(false);
  const [serviceTypeCostTableView, setServiceTypeCostTableView] =
    useState<any>(true);

  const zoneMappingTableDummyData = {
    title: "Zone Mapping",
    headers: ["Zones", "Cost", "Type", "Status"],
    data: [
      [
        ["Zones", "DC"],
        ["Cost", "2500"],
        ["Type", "Internal"],
        ["Status", "Enabled"],
      ],
      [
        ["Zones", "DB"],
        ["Cost", "2500"],
        ["Type", "Internal"],
        ["Status", "Enabled"],
      ],
      [
        ["Zones", "App"],
        ["Cost", "2500"],
        ["Type", "Internal"],
        ["Status", "Enabled"],
      ],
      [
        ["Zones", "User"],
        ["Cost", "2500"],
        ["Type", "Internal"],
        ["Status", "Enabled"],
      ],
      [
        ["Zones", "DMZ"],
        ["Cost", "6000"],
        ["Type", "External"],
        ["Status", "Enabled"],
      ],
    ],
  };
  const [zoneMappingIsOpen, setZoneMappingIsOpen] = useState<any>(false);
  const [nestedRowOpen, setNestedRowOpen] = useState<any>(-1);
  const [zoneMappingTableView, setZoneMappingTableView] = useState<any>(true);
  return (
    <>
      <div className="finops-container h-auto flex flex-col gap-4">
        <div className="text-xl border-b-2 px-4 border-slate-400 pb-2">
          CloudGateway
        </div>
        <div className="card !w-full">
          <button
            onClick={() => setServiceTypeCostIsOpen(true)}
            className="btn mb-2 mr-3 bg-blue-400 px-2 py-1 rounded-sm text-white font-medium"
          >
            service type cost
          </button>
          <button
            onClick={() => {
              setZoneMappingIsOpen(true);
            }}
            className="btn mb-2 bg-blue-400 px-2 py-1 rounded-sm text-white font-medium"
          >
            zone mapping
          </button>
          <Table data={tableDummyData} />
        </div>

        {serviceTypeCostIsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-800 px-4 py-2 flex items-center justify-between">
                  <h3 className="text-xl text-white">
                    {serviceTypeCostTableDummyData.title}
                  </h3>
                  <button
                    className="p-2 text-xl text-white"
                    onClick={() => {
                      setServiceTypeCostIsOpen(false);
                      setServiceTypeCostTableView(true);
                      setNestedRowOpen("-1")
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
                            {serviceTypeCostTableDummyData?.headers?.map(
                              (header: any, index: any) => (
                                <th
                                  className="px-auto py-3"
                                  key={index}
                                  scope="col"
                                >
                                  {header}
                                </th>
                              )
                            )}
                          </thead>
                          <tbody>
                            {serviceTypeCostTableDummyData?.data.map(
                              (rowData: any, rowIndex: any) => (
                                <>
                                  <tr key={rowIndex}>
                                    <td>
                                      <button onClick={() => setNestedRowOpen(nestedRowOpen == rowIndex?"-1":rowIndex)}>
                                        {nestedRowOpen == rowIndex?"-":"+"}
                                      </button>
                                    </td>
                                    {rowData.map((item: any, index: any) =>
                                      item[0] != "NestedTableData" ? (
                                        <td
                                          className="px-auto py-3"
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
                                          className={nestedRowOpen!=rowIndex?"hidden":""}
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
                            {serviceTypeCostTableDummyData.data.length == 0 ? (
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
                    {zoneMappingTableDummyData.title}
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
                            {zoneMappingTableDummyData?.headers?.map(
                              (header: any, index: any) => (
                                <th
                                  className="px-auto py-3"
                                  key={index}
                                  scope="col"
                                >
                                  {header}
                                </th>
                              )
                            )}
                          </thead>
                          <tbody>
                            {zoneMappingTableDummyData?.data.map(
                              (rowData: any, rowIndex: any) => (
                                <tr key={rowIndex}>
                                  {rowData.map((item: any, index: any) => (
                                    <td className="px-auto py-3" key={index}>
                                      {item[1]}
                                    </td>
                                  ))}
                                </tr>
                              )
                            )}
                            {zoneMappingTableDummyData.data.length == 0 ? (
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
