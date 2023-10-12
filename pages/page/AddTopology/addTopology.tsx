/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Topology from "@/pages/Components/Topology/Topology";
import {
  addResourseData,
  addTableData,
  addTopologyData,
} from "@/pages/api/addTopology";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { getUserData } from "@/pages/api/getUserData";
import { title } from "process";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
// import "/toastify-custom.css";
const addTopology = () => {
  const [loading, setLoading] = useState<any>(false);
  const [nextForm, setNextForm] = useState<any>(false);
  const [rfInstance, setRfInstance] = useState<any>(null);
  const [topologyTitle, setTopologyTitle] = useState<any>(null);
  const [businessSponser, setbusinessSponser] = useState<any>(null);
  const [serverOwner, setServerOwner] = useState<any>(null);
  const [applicationOwner, setApplicationOwner] = useState<any>(null);
  const [resourceOwner, setResourceOwner] = useState<any>(null);
  const [selectedClouds, setSelectedClouds] = useState<any>([]);
  const [allNodes, setAllNodes] = useState<any>(null);

  const [subcriptionId, setSubcriptionId] = useState<any>(null);
  const [vnet, setVnet] = useState<any>(null);
  const [CIDR, setCIDR] = useState<any>(null);
  const [subnet, setSubnet] = useState<any>(null);
  const [resourceGRP, setResourceGRP] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>(null);
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
    OS: "",
    Version: "",
    Publisher: "",
    License: "",
    OS_Disk_size: "",
    OS_Disk_Name: "",
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
  const router = useRouter();
  const [cloud, setCloud] = useState<any>(null);
  const [topology, setTopology] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<any>(false);
  const bothCloud = ["AWS", "Azure"];
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [redirectState, setRedirectState] = useState(false);
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
    setLoading(true);
    // alert(process.env.NODE_ENV === 'development' ? process.env.REACT_APP_JSON_SERVER:'hi')
    async function dataFetch() {
      if (
        topologyTitle &&
        businessSponser &&
        selectedClouds.length > 0 &&
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
        toast.success("Topology created successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return await addTopologyData(topologyData);
      } else
        toast.error("Please fill out all the fields!", {
          position: "bottom-right",
          autoClose: 3000,
        });
    }
    // await dataFetch();
    await dataFetch()
      .then(async (res: any) => {
        if (
          topologyTitle &&
          businessSponser &&
          selectedClouds.length > 0 &&
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
          setAllNodes(res.data[0].node_details[0]);
          setResponseData(res.data[0].id);

          console.log("topo data---------------", topologyTableData);

          await addTableData(topologyTableData);
        }
      })
      .then(async () => {
        let id = localStorage.getItem("bu_id");
        return await getUserData(id);
      })
      .then((res: any) => {
        let data = res.data[0];

        let sd = {
          ...serverData,
          subcriptionId: data.subcriptionId,
          vnet: data.vnet,
          CIDR: data.CIDR,
          Subnet: data.Subnet,
          ResourceGRP: data.ResourceGRP,
          Region: data.Region,
        };
        setServerData(sd);
      })
      .then(() => {
        if (
          topologyTitle &&
          businessSponser &&
          selectedClouds.length > 0 &&
          serverOwner &&
          applicationOwner &&
          resourceOwner &&
          selectedEnvironment
        ) {
          setNextForm(true);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  });

  function setData(e: any) {
    e.preventDefault();
    setLoading(true);
    let rdd = {
      topology_id: responseData,
      node_name: allNodes,
      fields: serverData,
    };
    console.log(rdd);
    if (
      serverData.Internet_facing &&
      serverData.NATting &&
      serverData.Description &&
      serverData.Series &&
      serverData.vCPUs &&
      serverData.RAM &&
      serverData.License &&
      serverData.OS_Disk_size &&
      serverData.Storage_Disk_Size &&
      serverData.Disk_partition &&
      serverData.Storage_Disk &&
      serverData.Compute_options &&
      serverData.OS_Disk_size
    ) {
      // console.log("storage",  serverData.Storage_Disk);
      // console.log("storage disk value",  serverData.Storage_Disk_Value);

      // console.log("compute",  serverData.Compute)
      // console.log("comptute option",  serverData.Compute_options);

      if (
        serverData.Storage_Disk == "yes" &&
        serverData.Storage_Disk_Value  &&
        serverData.Compute_options == "yes" &&
        serverData.Compute
      ) {
        saveResourseData(rdd);
      } else if (
        serverData.Storage_Disk == "no" &&
        serverData.Compute_options == "no"
      ) {
        saveResourseData(rdd);
      } else if (
        serverData.Storage_Disk == "yes" &&
        serverData.Storage_Disk_Value &&
        serverData.Compute_options == "no"
      ) {
        saveResourseData(rdd);
      } else if (
        serverData.Storage_Disk == "no" &&
        serverData.Compute_options == "no" &&
        serverData.Compute
      ) {
        saveResourseData(rdd);
      } else {
       
        setLoading(false);
        toast.error("Please enter all fields!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } else {
      setLoading(false);
      toast.error("Please enter all fields!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  }
  async function saveResourseData(data: any) {
    await addResourseData(data).then(() => {
      setLoading(false);
      // setRedirectState(true);
      router.push("/Components/Assets");
    });
  }

  return (
    <>
      <div className="text-xl px-4 border-b-2 border-slate-400 pb-2 flex items-center">
        <Link href="/Components/Assets">
          <ArrowBackIosIcon className="flex items-center h-full" />
        </Link>

        <span className="ml-2">Add Topology</span>
      </div>
      <div className="flex flex-row overflow-hidden w-full relative">
        <form
          className={!nextForm ? "relative overflow-hidden w-full" : "hidden"}
        >
          <div className={loading ? "loader" : "hidden"}></div>
          <ToastContainer />
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
                className="bg-red-700 text-white px-6 py-1 rounded "
              >
                Next
              </button>
            </div>
          </div>
        </form>
        {nextForm && (
          <form className={"overflow-hidden w-full z-10"}>
            <ToastContainer />
            <div className={loading ? "loader" : "hidden"}></div>
            <div className="mt-4 p-2 box-border w-full bg-white">
              <div className="form-inputs px-2 space-y-5">
                <div className="flex justify-evenly pt-4">
                  <h1 className="text-xl font-semibold border-b-2 border-slate-600">
                    Additional Info - {allNodes}
                  </h1>
                  {/* <div className="flex items-center pb-2">
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start mr-2"
                    >
                      Subscription Id :
                    </label>
                    <div className="font-semibold border-b-2 h-6 border-slate-600 bg-gray-200 px-1">
                      {serverData?.subcriptionId}
                    </div>
                  </div>
                  <div className="flex">
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start mr-2"
                    >
                      VNET :
                    </label>
                    <div className="font-semibold border-b-2 h-6 border-slate-600 bg-gray-200 px-1">
                      {serverData?.vnet}
                    </div>
                  </div> */}
                </div>

                {/* <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>CIDR :</div>
                    <input
                      type="text"
                      disabled
                      required
                      value={serverData?.CIDR}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Subnet :</div>
                    <input
                      type="text"
                      disabled
                      required
                      value={serverData?.Subnet}
                      className="w-[14rem]"
                    />
                  </label>
                  <label
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
                  </label>
                </div> */}

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
                  </label>
             
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Description :</div>
                    <textarea
                      className="w-[14rem] min-h-[1.7rem] h-[1.7rem]"
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
                    <div>License :</div>
                    <select
                      value={serverData?.License}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          License: e.target.value,
                        });
                      }}
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
                  {/* <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>VM type :</div>
                    <input
                      type="text"
                      required
                      value={serverData?.VM_type}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          VM_type: e.target.value,
                        });
                      }}
                      disabled={role == "admin" ? false : true}
                      className="w-[14rem]"
                    />
                  </label> */}
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Series :</div>
                    <input
                      type="text"
                      disabled={role == "admin" ? true : false}
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
                      disabled={role == "admin" ? true : false}
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
                      disabled={role == "admin" ? true : false}
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
                      value={serverData?.OS?JSON.stringify({"OS_version":serverData?.VM_type,"OS":serverData?.OS,"Version": serverData?.Version, "Publisher": serverData?.Publisher}):""}
                      onChange={(e) => {
                        let data = JSON.parse(e.target.value);
                        setServerData({
                          ...serverData,
                          OS_version: data.OS_version,
                          OS: data.OS,
                          Version: data.Version,
                          Publisher: data.Publisher
                        });
                      }}
                      className="w-[14rem]"
                    >
                      <option value="" disabled>
                        Select OS
                      </option>
                      <option value={JSON.stringify({"VM_type":"Ubuntu 20.04","OS":"Ubuntu", "Version":20.04,"Publisher":"Canonical"})}>Ubuntu 20.04</option>
                      <option value={JSON.stringify({"VM_type":"Ubuntu 18.04","OS":"Ubuntu", "Version":18.04,"Publisher":"Canonical"})}>Ubuntu 18.04</option>
                      <option value={JSON.stringify({"VM_type":"RHEL8.6","OS":"RHEL", "Version":8.6,"Publisher":"RedHat"})}>RHEL8.6</option>
                      <option value={JSON.stringify({"VM_type":"Windows2019","OS":"Windows", "Version":2019,"Publisher":"MicrosoftWindowsServer"})}>Windows2019</option>
                      <option value={JSON.stringify({"VM_type":"Centos7","OS":"Centos", "Version":7,"Publisher":"OpenLogic"})}>Centos7</option>
                    </select>
                  </label>
                </div>

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>OS Disk Name :</div>
                    <input
                      type="text"
                      value={serverData?.OS_Disk_Name}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          OS_Disk_Name: e.target.value,
                        });
                      }}
                      className="w-[14rem]"
                    />
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
                    <div>Compute options :</div>
                    <select
                      value={serverData?.Compute_options}
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
                      disabled={
                        serverData?.Compute_options == "no" ? true : false
                      }
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

                <div className="flex justify-around">
                  <label
                    htmlFor=""
                    className="font-semibold text-base flex flex-col justify-start"
                  >
                    <div>Data Disk :</div>
                    <select
                      value={serverData?.Storage_Disk}
                      onChange={(e) => {
                        setServerData({
                          ...serverData,
                          Storage_Disk: e.target.value,
                        });
                      }}
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
                    <div>Data Disk Name:</div>
                    <input
                      type="text"
                      value={serverData?.Storage_Disk_Value}
                      disabled={serverData?.Storage_Disk == "no" ? true : false}
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
                    <div>Data Disk Size :</div>
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
                      value={serverData?.Disk_partition}
                      className="w-[14rem] min-h-[1.7rem] h-[1.7rem]"
                    />
                  </label>
                </div>

              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  onClick={setData}
                  className="bg-red-700 text-white px-6 py-1 rounded "
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default addTopology;
