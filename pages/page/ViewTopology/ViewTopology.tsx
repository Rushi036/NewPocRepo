/* eslint-disable react-hooks/rules-of-hooks */
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
import { getFormData, updateFormData } from "@/pages/api/getForData";
import { BiCloud } from "react-icons/bi";
const viewTopology = () => {
  const [rfInstance, setRfInstance] = useState<any>(null);
  const router = useRouter();
  const [title, setTitle] = useState<any>(null);
  const [cloud, setCloud] = useState<any>([]);
  const [topology, setTopology] = useState<any>(null);
  const { id } = router.query;
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
  let sd = {
    subcriptionId: "",
    vnet: "",
    CIDR: "",
    Subnet: "",
    ResourceGRP: "",
    Region: "",
    Description: "",
    VM_type: "",
    Series: "",
    vCPUs: "",
    RAM: "",
    OS_version: "",
    License: "",
    OS_Disk_size: "",
    Disk_partition: "",
    Storage_Disk_Size: "",
    Storage_Disk: "no",
    Storage_Disk_Value: "",
    Compute_options: "no",
    Compute: "",
    Internet_facing: "no",
    NATting: "no",
  };
  const [serverData, setServerData] = useState<any>(sd);
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);
  useEffect(() => {
    async function dataFetch() {
      let buId = localStorage.getItem("bu_id");
      let userRole = localStorage.getItem("role");
      userRole != "admin"
        ? await getTopologyData(buId, id).then((res) => {
          setTitle(res.data[0].title);
          setCloud(res.data[0].cloud_server);
          setTopology(res.data[0].flowChart);
          setTopoDetails(res.data[0].node_details);
          setApplicationOwner(res.data[0].application_owner);
          setResourceOwner(res.data[0].resource_owner);
          setSelectedEnvironment(res.data[0].selected_environment);
          setbusinessSponser(res.data[0].business_sponser);
          setServerOwner(res.data[0].server_owner);
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
          console.log("res", res.data[0]);
        });

      await getFormData(id).then((data: any) => {
        if (data.data[0]) {
          let res = data.data[0].fields;
          let sd = {
            subcriptionId: res.subcriptionId,
            vnet: res.vnet,
            CIDR: res.CIDR,
            Subnet: res.Subnet,
            ResourceGRP: res.ResourceGRP,
            Region: res.Region,
            Description: res.Description,
            VM_type: res.VM_type,
            Series: res.Series,
            vCPUs: res.vCPUs,
            RAM: res.RAM,
            OS_version: res.OS_version,
            License: res.License,
            OS_Disk_size: res.OS_Disk_size,
            Disk_partition: res.Disk_partition,
            Storage_Disk_Size: res.Storage_Disk_Size,
            Storage_Disk: res.Storage_Disk,
            Storage_Disk_Value: res.Storage_Disk_Value,
            Compute_options: res.Compute_options,
            Compute: res.Compute,
            Internet_facing: res.Internet_facing,
            NATting: res.NATting,
          };

          setServerData(sd);
          console.log(res);
        }
      });
    }

    id && dataFetch();
  }, [id]);

  const sendEstimationToUser = async (e: any) => {
    e.preventDefault();
    toggleEst();

    await getFormData(id).then(async (res: any) => {
      let rs = res.data[0];
      if (rs && serverData.VM_type) { //validation is not working
        let data = {
          ...rs,
          fields: serverData,
        };
        await updateFormData(rs.id, data);
      } else
        toast.error("Select the VM Type!", {
          position: "bottom-right",
          autoClose: 2000,
        });
    });
  };
  console.log(
    "-------------------estimatecalc--------------------",
    estimateCalc
  );
  //     // await fetchTopology;
  {
    cloud && console.log("cloud---", cloud);
  }
  return (
    <>
      <div className="">
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
            <div className="flex w-1/3 justify-start">
              <label htmlFor="" className="font-semibold">
                Topology Name :
              </label>
              <p className="border-b-2 border-slate-600 rounded-md px-2">
                {title}
              </p>
            </div>
            <div className="flex  w-1/3 justify-center">
              <label htmlFor="" className="font-semibold text-base w-28">
                Environment :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
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
            <div className="flex w-1/3 justify-end">
              <label htmlFor="" className="font-semibold text-base w-36">
                Application Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
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
            <div className="flex w-1/4 justify-start">
              <label htmlFor="" className="font-semibold text-base w-36">
                Business Sponsor :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
                {businessSponser}
              </div>
              {/* <input
                  type="text"
                  // onChange={(e) => setbusinessSponser(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2 w-1/2"
                /> */}
            </div>
            <div className="flex  w-1/4 justify-center">
              <label htmlFor="" className="font-semibold text-base w-28">
                Server Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
                {serverOwner}
              </div>
              {/* <input
                  type="text"
                  // onChange={(e) => setServerOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 ml-2 rounded w-1/2"
                /> */}
            </div>
            <div className="flex w-1/4 justify-center">
              <label htmlFor="" className="font-semibold text-base w-32">
                Resource Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
                {resourceOwner}
              </div>
              {/* <input
                  type="text"
                  // onChange={(e) => setResourceOwner(e.target.value)}
                  required
                  className="border-slate-600 border-b-2 rounded ml-2 w-1/2"
                /> */}
            </div>
            <div className="flex w-1/4 justify-end">
              <label htmlFor="" className="font-semibold">
                Cloud :
              </label>
              <p className="border-b-2 border-slate-600 rounded-md px-2">
              {/* {cloud && cloud.length > 1 ? (
                  <p>
                    {cloud[0]} {cloud[1]}
                  </p>
                ) : (
                  <p>{cloud}</p>
                )} */}
                {cloud && cloud.length > 1 ? (
                  <div>
                    {cloud[0]} & {cloud[1]}
                  </div>
                ) : (
                  <div>{cloud}</div>
                )}
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

          <form className={"overflow-hidden w-full z-10"}>
            {/* <div className={loading ? "loader" : "hidden"}></div> */}
            <div className="mt-4 p-2 box-border w-full bg-white">
              <div className="form-inputs px-2 space-y-5">
                <div className="flex justify-evenly pt-4">
                  <h1 className="text-xl font-semibold border-b-2 border-slate-600">
                    Additional Info - {allNodes}
                  </h1>
                  <div className="flex items-center pb-2">
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start mr-2"
                    >
                      Subscription Id :
                    </label>
                    <div className="font-semibold border-b-2 h-6 border-slate-600 bg-gray-100 px-1">
                      {serverData?.subcriptionId}
                    </div>
                    {/* <input
                      type="text"
                      required
                      disabled
                      value={serverData?.subcriptionId}
                      className="w-[20rem]"
                    /> */}
                  </div>
                  <div className="flex">
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start mr-2"
                    >
                      VNET :
                    </label>
                    {/* <input
                      type="text"
                      disabled
                      required
                      value={serverData?.vnet}
                      className="w-[14rem]"
                    /> */}
                    <div className="font-semibold border-b-2 h-6 border-slate-600 bg-gray-100 px-1">
                      {serverData?.vnet}
                    </div>
                  </div>
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>CIDR :</div>
                    <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                      {serverData?.CIDR}
                    </div>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Subnet :</div>
                    <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                      {serverData?.Subnet}
                    </div>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>ResourceGRP :</div>
                    <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                      {serverData?.ResourceGRP}
                    </div>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Region :</div>
                    <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                      {serverData?.Region}
                    </div>
                  </label>
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Internet facing :</div>
                    <select
                      value={serverData?.Internet_facing}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Internet_facing: e.target.value,
                        });
                      }}
                      disabled={true}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select Options
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>NATting :</div>
                    <select
                      value={serverData?.NATting}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          NATting: e.target.value,
                        });
                      }}
                      disabled={true}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select Options
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  {/* <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>ResourceGRP :</div>
                    <input
                      type="text"
                      disabled
                      required
                      value={serverData?.ResourceGRP}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Region :</div>
                    <input
                      type="text"
                      disabled
                      required
                      value={serverData?.Region}
                      className="w-[14rem]"
                    />
                  </label> */}
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Description :</div>
                    <textarea
                      className="w-[14rem] min-h-[1.7rem] h-[1.7rem]"
                      disabled={true}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Description: e.target.value,
                        });
                      }}
                      value={serverData?.Description}
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    {/* //validation is not working for vm type */}
                    <div>VM type :</div>
                    <select
                      required
                      value={serverData?.VM_type}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          VM_type: e.target.value,
                        });
                      }}
                      disabled={role === "admin" ? false : true}
                      className="w-[14rem]"
                      placeholder="Select VM Type"
                    >
                      <option disabled={true}>
                        Select VM Type
                      </option>
                      <option value="type1">Type 1</option>
                      <option value="type2">Type 2</option>
                      {/* Add more options as needed */}
                    </select>
                  </label>
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Series :</div>
                    <input
                      type="text"
                      disabled={true}
                      required
                      value={serverData?.Series}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Series: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>vCPUs :</div>
                    <input
                      type="text"
                      disabled={true}
                      required
                      value={serverData?.vCPUs}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          vCPUs: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>RAM :</div>
                    <input
                      type="text"
                      disabled={true}
                      required
                      value={serverData?.RAM}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          RAM: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>OS version :</div>
                    <select
                      value={serverData?.OS_version}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          OS_version: e.target.value,
                        });
                      }}
                      disabled={true}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select OS
                      </option>
                      <option value="Ubuntu 20.04">Ubuntu 20.04</option>
                      <option value="Ubuntu 18.04">Ubuntu 18.04</option>
                      <option value="RHEL8.6">RHEL8.6</option>
                      <option value="Windows2019">Windows2019</option>
                      <option value="Centos7">Centos7</option>
                    </select>
                  </label>
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>License :</div>
                    <select
                      value={serverData?.License}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          License: e.target.value,
                        });
                      }}
                      disabled={true}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select License
                      </option>
                      <option value="BYOL">BYOL</option>
                      <option value="Azure Hybrid Benefit">
                        Azure Hybrid Benefit
                      </option>
                    </select>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>OS Disk size :</div>
                    <input
                      type="text"
                      required
                      value={serverData?.OS_Disk_size}
                      disabled={true}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          OS_Disk_size: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Disk partition :</div>
                    <textarea
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Disk_partition: e.target.value,
                        });
                      }}
                      disabled={true}
                      value={serverData?.Disk_partition}
                      className="w-[14rem] min-h-[1.7rem] h-[1.7rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Storage Disk Size :</div>
                    <input
                      type="text"
                      required
                      value={serverData?.Storage_Disk_Size}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Storage_Disk_Size: e.target.value,
                        });
                      }}
                      disabled={true}
                      className="w-[14rem]"
                    />
                  </label>
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Storage Disk :</div>
                    <select
                      value={serverData?.Storage_Disk}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Storage_Disk: e.target.value,
                        });
                      }}
                      disabled={true}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select Disk
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Storage Disk Value:</div>
                    <input
                      type="text"
                      value={serverData?.Storage_Disk_Value}
                      disabled={true}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Storage_Disk_Value: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Compute options :</div>
                    <select
                      value={serverData?.Compute_options}
                      disabled={true}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Compute_options: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select Options
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Compute :</div>
                    <input
                      type="text"
                      value={serverData?.Compute}
                      disabled={true}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Compute: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
                  </label>
                </div>

                <div className="flex justify-center gap-[6.5rem]">
                  {/* <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Internet facing :</div>
                    <select
                      value={serverData?.Internet_facing}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Internet_facing: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select Options
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>NATting :</div>
                    <select
                      value={serverData?.NATting}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          NATting: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select Options
                      </option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </label> */}
                </div>
              </div>
            </div>
          </form>
          {/* </div> */}
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
      </div>
    </>
  );
};

export default viewTopology;
