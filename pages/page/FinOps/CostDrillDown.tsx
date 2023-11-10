import React, { useEffect, useState } from "react";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import fun, { useAppContext } from "../../Components/AppContext";
import "rsuite/dist/rsuite.min.css";
// import PieChartComponent from "../../Components/Charts/PieChart";
// import LineChartComponent from "../../Components/Charts/LineChart";
import { BsPinAngleFill, BsPinAngle, BsTable } from "react-icons/bs";
import { getSubscriptionIds } from "@/pages/api/FinopsApi/GetSubscriptionId";
import { getAllSubscriptions } from "@/pages/api/FinopsApi/GetAllSubscriptions";
import {
    getCurrentUserData,
    unpinGraphAPI,
} from "@/pages/api/FinopsApi/GetGraphFormat";
// import BarGraph from "@/pages/Components/Charts/BarChart";
// import Table from "@/pages/Components/Charts/Table";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
import Multiselect from "multiselect-react-dropdown";

const BarGraph = dynamic(() => import("@/pages/Components/Charts/BarChart"));
const Table = dynamic(() => import("@/pages/Components/Charts/Table"));
const PieChartComponent = dynamic(
    () => import("../../Components/Charts/PieChart")
);
const LineChartComponent = dynamic(
    () => import("../../Components/Charts/LineChart")
);

