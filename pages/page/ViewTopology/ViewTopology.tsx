// import Topology from "@/pages/Components/TopologyView/Topology";
// import { addTableData, addTopologyData } from '@/pages/api/addTopology';
import { getTopologyData } from "@/pages/api/viewTopology";
import { viewTopologyForAdmin } from "@/pages/api/viewTopologyForAdmin";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import Topology from "@/pages/Components/TopologyView/Topology";
import { getOldData, sendEstimation } from "@/pages/api/sendEstimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "@/pages/Components/AppContext";
const viewTopology = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rfInstance, setRfInstance] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [title, setTitle] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cloud, setCloud] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topology, setTopology] = useState<any>(null);
  const { id } = router.query;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [role, setRole] = useState<any>();
  const [topoDetails, setTopoDetails] = useState<any>([]);
  const [businessSponser, setbusinessSponser] = useState<any>(null);
  const [serverOwner, setServerOwner] = useState<any>(null);
  const [applicationOwner, setApplicationOwner] = useState<any>(null);
  const [resourceOwner, setResourceOwner] = useState<any>(null);
  const [selectedClouds, setSelectedClouds] = useState<any>([]);
  const [allNodes, setAllNodes] = useState<any>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const { estimateCalc, toggleEstimateCalc } = useAppContext();
  const toggleEst = () => {
    toggleEstimateCalc();
  };
  //  eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  });
  //  eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function dataFetch() {
      let buId = localStorage.getItem("bu_id");
      let userRole = localStorage.getItem("role");
      userRole != "admin"
        ? await getTopologyData(buId, id).then((res) => {
            setTitle(res.data[0].title);
            setCloud(res.data[0].cloud_server);
            setTopology(res.data[0].flowChart);
          })
        : await viewTopologyForAdmin(id).then((res) => {
            setTitle(res.data[0].title);
            setCloud(res.data[0].cloud_server);
            setTopology(res.data[0].flowChart);
            setTopoDetails(res.data[0].node_details);
            setApplicationOwner(res.data[0].application_owner);
            setResourceOwner(res.data[0].resource_owner);
            setSelectedEnvironment(res.data[0].selected_environment);
            setbusinessSponser(res.data[0].business_sponser);
            setServerOwner(res.data[0].server_owner);
            // console.log("res", res.data[0]);
          });
    }

    id && dataFetch();
  }, [id]);

  const sendEstimationToUser = async (e: any) => {
    e.preventDefault();
    toggleEst();
    // await getOldData(id).then(async (res) => {
    //   let data = res.data[0];
    //   data = {
    //     ...data,
    //     status: "Approval Pending",
    //   };
    //   await sendEstimation(data.id, data).then(() => {
    //     toast.success("Estimation sent successfully!", {
    //       position: "bottom-right",
    //       autoClose: 3000,
    //     });
    //   });
    // });
  };
    console.log("-------------------estimatecalc--------------------",estimateCalc)
  //     // await fetchTopology;
  return (
    <>
      <form className="">
        <div className="flex text-xl px-4 border-b-2 border-slate-400 pb-2 items-center">
          {role != "admin" ? (
            <Link href="/Components/Assets">
              <ArrowBackIosIcon className="flex items-center h-full" />
            </Link>
          ) : (
            <Link href="/Components/AssetsForAdmin">
              <ArrowBackIosIcon className="flex items-center h-full" />
            </Link>
          )}

          <span className="ml-2">View Topology</span>
        </div>
        <ToastContainer />
        <div className="mt-4 p-2 box-border w-full bg-white">
          <div className="flex justify-evenly px-4 pt-4">
            <div className="flex">
              <label htmlFor="" className="font-semibold">
                Topology Name :
              </label>
              <p className="border-b-2 border-slate-600 rounded-md ml-2">
                {title}
              </p>
            </div>
            <div className="flex">
              <label htmlFor="" className="font-semibold text-base w-28">
                Environment :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md ml-2">
                {selectedEnvironment}
              </div>
              {/* <select
                // onChange={handleEnvironmentChange}
                value={selectedEnvironment}
                required
                className="border-slate-600 border-b-2 ml-2 rounded p-0.5 w-1/2"
              > */}
              {/* <option value="" disabled>
                  Select Environment
                </option>
                <option value="Production">Production</option>
                <option value="Test">Test</option>
                <option value="Development">Development</option>
                <option value="UAT">UAT</option> */}
              {/* </select> */}
            </div>
            <div className="flex w-2/6">
              <label htmlFor="" className="font-semibold text-base w-36">
                Application Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md ml-2">
                {applicationOwner}
              </div>
              {/* <input
                type="text"
                // onChange={(e) => setApplicationOwner(e.target.value)}
                required
                className="border-slate-600 border-b-2 rounded ml-2  w-1/2"
              /> */}
            </div>
          </div>

          <div className="flex  justify-evenly px-4 pt-4">
            <div className="flex">
              <label htmlFor="" className="font-semibold text-base w-36">
                Business Sponsor :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md ml-2">
                {businessSponser}
              </div>
              {/* <input
                  type="text"
                  // onChange={(e) => setbusinessSponser(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2 w-1/2"
                /> */}
            </div>
            <div className="flex">
              <label htmlFor="" className="font-semibold text-base w-28">
                Server Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md ml-2">
                {serverOwner}
              </div>
              {/* <input
                  type="text"
                  // onChange={(e) => setServerOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 ml-2 rounded w-1/2"
                /> */}
            </div>
            <div className="flex">
              <label htmlFor="" className="font-semibold text-base w-36">
                Resource Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md ml-2">
                {serverOwner}
              </div>
              {/* <input
                  type="text"
                  // onChange={(e) => setResourceOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2 w-1/2"
                /> */}
            </div>
            <div className="flex">
              <label htmlFor="" className="font-semibold">
                Cloud :
              </label>
              <p className="border-b-2 border-slate-600 rounded-md ml-2">
                {/* {cloud && cloud.length > 1 ? (
                  <p>
                    {cloud[0]} {cloud[1]}
                  </p>
                ) : (
                  <p>{cloud}</p>
                )} */}
                <div>{cloud}</div>
              </p>
            </div>
          </div>
          <div className="relative overflow-hidden">
            {topology && (
              <Topology
                // <Topology
                editable={false}
                topology={topology}
                setRfInstance={setRfInstance}
              />
            )}
          </div>
          {role == "admin" && (
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-red-700 text-white px-6 py-1 rounded "
                onClick={sendEstimationToUser}
              >
                Send Estimation
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default viewTopology;
