import Link from "next/link";
import React, { useEffect, useState } from "react";
const Table = ({ data }: any) => {
    const rowPerPage = 5;
    const totalRows = data?.data?.length;
    const totalPages = Math.ceil(totalRows / rowPerPage);
    const [page, setPage] = useState<any>(1)
    const currentData = data?.data?.slice((rowPerPage * page) - rowPerPage, rowPerPage * page)
    useEffect(()=>{
        setPage(1)
    },[data?.data])
    return (
        <div>
            <div className="items-center pb-4 px-4">
                <label className="text-xl font-semibold">
                    {data?.title ? data?.title : "Table"}
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
                            {currentData?.map((rowData: any, rowIndex: any) => (
                                <tr key={rowIndex}>
                                    {rowData.map((item: any, index: any) => (
                                        <td className="px-auto py-3" key={index}>
                                            {item[1]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="table-pagination w-full flex items-center justify-end gap-2">
                        <button onClick={() => setPage(page - 1)} className="py-1 px-2 rounded border disabled:text-slate-400" disabled={page == 1 ? true : false}>Previous</button>
                        {/* {totalPages && new Array(totalPages).fill(null).map((_: null, index: number) => <button onClick={() => setPage(index + 1)} className={page == index+1?"bg-red-500 py-1 px-2 border text-white rounded disabled:text-slate-400": "py-1 px-2 text-black rounded"} key={index}>{index + 1}</button>)} */}
                        <button onClick={() => setPage(page + 1)} className="py-1 px-2 rounded border disabled:text-slate-400" disabled={page >= totalPages ? true : false}>Next</button>
                        <div>page: {page} / {totalPages}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Table;