function CostDrillDown() {
    // const [url, setUrl] = useState<any>();
    // const [data, setData] = useState<any>(null);
    const { time, toggleTime } = useAppContext();
    const { timeEnd, toggleTimeEnd } = useAppContext();
    const [cloudDropdown, setCloudDropdown] = useState("Azure");
    const [cloud, setCloud] = useState(cloudDropdown);
    const [subACCName, setSubACCName] = useState();
    // const res: any = cloud == "Azure" ? AzureData : AWSData;
    const [res, setRes] = useState<any>(null);
    const [subData, setSubData] = useState<any>();
    const [subscIdDropdown, setSubscIdDropdown] = useState<any>();
    const [subscId, setSubscId] = useState<any>();
    const [isOpen, setIsOpen] = useState<any>(false);
    const [graphFormat, setGraphFormat] = useState<any>(null);
    const [userADID, setUserADID] = useState<any>(null); //this will populate from the session storage
    const [subsIndexName, setSubsIndexName] = useState<any>();
    const [loader, setLoader] = useState<any>(false);
    const [selectedReports, setSelectedReports] = useState<any>();
    const [subsType, setSubsType] = useState<any>();


    const [userRole, setUserRole] = useState<any>(null); //this will populate from the session storage
    const [value, setValue] = React.useState<any>([
        new Date(time),
        new Date(timeEnd),
    ]);
    const [titleValueCount, setTitleValueCount] = useState(0);

    async function getGraphFormat() {
        await getCurrentUserData().then((res) => setGraphFormat(res.data[0]));
    }

    useEffect(() => {
        setUserADID(sessionStorage.getItem("userEmail"));
        setUserRole(sessionStorage.getItem("userRole"));
        getGraphFormat();
    }, []);

    useEffect(() => {
        // Function to count the titles and values in Metric array
        const countTitleValues = () => {
            let count = 0;
            if (res && res.Metric) {
                count = res.Metric.reduce((total: any, metric: any) => {
                    if (metric && metric.title && metric.value) {
                        return total + 1;
                    }
                    return total;
                }, 0);
            }
            return count;
        };

        // Set the title and value count to the state
        setTitleValueCount(countTitleValues());
    }, [res]);
    // console.log("graph format",graphFormat)

    const handleSubNameChange = (e: any) => {
        const selectedSubAccName = e.target.value;
        setSubACCName(selectedSubAccName);
        const selectedSubAcc = subData.find(
            (item: any) => item.subsAccName === selectedSubAccName
        );
        if (selectedSubAcc) {
            setSubscIdDropdown(selectedSubAcc.subsAccId);
            setSubsIndexName(selectedSubAcc.subsIndexName);
            setSubsType(selectedSubAcc.subsType);
        } else {
            setSubscIdDropdown("");
        }
    };
    const handleCloudChange = (e: any) => {
        setCloudDropdown(e.target.value);
    };
    useEffect(() => {
        if (userRole == "BE") {
            callApi();
        } else if (userRole == "ADMIN") {
            getAllsubsData();
        }
    }, [cloudDropdown, userRole]);

    const callApi = async () => {
        //For BE
        await getSubscriptionIds(cloudDropdown, userADID).then((res: any) => {
            setSubData(res.data);
        });
    };

    const getAllsubsData = async () => {
        //For ADMIN
        await getAllSubscriptions(cloudDropdown).then((res: any) => {
            // console.info("res - ",res.data)
            if (res.data) {
                setSubData(res?.data);
                setSubACCName(res?.data[0]?.subsAccName);
                setSubscIdDropdown(res?.data[0]?.subsAccId);
                setSubsIndexName(res.data[0]?.subsIndexName);
                setSubsType(res.data[0].subsType);
            }
        });
    };

    useEffect(() => {
        value && toggleTime(value[0]);
        value && toggleTimeEnd(value[1]);
    }, [value]);

    // useEffect(() => {
    // }, [cloudDropdown, value, subsIndexName, subscId]);
    function getReport() {
        setLoader(true);
        setCloud(cloudDropdown);
        setSubscId(subscIdDropdown);
        if (cloudDropdown == "Azure") {
            let body = {
                gte: value[0],
                lte: value[1],
                subscription_name: [subACCName],
                type: subsType,
            };
            fetchDataAzure(body)
                .then((data) => setRes(data))
                .then(() => setLoader(false));
        } else {
            let body = {
                gte: value[0],
                lte: value[1],
                account_id: subscId,
                account_name: subsIndexName,
            };
            fetchDataAWS(body)
                .then((res) => {
                    return res.json();
                })
                .then((data) => setRes(data))
                .then(() => setLoader(false));
        }
    }

    async function fetchDataAzure(body: any) {
        let resData: any;
        try {
            resData = await fetch(
                "http://10.47.98.164:9201/AzureFinopsDashboardData",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );
            resData = await resData.json();
        } catch {
            resData = "";
        }
        return resData;
    }

    async function fetchDataAWS(body: any) {
        return await fetch("http://10.47.98.164:9201/awsFinopsDashboardData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }

    async function unpinGraph(title: any) {
        let chartOrder;
        if (cloudDropdown == "AWS") {
            let awsData = graphFormat?.chartOrder?.AWS;
            delete awsData?.[title];
            chartOrder = { AWS: awsData, Azure: graphFormat?.chartOrder?.Azure };
        }
        if (cloudDropdown == "Azure") {
            let azureData = graphFormat?.chartOrder?.Azure;
            delete azureData?.[title];
            chartOrder = { Azure: azureData, AWS: graphFormat?.chartOrder?.AWS };
        }
        let data = { ...graphFormat, chartOrder: chartOrder };
        await unpinGraphAPI(graphFormat?.id, data).then(getGraphFormat);
    }

    async function pinGraph(title: any) {
        let chartOrder;
        if (cloudDropdown == "AWS") {
            let awsData: any = graphFormat?.chartOrder?.AWS;
            awsData[title] = true;
            chartOrder = { AWS: awsData, Azure: graphFormat?.chartOrder?.Azure };
        }
        if (cloudDropdown == "Azure") {
            let azureData = graphFormat?.chartOrder?.Azure;
            azureData[title] = true;
            chartOrder = { Azure: azureData, AWS: graphFormat?.chartOrder?.AWS };
        }
        let data = { ...graphFormat, chartOrder: chartOrder };
        await unpinGraphAPI(graphFormat?.id, data).then(getGraphFormat);
    }
    return (
        <div className="flex  w-full">
            {loader && <div className="circle-loader"></div>}
            <div className=" w-[75%]">
                {res &&
                <div className="flex flex-wrap w-full gap-4">
                    {/* Conditional rendering based on titleValueCount */}
                    <div
                        className={
                            cloud === "Azure"
                                ? "bg-white p-4 w-[calc(50%-0.5rem)] rounded-lg"
                                : "bg-white p-4 w-[calc(25%-0.75rem)] rounded-lg"
                        }
                    >
                        <b>
                            Subscription Id <br />
                        </b>
                        <span>{subscId}</span>
                    </div>
                    {titleValueCount >= 1 && (
                        <div
                            className={
                                cloud === "Azure"
                                    ? "bg-white p-4 w-[calc(50%-0.5rem)] rounded-lg"
                                    : "bg-white p-4 w-[calc(25%-0.75rem)] rounded-lg"
                            }
                        >
                            <div>
                                <b>
                                    {res.Metric && res.Metric[0] && res.Metric[0].title} <br />
                                </b>
                                <span>
                                    {cloud === "Azure" ? "₹" : ""}
                                    {res.Metric && res.Metric[0] && res.Metric[0].value}
                                </span>
                            </div>

                            <span className="ml-auto">
                                {cloud === "Azure" ? (
                                    <button className="" onClick={() => setIsOpen(true)}>
                                        <ViewCompactIcon />
                                    </button>
                                ) : (
                                    ""
                                )}
                            </span>
                        </div>
                    )}
                    {titleValueCount >= 2 && (
                        <div
                            className={
                                cloud === "Azure"
                                    ? "bg-white p-4 w-[calc(50%-0.5rem)] rounded-lg"
                                    : "bg-white p-4 w-[calc(25%-0.75rem)] rounded-lg"
                            }
                        >
                            <b>
                                {res.Metric && res.Metric[1] && res.Metric[1].title} <br />
                            </b>
                            <span>
                                {cloud === "Azure" ? "₹" : "$"}
                                {res.Metric && res.Metric[1] && res.Metric[1].value}
                            </span>
                        </div>
                    )}

                    {titleValueCount === 3 && (
                        <div
                            className={
                                cloud === "Azure"
                                    ? "bg-white p-4 w-[calc(50%-0.5rem)] rounded-lg"
                                    : "bg-white p-4 w-[calc(25%-0.75rem)] rounded-lg"
                            }
                        >
                            <b>
                                {res.Metric && res.Metric[2] && res.Metric[2].title} <br />
                            </b>
                            <span>
                                {cloud === "Azure" ? "₹" : "$"}
                                {res.Metric && res.Metric[2] && res.Metric[2].value}
                            </span>
                        </div>
                    )}
                </div>
                }

                <div className="mt-4 h-auto flex flex-wrap gap-4">
                    {res &&
                        res.Graph?.map((e: any, i: any) => {
                            if (
                                e &&
                                e.PieChart &&
                                e.PieChart.data &&
                                Array.isArray(e.PieChart.data) &&
                                graphFormat?.chartOrder?.[cloud]?.[e.PieChart.title] &&
                                selectedReports.map((item: any) => item.key)?.includes(e.PieChart.title)
                            ) {
                                return (
                                    <div key={i} className="card w-1/2">
                                        <span
                                            className="flex justify-end cursor-pointer"
                                            onClick={() => unpinGraph(e.PieChart.title)}
                                        >
                                            <BsPinAngleFill />
                                        </span>
                                        <PieChartComponent id={i} data={e.PieChart} />
                                    </div>
                                );
                            } else if (
                                e &&
                                e.LineChart &&
                                e.LineChart.data &&
                                Array.isArray(e.LineChart.data) &&
                                graphFormat?.chartOrder?.[cloud]?.[e.LineChart.title] &&
                                selectedReports.map((item: any) => item.key)?.includes(e.LineChart.title)
                            ) {
                                return (
                                    <div
                                        key={i}
                                        className={
                                            e.LineChart.series?.data?.length >= 20
                                                ? "card !min-w-full"
                                                : "card"
                                        }
                                    >
                                        <span
                                            className="flex justify-end cursor-pointer"
                                            onClick={() => unpinGraph(e.LineChart.title)}
                                        >
                                            <BsPinAngleFill />
                                        </span>
                                        <LineChartComponent id={i} data={e.LineChart} />
                                    </div>
                                );
                            } else if (
                                e &&
                                e.BarGraph &&
                                e.BarGraph.data &&
                                Array.isArray(e.BarGraph.data) &&
                                graphFormat?.chartOrder?.[cloud]?.[e.BarGraph.title] &&
                                selectedReports.map((item: any) => item.key)?.includes(e.BarGraph.title)
                            ) {
                                return (
                                    <div
                                        key={i}
                                        className={
                                            e.BarGraph.data.length >= 8 ? "card !min-w-full" : "card"
                                        }
                                    >
                                        <span
                                            className="flex justify-end cursor-pointer"
                                            onClick={() => unpinGraph(e.BarGraph.title)}
                                        >
                                            <BsPinAngleFill />
                                        </span>
                                        <BarGraph id={i} date={value} data={e.BarGraph} />
                                    </div>
                                );
                            }
                        })}

                    {res &&
                        res.Graph?.map((e: any, i: any) => {
                            i;
                            if (
                                e &&
                                e.PieChart &&
                                e.PieChart.data &&
                                Array.isArray(e.PieChart.data) &&
                                !graphFormat.chartOrder?.[cloud]?.[e.PieChart.title] &&
                                selectedReports.map((item: any) => item.key)?.includes(e.PieChart.title)
                            ) {
                                return (
                                    <div key={i} className="card w-1/2">
                                        <span
                                            className="flex justify-end cursor-pointer"
                                            onClick={() => pinGraph(e.PieChart.title)}
                                        >
                                            <BsPinAngle />
                                        </span>
                                        <PieChartComponent id={i} data={e.PieChart} />
                                    </div>
                                );
                            } else if (
                                e &&
                                e.LineChart &&
                                e.LineChart.data &&
                                Array.isArray(e.LineChart.data) &&
                                !graphFormat.chartOrder?.[cloud]?.[e.LineChart.title] &&
                                selectedReports.map((item: any) => item.key)?.includes(e.LineChart.title)
                            ) {
                                return (
                                    <div
                                        key={i}
                                        className={
                                            e.LineChart.series?.data?.length >= 20
                                                ? "card !min-w-full"
                                                : "card"
                                        }
                                    >
                                        <span
                                            className="flex justify-end cursor-pointer"
                                            onClick={() => pinGraph(e.LineChart.title)}
                                        >
                                            <BsPinAngle />
                                        </span>
                                        <LineChartComponent id={i} data={e.LineChart} />
                                    </div>
                                );
                            } else if (
                                e &&
                                e.BarGraph &&
                                e.BarGraph.data &&
                                Array.isArray(e.BarGraph.data) &&
                                !graphFormat.chartOrder?.[cloud]?.[e.BarGraph.title] &&
                                selectedReports.map((item: any) => item.key)?.includes(e.BarGraph.title)
                            ) {
                                return (
                                    <div
                                        key={i}
                                        className={
                                            e.BarGraph.data.length >= 8 ? "card !min-w-full" : "card"
                                        }
                                    >
                                        <span
                                            className="flex justify-end cursor-pointer"
                                            onClick={() => pinGraph(e.BarGraph.title)}
                                        >
                                            <BsPinAngle />
                                        </span>
                                        <BarGraph id={i} date={value} data={e.BarGraph} />
                                    </div>
                                );
                            }
                        })}

                    {res &&
                        res.Table?.map((e: any, i: any) => {
                            return (
                                <>
                                    <div key={i} className="card">
                                        <Table data={e} />
                                    </div>
                                </>
                            );
                        })}
                    {isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-full max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="bg-red-800 px-4 py-2 flex items-center justify-between">
                                        <h3 className="text-xl text-white">
                                            Service wise cost for Each Subscription
                                        </h3>
                                        <button
                                            className="p-2 text-xl text-white"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <CloseIcon />
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="relative overflow-x-auto">
                                            <table className="w-full text-sm text-center text-gray-800">
                                                <thead className="text-xs uppercase bg-gray-200">
                                                    <tr>
                                                        <th scope="col" className="px-2 py-3">
                                                            Month
                                                        </th>
                                                        <th scope="col" className="px-2 py-3">
                                                            Application Name
                                                        </th>
                                                        <th scope="col" className="px-2 py-3">
                                                            Cost (₹)
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {res &&
                                                        res.Metric[1].Table[0].data.map(
                                                            (item: any, index: number) => (
                                                                <tr
                                                                    key={index}
                                                                    className="bg-white border-b text-center"
                                                                >
                                                                    <td className="px-2 py-3">{item[0][1]}</td>
                                                                    <td className="px-2 py-3">{item[1][1]}</td>
                                                                    <td className="px-2 py-3">{item[2][1]}</td>
                                                                </tr>
                                                            )
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* 
          {tableData.Table?.map((e: any, i: any) => {
            // <Table data={e} />
            <div>hi</div>
          })} */}
                </div>
            </div>

            <FinopsFilters
                handleCloudChange={handleCloudChange}
                handleSubNameChange={handleSubNameChange}
                cloud={cloud}
                cloudDropdown={cloudDropdown}
                subACCName={subACCName}
                subData={subData}
                value={value}
                setSelectedReports={setSelectedReports}
                setValue={setValue}
                getReport={getReport}
            />
        </div >
    );
}

function FinopsFilters({
    handleCloudChange,
    handleSubNameChange,
    cloud,
    cloudDropdown,
    subACCName,
    subData,
    value,
    setValue,
    getReport,
    setSelectedReports
}: any) {
    const predefinedRanges: any = [
        {
            label: "Last 1 hour",
            value: [
                new Date(moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],
            placement: "left",
        },
        {
            label: "Last 7 hour",
            value: [
                new Date(moment().subtract(7, "hour").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },

        {
            label: "Last day",

            value: [
                new Date(moment().subtract(1, "day").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },

        {
            label: "Last 7 days",

            value: [
                new Date(moment().subtract(7, "day").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },

        {
            label: "Last 15 days",

            value: [
                new Date(moment().subtract(15, "day").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },

        {
            label: "Last 30 days",

            value: [
                new Date(moment().subtract(30, "day").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },

        {
            label: "Last 90 days",

            value: [
                new Date(moment().subtract(90, "day").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },
        {
            label: "Last 120 days",

            value: [
                new Date(moment().subtract(120, "day").format("YYYY-MM-DDTHH:mm:ss")),
                new Date(moment().format("YYYY-MM-DDTHH:mm:ss")),
            ],

            placement: "left",
        },
    ];
    const { afterToday }: any = DateRangePicker;
    const titles: any = {
        "Azure": {
            graph: [
                "Resource Group Consumption",
                "Application Wise Cost Distribution ",
                "Average CPU Utilization(VM) ",
                "Average Memory Consumption(VM)",
                "Average Disk Read Bytes(VM)",
                "Average Disk Write Bytes(VM)",
                "Application Wise Resource Group Consumption",
                "Service wise cost for Each Application",
                " Application Wise Total Cost ",
                " Cost Trend Over Time",
                "Top Cost Drivers by Application ",
                "Data Usage By Application",
                "Data Usage By Subscription ",
                "Top Cost Drivers By Subscription ",
                "Cost Distribution By Service ",
                "Monthly VM Consumption",
                "Monthly Disk Consumption",
                "Monthly Others Services Consumption",
                "Monthly PAAS Consumption",
                "Data Allocation Tags",
            ],
            table: ["Cost Allocation Tags"],
        },
        "AWS": {
            graph: [
                "State Of Unique Instances",
                "Most Cost Consuming Services",
                "Data Usage By Application",
                "Data Cost By Application",
                "Top Cost Drivers by Account",
                "Total Unblended Cost Per Day",
                "Daily Average Unblended Cost Per Usage Type",
                "Cost Trend Over Time",
                "Data Usage By Account",
                "Devices With Lowest CPU Utilization",
                "Devices with Highest Network In Bytes",
                "Devices with Highest Network Out Bytes",
                "Data Allocation Tags",
                "Service wise cost for Each Account",
                "Monthly VM Consumption",
                "Monthly Disk Consumption",
                "Monthly Paas Consumption",
                "Monthly Consumption Other Services",
                "Application wise Total Cost",
                "Service wise cost for Each Application",
            ],
            table: [
                "Data Trends Over Time",
                "Data Show Back By Application",
                "Cost Allocation Tags",
            ],
        },
    };
    const [options, setOptions] = useState<any>();

    useEffect(() => {
        // console.log(cloudDropdown)
        let data: any = [];
        titles[cloudDropdown].graph.map((val: any) => {
            data.push({
                cat: "Graph",
                key: val,
            });
        });

        titles[cloudDropdown].table.map((val: any) => {
            data.push({
                cat: "Table",
                key: val,
            });
        });
        setOptions(data);

    }, [cloudDropdown])
    return (
        <div className="sticky top-0 w-[25%] h-fit flex flex-col justify-between items-center ml-4 mb-4 p-3 bg-white rounded-lg">
            <div className="w-full">
                <label className="">Select Cloud : </label>
                <select
                    className="block w-full py-2 px-4 border hover:bg-gray-50 focus:bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleCloudChange(e)}
                >
                    <option disabled>Select Cloud</option>
                    <option value="Azure">Azure</option>
                    <option value="AWS">AWS</option>
                </select>
            </div>
            <div className="w-full mx-2 mt-4">
                <label className="">
                    {cloud == "Azure"
                        ? "Select Subscription Name"
                        : "Select Account Name"}{" "}
                    :{" "}
                </label>
                <select
                    className="block w-full py-2 px-4 border hover:bg-gray-50 focus:bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    onChange={(e) => handleSubNameChange(e)}
                    value={subACCName}
                >
                    {/* subscription id or account id */}
                    <option>Select Id</option>
                    {subData &&
                        subData.map((e: any, i: any) => (
                            <option key={i} value={e.subsAccName}>
                                {e.subsAccName}
                            </option>
                        ))}
                </select>
            </div>
            <div className="w-full mx-2 mt-4 z-10">
                <label className="">Select Reports : </label>
                <Multiselect
                    displayValue="key"
                    groupBy="cat"
                    onKeyPressFn={function noRefCheck() { }}
                    onRemove={(val: any) => setSelectedReports(val)}
                    onSearch={function noRefCheck() { }}
                    onSelect={(val: any) => setSelectedReports(val)}
                    options={options}
                    // selectedValues={[options && options[0]?options[0]:{}, options && options[1]?options[1]:{}]}
                    showCheckbox
                />
            </div>
            <div className="w-full mt-4">
                <label className="">Select Date Range : </label>
                <DateRangePicker
                    placement="auto"
                    value={value}
                    onChange={setValue}
                    ranges={predefinedRanges}
                    // showOneCalendar
                    style={{ width: "100%" }}
                    shouldDisableDate={afterToday()}
                    placeholder="Select Date Range"
                    format="yyyy-MM-dd HH:mm:ss"
                    className="hover:bg-gray-50 focus:bg-gray-50"
                />
            </div>
            <div className="w-full mx-2 mt-4 flex justify-center">
                <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={getReport}
                >
                    Get Report
                </button>
            </div>
        </div>
    );
}

export default CostDrillDown;
