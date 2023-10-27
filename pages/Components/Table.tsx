import Link from "next/link";
import React from "react";
const Table = ({ data }: any) => {
    //   console.log("headers", data.headers);
    // console.log("data", data.data);
    return (
        <div>
            <div className="items-center pb-4 px-4">
                <label className="text-xl font-semibold">
                    Network Table
                </label>
                <div className="relative overflow-x-auto mt-6">
                    <table className="w-full text-sm text-center text-gray-800">
                        <thead className="text-xs text-white uppercase bg-red-800">
                            <tr>
                                {data?.headers?.map((header: any, index: any) => (
                                    <th className="px-auto py-3" key={index} scope="col">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((rowData: any, rowIndex: any) => (
                                <tr key={rowIndex}>
                                    {rowData.map((item: any, index: any) => (
                                        <td className="px-auto py-3" key={index}>
                                            {item[0] === "min" || item[0] === "max" || item[0] === "avg"
                                                ? item[1].toFixed(3)
                                                : item[1]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default Table;