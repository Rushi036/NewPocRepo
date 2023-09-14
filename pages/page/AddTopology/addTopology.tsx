import Topology from "@/pages/Components/Topology/Topology";
import { addTableData, addTopologyData } from "@/pages/api/addTopology";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { title } from "process";
const addTopology = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rfInstance, setRfInstance] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topologyTitle, setTopologyTitle] = useState<any>(null);
  const [businessSponser, setbusinessSponser] = useState<any>(null);
  const [serverOwner, setServerOwner] = useState<any>(null);
  const [applicationOwner, setApplicationOwner] = useState<any>(null);
  const [resourceOwner, setResourceOwner] = useState<any>(null);
  const [selectedClouds, setSelectedClouds] = useState<any>([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cloud, setCloud] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topology, setTopology] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);
  const bothCloud = ["AWS", "Azure"];
  const [selectedEnvironment, setSelectedEnvironment] = useState("");

  const handleEnvironmentChange = (e: any) => {
    setSelectedEnvironment(e.target.value);
  };
  const handleCheckboxChange = (e: any) => {
    const value = e.target.value;
    if (selectedClouds.includes(value)) {
      setSelectedClouds(selectedClouds.filter((cloud: any) => cloud !== value));
    } else {
      setSelectedClouds([...selectedClouds, value]);
    }
  };
  const saveTopology = async (e: any) => {
    e.preventDefault();
    // alert(process.env.NODE_ENV === 'development' ? process.env.REACT_APP_JSON_SERVER:'hi')
    async function dataFetch() {
      if (
        topologyTitle &&
        businessSponser &&
        selectedClouds &&
        serverOwner &&
        applicationOwner &&
        resourceOwner &&
        selectedEnvironment
      ) {
        let flow: any;
        if (rfInstance) {
          flow = rfInstance.toObject();
        }
        let arr: any[] = [];
        flow.nodes.map((data: any) => {
          arr.push(data.data.Path.Name);
          // console.log()
        });
        flow = JSON.stringify(flow);
        let topologyData = {
          bu_id: localStorage.getItem("bu_id"),
          flowChart: flow,
          node_details: arr,
          title: topologyTitle,
          cloud_server: selectedClouds,
          business_sponser: businessSponser,
          server_owner: serverOwner,
          application_owner: applicationOwner,
          resource_owner: resourceOwner,
          selected_environment: selectedEnvironment,
        };

        console.log("topo data---------------", topologyData);
        window.alert("Topology created successfully!");
        return await addTopologyData(topologyData);
      } else window.alert("Please fill out all the fields!");
    }
    // await dataFetch();
    await dataFetch().then(async (res: any) => {
      if (
        topologyTitle &&
        businessSponser &&
        selectedClouds &&
        serverOwner &&
        applicationOwner &&
        resourceOwner &&
        selectedEnvironment
      ) {
        const date = new Date().toLocaleDateString("en-GB");
        const topologyTableData = {
          title: topologyTitle,
          bu: localStorage.getItem("userName"),
          bu_id: localStorage.getItem("bu_id"),
          cloud_server: selectedClouds,
          status: "Draft",
          created_date: date,
          topology_id: res.data[0].id,
          business_sponser: businessSponser,
          server_owner: serverOwner,
          application_owner: applicationOwner,
          resource_owner: resourceOwner,
          selected_environment: selectedEnvironment,
        };
        console.log("topo data---------------", topologyTableData);

        await addTableData(topologyTableData);
      }
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
          <div className=" pl-4 space-y-5 pt-4">
            <div className="flex justify-around">
              <div className="flex w-2/6">
                <label htmlFor="" className="font-semibold text-base w-36">
                  Topology Name :
                </label>
                <input
                  type="text"
                  onChange={(e) => setTopologyTitle(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 ml-2 rounded w-1/2"
                />
              </div>
              <div className="flex w-2/6">
                <label htmlFor="" className="font-semibold text-base w-28">
                  Environment :
                </label>
                <select
                  onChange={handleEnvironmentChange}
                  value={selectedEnvironment}
                  required
                  className="border-slate-600 border-b-2 ml-2 rounded p-0.5 w-1/2"
                >
                  <option value="" disabled>
                    Select Environment
                  </option>
                  <option value="Production">Production</option>
                  <option value="Test">Test</option>
                  <option value="Development">Development</option>
                  <option value="UAT">UAT</option>
                </select>
              </div>
              <div className="flex w-2/6">
                <label htmlFor="" className="font-semibold text-base w-36">
                  Application Owner :
                </label>
                <input
                  type="text"
                  onChange={(e) => setApplicationOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2  w-1/2"
                />
              </div>
            </div>
            <div className="flex justify-around">
              <div className="flex w-2/6">
                <label htmlFor="" className="font-semibold text-base w-36">
                  Business Sponsor :
                </label>
                <input
                  type="text"
                  onChange={(e) => setbusinessSponser(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2 w-1/2"
                />
              </div>
              <div className="flex w-2/6">
                <label htmlFor="" className="font-semibold text-base w-28">
                  Server Owner :
                </label>
                <input
                  type="text"
                  onChange={(e) => setServerOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 ml-2 rounded w-1/2"
                />
              </div>
              <div className="flex w-2/6">
                <label htmlFor="" className="font-semibold text-base w-36">
                  Resource Owner :
                </label>
                <input
                  type="text"
                  onChange={(e) => setResourceOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2 w-1/2"
                />
              </div>
            </div>
            <div className=" flex justify-center">
              <div className="flex w-2/6">
                <label className="font-semibold text-base w-28">
                  Cloud Server :
                </label>
                <div className="mx-3 flex justify-around w-1/2 ">
                  <div className="space-x-1">
                    <input
                      name="checkbox1"
                      type="checkbox"
                      value="AWS"
                      required
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
              </div>
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
