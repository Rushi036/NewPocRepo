import Link from "next/link";
import React, { useEffect, useState } from "react";

const Reports = () => {
    const [role, setRole] = useState<any>();
    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);
    return (
        <>
            <div className="text-xl border-b-2  border-slate-400 pb-2 px-4">
                Reports
            </div>

            <div className="flex flex-wrap mt-4 justify-start">
                <div className="w-[25%] h-[130px] mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-red-400 absolute left-0 top-0"></div>
                            <p className="text-red-400 font-bold text-lg">
                                Current Total Consumption
                            </p>
                            <div className="flex flex-col">
                                <span>₹12,345.00</span>
                                <span className="text-sm">Last Month’s</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-green-400 absolute left-0 top-0"></div>
                            <p className="text-green-500 font-bold text-lg">
                                Current Total Consumption
                            </p>

                            <div className="flex flex-col">
                                <span>₹12,345.00</span>
                                <span className="text-sm">Last Week’s</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-yellow-400 absolute left-0 top-0"></div>
                            <div className="w-[4px] h-full bg-blue-400 absolute left-0 top-0"></div>
                            <p className="text-blue-500 font-bold text-lg">
                                Cost Governance
                            </p>

                            <div className="flex flex-col">
                                <span className="">• Cost allocated</span>
                                <span className="">• spend/unallocated spend</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-pink-400 absolute left-0 top-0"></div>
                            <p className="text-pink-500 font-bold text-lg">
                                Total Asset
                            </p>

                            <div className="flex flex-row">
                                <span>1400</span>
                                <span className="">/1500</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-orange-400 absolute left-0 top-0"></div>
                            <p className="text-orange-500 font-bold text-lg">
                                Consumption Trend
                            </p>
                            <div className="flex flex-col  w-full mt-4">
                                {/* <span className="text-red-400">₹12,345.00</span> */}
                                {/* <span className="text-sm">Last Months</span> */}
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-purple-400 absolute left-0 top-0"></div>
                            <p className="text-purple-500 font-bold text-lg">
                                Cloud Gateway
                            </p>

                            <div className="flex flex-col  w-full mt-4">
                                <span>₹12,345.00</span>
                                <span className="text-sm">Last Month’s</span>
                                {/* <span className="text-purple-400 text-center text-xl">18</span> */}
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-rose-400 absolute left-0 top-0"></div>
                            <p className="text-rose-500 font-bold text-lg">
                                Forecast & Recommendation
                            </p>

                            <div className="flex flex-col  w-full mt-4">
                                {/* <span className="text-purple-400">₹12,345.00</span> */}
                                <span className="text-sm">Cloud wise</span>
                                {/* <span className="text-purple-400 text-center text-xl">18</span> */}
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-[25%] h-[130px] flex justify-center items-center mb-4">
                    <Link className="w-full flex justify-center items-center h-full" href={"/page/FinOps"}>
                        <div className="cursor-pointer hover:shadow-lg relative m-2 p-2 pl-4 bg-white rounded-lg w-full h-full flex gap-2 justify-start overflow-hidden items-start flex-col shadow-md">
                            <div className="w-[4px] h-full bg-yellow-300 absolute left-0 top-0"></div>
                            <p className="text-yellow-400 font-bold text-lg">
                            Managed Services Cost
                            </p>

                            <div className="flex flex-col  w-full mt-4">
                                <span>(12% of Consumption)</span>
                                {/* <span className="text-purple-400 text-center text-xl">18</span> */}
                            </div>
                        </div>
                    </Link>
                </div>

            </div>
        </>
    );
};

export default Reports;
