import Topology from "@/pages/Components/Topology/Topology";
import { addTableData, addTopologyData } from "@/pages/api/addTopology";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
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

  const saveTopology = async (e: any) => {
    // alert(process.env.NODE_ENV === 'development' ? process.env.REACT_APP_JSON_SERVER:'hi')
    async function dataFetch() {
      let flow: any;
      if (rfInstance) {
        flow = rfInstance.toObject();
        JSON.stringify(flow);
      }
      let topologyData = {
        bu_id: localStorage.getItem("bu_id"),
        flowChart: JSON.stringify(flow),
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
          <div className="flex flex-row justify-between px-2">
            <label htmlFor="">
              Topology Name :
              <input
                type="text"
                onChange={(e) => setTopologyTitle(e.target.value)}
                required
                className="border-slate-600 border-2 rounded ml-2 w-[10rem]"
              />
            </label>
            <label htmlFor="">
              Cloud :
              <select
                onChange={(e) => setCloud(e.target.value)}
                required
                className="border-slate-600 border-2 rounded ml-2 w-[10rem]"
              >
                <option value="" selected disabled>
                  Select Cloud
                </option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
              </select>
            </label>
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
