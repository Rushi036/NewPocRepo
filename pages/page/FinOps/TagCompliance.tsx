import Table from '@/pages/Components/Table'
import React from 'react'
import PieChartComponent from "../../Components/Charts/PieChartDummy";

function TagCompliance() {
    const tableDummyData: any = {
        "title": "Account Name",
        "headers": ["sr no", "Application Name"],
        "data": [
            [
                ["sr_no", 1],
                ["application_name", "Big Data(NCR)"],
            ],
            [
                ["sr_no", 2],
                ["application_name", "Big Data Indore"],
            ],
            [
                ["sr_no", 3],
                ["application_name", "Big Data Engineering"],
            ],
            [
                ["sr_no", 4],
                ["application_name", "Cloud Pratice"],
            ],
            [
                ["sr_no", 5],
                ["application_name", "Data Science"],
            ],
            [
                ["sr_no", 6],
                ["application_name", "DevOps(Engineering)"],
            ]
        ]
    };
    const tableDummyData2: any = {
        "title": "AWS Athena Monthly Data",
        "headers": ["sr no", "Resource", "Cost($)"],
        "data": [
            [
                ["sr_no", 1],
                ["application_name", "Big Data(NCR)"],
                ["cost", 1231],
            ],
            [
                ["sr_no", 2],
                ["application_name", "Big Data Indore"],
                ["cost", 412],
            ],
            [
                ["sr_no", 3],
                ["application_name", "Big Data Engineering"],
                ["cost", 532],
            ],
            [
                ["sr_no", 4],
                ["application_name", "Cloud Pratice"],
                ["cost", 742],
            ],
            [
                ["sr_no", 5],
                ["application_name", "Data Science"],
                ["cost", 1312],
            ],
            [
                ["sr_no", 6],
                ["application_name", "DevOps(Engineering)"],
                ["cost", 9412],
            ]
        ]
    };
    const dummyData4: any = {
        "title": "",
        "data": [
            ["running", 125],
            ["terminated", 10],
            ["stopped", 3],
            ["shutting-down", 2]
        ]
    }
    return (
        <div className='flex'>
            <div className='flex flex-wrap w-[40%] mr-2 justify-between items-start h-fit'>
                <div className='bg-white rounded-lg w-[48%] h-[9rem] flex items-center justify-center flex-col'>
                    <span className='text-red-500 text-3xl leading-10'>678.67</span>
                    <span className='text-base'>Tagged</span>
                    <span className='text-base'>Cost($)</span>
                </div>
                <div className='bg-white rounded-lg w-[48%] h-[9rem] flex items-center justify-center flex-col'>
                    <span className='text-red-500 text-3xl leading-10'>12.42K</span>
                    <span className='text-base'>Untagged</span>
                    <span className='text-base'>Cost($)</span>
                </div>
                <div className='bg-white rounded-lg w-full mt-4 h-[26rem] p-4'>
                    <Table data={tableDummyData} />
                </div>
            </div>
            <div className='w-[60%] ml-2'>
                <div className='bg-white rounded-lg w-full flex flex-row'>
                    <div className='w-[40%] flex justify-center items-center'>
                        <table>
                            <thead>
                                <th className='bg-slate-400 border border-solid'>
                                    <td className='p-2 bg-red-700 text-white'>Usser Name Tags</td>
                                </th>
                            </thead>
                            <tbody>
                                <tr className='border border-solid'>
                                    <td className='p-2'>Department Tags</td>
                                </tr>
                                <tr className='border border-solid'>
                                    <td className='p-2'>Project Tags</td>
                                </tr>
                                <tr className='border border-solid'>
                                    <td className='p-2'>Business Unit Tags</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='w-[60%]'>
                        <PieChartComponent id={"new4"} data={dummyData4} />
                    </div>
                </div>
                <div className='bg-white rounded-lg w-full mt-4  p-4'>
                    <Table data={tableDummyData2} />
                </div>
            </div>
        </div>
    )
}

export default TagCompliance