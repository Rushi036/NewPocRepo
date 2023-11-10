import BarGraph from "@/pages/Components/Charts/BarChart";
import LineChartComponent from "@/pages/Components/Charts/LineChart";
import PieChartComponent from "../../Components/Charts/PieChart";
import TabPanel from "@mui/lab/TabPanel/TabPanel";
import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import TabContext from "@mui/lab/TabContext/TabContext";

const CostSummary = () => {
    const dummyData1: any = {
        title: "Cost By Month",
        data: [
            {
                name: "Unblended Cost",
                data: [
                    ["Jun", 2687.2],
                    ["Jul", 2287.2],
                    ["Aug", 987.2],
                    ["Sep", 3083.57],
                    ["Oct", 1014.77],
                    ["Nov", 1287.2],
                ],
            },
        ],
        xAxis: "Month",
        yAxis: "cost($)",
    };
    const dummyData2: any = {
        title: "Cost By Service",
        type: "column",
        stacking: "false",
        categories: [
            "47239",
            "749203",
            "18209",
            "89232",
            "72893",
            "12891",
            "732901",
            "74293",
        ],
        data: [
            {
                name: "",
                data: [506, 132, 232, 234, 23, 42, 34, 323],
            },
        ],
        xAxis: "Account ID",
        yAxis: "Total Cost($)",
    };
    const dummyData3: any = {
        title: "Cost By Region",
        type: "column",
        stacking: "false",
        categories: [
            "EastUS",
            "CentralUS",
            "WestUS",
            "India",
            "SouthUS",
            "AllRegions",
        ],
        data: [
            {
                name: "",
                data: [15, 21, 32, 42, 5, 23],
            },
        ],
        xAxis: "Region",
        yAxis: "Cost($)",
    };
    const dummyData4: any = {
        title: "Cost Distribution",
        data: [
            ["running", 125],
            ["terminated", 10],
            ["stopped", 3],
            ["shutting-down", 2],
        ],
    };
    const dummyData5: any = {
        title: "Cost By Month",
        data: [
            {
                name: "Unblended Cost",
                data: [
                    ["Jun", 687.2],
                    ["Jul", 287.2],
                    ["Aug", 87.2],
                    ["Sep", 83.57],
                    ["Oct", 14.77],
                    ["Nov", 287.2],
                ],
            },
        ],
        xAxis: "Month",
        yAxis: "cost($)",
    };
    const dummyData6: any = {
        title: "Cost By Service",
        type: "column",
        stacking: "false",
        categories: [
            "47239",
            "749203",
            "18209",
            "89232",
            "72893",
            "12891",
            "732901",
            "74293",
        ],
        data: [
            {
                name: "",
                data: [1506, 1132, 1232, 2134, 123, 412, 314, 1323],
            },
        ],
        xAxis: "Account ID",
        yAxis: "Total Cost($)",
    };
    const dummyData7: any = {
        title: "Cost By Region",
        type: "column",
        stacking: "false",
        categories: [
            "EastUS",
            "CentralUS",
            "WestUS",
            "India",
            "SouthUS",
            "AllRegions",
        ],
        data: [
            {
                name: "",
                data: [215, 221, 232, 422, 52, 223],
            },
        ],
        xAxis: "Region",
        yAxis: "Cost($)",
    };
    const dummyData8: any = {
        title: "Cost Distribution",
        data: [
            ["running", 1525],
            ["terminated", 210],
            ["stopped", 36],
            ["shutting-down", 112],
        ],
    };
    const [cloudValue, setCloudValue] = useState("aws");

    const CloudChange = (event: React.SyntheticEvent, newValue: any) => {
        setCloudValue(newValue);
    };
    return (
        <>
            {false && <TabContext value={cloudValue}>
                <div className="cloud-tabs flex w-full h-full">
                    <div className=" mb-4 rounded-lg">
                        <Tabs
                            value={cloudValue}
                            onChange={CloudChange}
                            centered
                            orientation="vertical"
                            className=""
                        >
                            <Tab
                                value={"aws"}
                                label="AWS"
                                className="bg-white border border-[#D5C5EE] border-solid !text-black !rounded-lg !mb-4 !max-h-[5rem] !h-[5rem]"
                            />
                            <Tab
                                value={"azure"}
                                label="Azure"
                                className="border border-[#D5C5EE] bg-white border-solid !text-black !rounded-lg !mb-4 !max-h-[5rem] !h-[5rem]"
                            />
                            <Tab
                                value={"4"}
                                label="Default"
                                className="border border-[#D5C5EE] bg-white border-solid !text-black !rounded-lg !mb-4 !max-h-[5rem] !h-[5rem]"
                            />
                        </Tabs>
                    </div>
                    <div className="w-full">
                        <TabPanel value="aws">
                            <div className="w-full flex flex-wrap">
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <LineChartComponent id={"new1"} data={dummyData1} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <BarGraph id={"new2"} date={""} data={dummyData2} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <BarGraph id={"new3"} date={""} data={dummyData3} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <PieChartComponent id={"new4"} data={dummyData4} />
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="azure">
                            <div className="w-full flex flex-wrap">
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <LineChartComponent id={"new5"} data={dummyData5} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <BarGraph id={"new6"} date={""} data={dummyData6} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <BarGraph id={"new7"} date={""} data={dummyData7} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <PieChartComponent id={"new8"} data={dummyData8} />
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel value="4">
                            <div className="w-full flex flex-wrap">
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <LineChartComponent id={"new5"} data={dummyData1} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <BarGraph id={"new6"} date={""} data={dummyData2} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <BarGraph id={"new7"} date={""} data={dummyData3} />
                                    </div>
                                </div>
                                <div className="pl-4 mb-4 w-[50%]">
                                    <div className="bg-white p-4 rounded-lg h-full">
                                        <PieChartComponent id={"new8"} data={dummyData4} />
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </div>
                </div>
            </TabContext>}
            <div className="w-full h-[52vh] flex justify-center items-center text-4xl font-sans ">
                COMING SOON
            </div>
        </>
    );
};

export default CostSummary;
