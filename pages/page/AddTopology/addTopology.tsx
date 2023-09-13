import Topology from "@/pages/Components/Topology/Topology";
import { addTableData, addTopologyData } from "@/pages/api/addTopology";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
const addTopology = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rfInstance, setRfInstance] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topologyTitle, setTopologyTitle] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cloud, setCloud] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topology, setTopology] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);
  const [selectedClouds, setSelectedClouds] = useState<any>([]);
  const bothCloud = ["AWS", "Azure"];
  const handleCheckboxChange = (e: any) => {
    const value = e.target.value;
    if (selectedClouds.includes(value)) {
      setSelectedClouds(selectedClouds.filter((cloud: any) => cloud !== value));
    } else {
      setSelectedClouds([...selectedClouds, value]);
    }
  };
  const saveTopology = async (e: any) => {
    // e.preventDefault();
    // alert(process.env.NODE_ENV === 'development' ? process.env.REACT_APP_JSON_SERVER:'hi')
    async function dataFetch() {
      let flow: any;
      if (rfInstance) {
        flow = rfInstance.toObject();
      }
      let arr: any[] = []
      flow.nodes.map((data: any)=>{
        arr.push(data.data.Path.Name);
        // console.log()
      })
      flow = JSON.stringify(flow);
      let topologyData = {
        bu_id: localStorage.getItem("bu_id"),
        flowChart: flow,
        node_details: arr,
        title: topologyTitle,
        cloud_server: cloud,
      };

      // console.log(topologyData)
      return await addTopologyData(topologyData);
    }
    // await dataFetch();
    await dataFetch().then(async (res) => {
      const date = new Date().toLocaleDateString("en-GB");
      const topologyTableData = {
        title: topologyTitle,
        bu: localStorage.getItem("userName"),
        bu_id: localStorage.getItem("bu_id"),
        cloud_server: cloud,
        status: "Draft",
        created_date: date,
        topology_id: res.data[0].id,
      };
      await addTableData(topologyTableData);
    });
  };
  return (
    <>
      <form className="">
        <div className="text-xl px-4 border-b-2 border-slate-400 pb-2 flex items-center">
          <Link href="/Components/Assets">
            <ArrowBackIosIcon className="flex items-center h-full" />
          </Link>

          <span className="ml-2">Add Topology</span>
        </div>
        <div className="mt-4 p-2 box-border w-full bg-white">
          <div className=" px-2 space-y-3">
            <div className="flex">
              <label htmlFor="" className="font-semibold text-base">
                Topology Name :
                <input
                  type="text"
                  onChange={(e) => setTopologyTitle(e.target.value)}
                  required
                  className="border-slate-600 border-2 rounded ml-2 w-[10rem]"
                />
              </label>
              
              <label htmlFor="" className="font-semibold text-base">
                Business Name :
                <input
                  type="text"
                  onChange={(e) => setTopologyTitle(e.target.value)}
                  required
                  className="border-slate-600 border-2 rounded ml-2 w-[10rem]"
                />
              </label>
            </div>
            <div className="flex">
              <label className="font-semibold text-base">Cloud :</label>
              <div className="mx-3 flex space-x-4">
                <div className="space-x-1">
                  <input
                    name="checkbox1"
                    type="checkbox"
                    value="AWS"
                    onChange={handleCheckboxChange}
                    checked={selectedClouds.includes("AWS")}
                  />
                  <label htmlFor="checkbox1 " className="font-semibold">
                    AWS
                  </label>
                </div>
                <div className="space-x-1">
                  <input
                    name="checkbox2"
                    type="checkbox"
                    value="Azure"
                    onChange={handleCheckboxChange}
                    checked={selectedClouds.includes("Azure")}
                  />
                  <label htmlFor="checkbox2" className="font-semibold">
                    AZURE
                  </label>
                </div>
              </div>
              {/* <div>Selected Clouds: {selectedClouds.join(", ")}</div> */}
            </div>
          </div>
          <div className="relative overflow-hidden">
            <Topology setRfInstance={setRfInstance} editable={true} />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              onClick={saveTopology}
              className="bg-red-700 text-white px-6 py-2 rounded "
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default addTopology;
