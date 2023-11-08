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
import { fetchestimation } from "@/pages/api/fetchEstimation";
import { getUserData } from "@/pages/api/getUserData";

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
  const [topoStatus, setTopoStatus] = useState<any>();
  const [buIdOfUser, setBuIdOfUser] = useState<any>();
  const [bu, setBu] = useState<any>();
  const vm_types: any = {
    Azure: ["t2.micro", "t2.medium", "t2.2xlarge", "m4.xlarge"],
    AWS: [
      "Standard_B2s",
      "Standard_B2ms",
      "Standard_B1s",
      "Standard_D12_v2",
      "Standard_DS3_v2",
    ],
  };
  const toggleEst = () => {
    toggleEstimateCalc();
  };
  let sd = {
    Description: "",
    VM_type: "type1",
    Series: "",
    vCPUs: "",
    RAM: "",
    OS_version: "",
    License: "",
    OS_Disk_size: "",
    OS_Disk_Name: "",
    Disk_partition: "",
    Storage_Disk_Size: "",
    Storage_Disk: "",
    Storage_Disk_Value: "",
    Compute_options: "",
    Compute: "",
    Internet_facing: "",
    NATting: "",
  };
  const [serverData, setServerData] = useState<any>(sd);

  useEffect(() => {
    setRole(sessionStorage.getItem("userRole"));
  }, []);

  useEffect(() => {
    async function dataFetch() {
      let buId = sessionStorage.getItem("bu_id");
      let userRole = sessionStorage.getItem("userRole");
      userRole != "ADMIN"
        ? await getTopologyData(buId, id).then((res) => {
            if (res && res.data[0]) {
              setTitle(res.data[0].title);
              setCloud(res.data[0].cloud_server);
              setTopology(res.data[0].flowChart);
              setTopoDetails(res.data[0].node_details);
              setApplicationOwner(res.data[0].application_owner);
              setResourceOwner(res.data[0].resource_owner);
              setSelectedEnvironment(res.data[0].selected_environment);
              setbusinessSponser(res.data[0].business_sponser);
              setServerOwner(res.data[0].server_owner);
            }
          })
        : await viewTopologyForAdmin(id).then((res) => {
            if (res && res.data[0]) {
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
            }
          });

      await getFormData(id).then((data: any) => {
        if (data.data[0]) {
          let res = data.data[0].fields;
          let sd = {
            // subcriptionId: res.subcriptionId,
            // vnet: res.vnet,
            // CIDR: res.CIDR,
            // Subnet: res.Subnet,
            // ResourceGRP: res.ResourceGRP,
            // Region: res.Region,
            Description: res.Description,
            VM_type: res.VM_type,
            Series: res.Series,
            vCPUs: res.vCPUs,
            RAM: res.RAM,
            OS_version: res.OS_version,
            OS: res.OS,
            Version: res.Version,
            Publisher: res.Publisher,
            License: res.License,
            OS_Disk_size: res.OS_Disk_size,
            OS_Disk_Name: res.OS_Disk_Name,
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
          // console.log(res);
        }
      });
    }

    id && dataFetch();
  }, [id]);

  useEffect(() => {
    async function topoDataFetch() {
      let buId = sessionStorage.getItem("bu_id");
      // let buIdOfUser;
      await fetchestimation(id).then((res) => {
        if (res && res.data[0]) {
          // console.log("topology data", res.data[0]);
          setTopoStatus(res.data[0].status);
          setBuIdOfUser(res.data[0].bu_id);
          setBu(res.data[0].bu);
          // buIdOfUser = res.data[0].bu_id;
        }
      });
      if (role != "ADMIN") {
        await getUserData(buId).then((res) => {
          // console.log("userData",res)
          if (res && res.data[0]) {
            let userData = {
              subscriptionIDAws: res.data[0].AWS_subcriptionId,
              vpcAws: res.data[0].AWS_VPC,
              CIDRAws: res.data[0].AWS_CIDR,
              SubnetAws: res.data[0].AWS_Subnet,
              ResourceGRPAws: res.data[0].AWS_ResourceGRP,
              RegionAws: res.data[0].AWS_Region,
              subscriptionIDAzure: res.data[0].Azure_subcriptionId,
              vnetAzure: res.data[0].Azure_vnet,
              CIDRAzure: res.data[0].Azure_CIDR,
              SubnetAzure: res.data[0].Azure_Subnet,
              ResourceGRPAzure: res.data[0].Azure_ResourceGRP,
              RegionAzure: res.data[0].Azure_Region,
            };
            setServerData((prevServerData: any) => ({
              ...prevServerData,
              ...userData,
            }));
          }
        });
      } else {
        await getUserData(buIdOfUser).then((res) => {
          // console.log("userData",res)
          if (res && res.data[0]) {
            let userData = {
              subscriptionIDAws: res.data[0].AWS_subcriptionId,
              vpcAws: res.data[0].AWS_VPC,
              CIDRAws: res.data[0].AWS_CIDR,
              SubnetAws: res.data[0].AWS_Subnet,
              ResourceGRPAws: res.data[0].AWS_ResourceGRP,
              RegionAws: res.data[0].AWS_Region,
              subscriptionIDAzure: res.data[0].Azure_subcriptionId,
              vnetAzure: res.data[0].Azure_vnet,
              CIDRAzure: res.data[0].Azure_CIDR,
              SubnetAzure: res.data[0].Azure_Subnet,
              ResourceGRPAzure: res.data[0].Azure_ResourceGRP,
              RegionAzure: res.data[0].Azure_Region,
            };
            setServerData((prevServerData: any) => ({
              ...prevServerData,
              ...userData,
            }));
          }
        });
      }
    }
    topoDataFetch();
  }, [id, buIdOfUser]);

  const sendEstimationToUser = async (e: any) => {
    e.preventDefault();
    toggleEst();

    await getFormData(id).then(async (res: any) => {
      let rs = res.data[0];
      if (rs && serverData.VM_type) {
        //validation is not working
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

  function sendAutomation(e: any) {
    e.preventDefault();
    let data: any;
    const imageId: any = {
      "Ubuntu 20.04": "ami-051c327686af3f780",
      "Ubuntu 18.04": "ami-019fa3af48e40143a",
      "RHEL8.6": "ami-0b8b26e328a0e983d",
      Windows2019: "ami-09e5ba61a58b68ed4",
      Centos7: "ami-8d5073e2",
    };
    if (cloud == "AWS") {
      data = {
        bussiess_name: bu,
        cloud: "AWS",
        ResourceType: "APP", // APP, A
        appname: "AUTO", //pending
        key_name: "bmcspl-mumbai", //pending
        Environment: "T",
        instance_type: serverData.VM_type,
        image_id: imageId[serverData.OS_version], //(As per OS)
        vpc_subnet_id: serverData?.SubnetAws,
        region: serverData?.RegionAws,
        security_group: "sg-00077de1b13e2e800", //pending
        Work_Order_ID: "", //blank
        Application_Owner: applicationOwner,
        Application_name: title,
        Business: "ABCL", //pending
        Environment_tag: "Test",
        osdisk_name: serverData?.OS_Disk_Name,
        osdisk_size: serverData?.OS_Disk_size,
        datadisk_name: serverData?.Storage_Disk_Value,
        datadisk_size: serverData?.Storage_Disk_Size,
      };
    } else {
      data = {
        bussiess_name: bu, //(Business User Name)
        cloud: "AZ",
        Environment: "T", //(T - Test from Form )
        ResourceType: "A", //(W - webserver / D - Database / A - App / X - Other)
        appname: "AUTO",
        subscription_id: serverData?.subscriptionIDAzure, //(subscription id from form)
        resourcegroup: serverData?.ResourceGRPAzure, //(resource grp from form)
        vm_size: serverData.VM_type, //(VM type from Form)
        subnet_name: serverData?.vnetAzure, //(Subnet name from form)
        offer: serverData?.OS, //(OS from form)
        publisher: serverData?.Publisher, //(OS Publisher from form)
        sku: serverData?.Version, //(OS Version from form)
        version: "Latest",
        datadiskname: serverData?.Storage_Disk_Value, //(From form)
        disk_size_gb: serverData?.Storage_Disk_Size, //(From Form)
        os_disk_size_gb: serverData?.OS_Disk_size, //(From Form)
        ApplicationOwner: applicationOwner, //(Application Owner from Form)
        ApplicationName: title, //(Topology Name from Form)
        Business: "",
        Environment_tag: "Test",
      };
    }
    // console.log(data);
  }

  return (
    <>
      <div className="">
        <div className="flex text-xl px-4 border-b-2 border-slate-400 pb-2 items-center">
          {role != "ADMIN" ? (
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
            </div>
            <div className="flex w-1/3 justify-end">
              <label htmlFor="" className="font-semibold text-base w-36">
                Application Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
                {applicationOwner}
              </div>
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
            </div>
            <div className="flex  w-1/4 justify-center">
              <label htmlFor="" className="font-semibold text-base w-28">
                Server Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
                {serverOwner}
              </div>
            </div>
            <div className="flex w-1/4 justify-center">
              <label htmlFor="" className="font-semibold text-base w-32">
                Resource Owner :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
                {resourceOwner}
              </div>
            </div>
            <div className="flex w-1/4 justify-end">
              <label htmlFor="" className="font-semibold">
                Cloud :
              </label>
              <div className="border-b-2 border-slate-600 rounded-md px-2">
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
              </div>
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
                  {topoStatus == "Approved By User" && (
                    // <div>
                    <div className="flex items-center pb-2">
                      <label
                        htmlFor=""
                        className="font-semibold text-base flex flex-col justify-start mr-2"
                      >
                        Subscription Id :
                      </label>
                      <div className="font-semibold border-b-2 h-6 border-slate-600 bg-gray-100 px-1">
                        {cloud == "Azure" ? (
                          <div>
                            {serverData && serverData?.subscriptionIDAzure}
                          </div>
                        ) : (
                          <div>
                            {serverData && serverData?.subscriptionIDAws}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {topoStatus == "Approved By User" && (
                    <div className="flex">
                      <label
                        htmlFor=""
                        className="font-semibold text-base flex flex-col justify-start mr-2"
                      >
                        {cloud == "Azure" ? <p>VNET :</p> : <p>VPC :</p>}
                      </label>
                      <div className="font-semibold border-b-2 h-6 border-slate-600 bg-gray-100 px-1">
                        {cloud == "Azure" ? (
                          <div>{serverData?.vnetAzure}</div>
                        ) : (
                          <div>{serverData?.vnetAws}</div>
                        )}
                        {/* {serverData?.vnet} */}
                      </div>
                    </div>
                    // </div>
                  )}
                </div>
                {topoStatus == "Approved By User" && (
                  <div className="flex justify-around">
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start"
                    >
                      <div>CIDR :</div>
                      <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                        {cloud == "Azure" ? (
                          <div>{serverData?.CIDRAzure}</div>
                        ) : (
                          <div>{serverData?.CIDRAws}</div>
                        )}
                        {/* {serverData?.CIDR} */}
                      </div>
                    </label>
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start"
                    >
                      <div>Subnet :</div>
                      <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                        {cloud == "Azure" ? (
                          <div>
                            {serverData &&
                              serverData.SubnetAzure &&
                              serverData.SubnetAzure[0].subnet1}
                          </div>
                        ) : (
                          <div>{serverData?.SubnetAws}</div>
                        )}
                        {/* {serverData?.Subnet} */}
                      </div>
                    </label>
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start"
                    >
                      <div>ResourceGRP :</div>
                      <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                        {cloud == "Azure" ? (
                          <div>{serverData?.ResourceGRPAzure}</div>
                        ) : (
                          <div>{serverData?.ResourceGRPAws}</div>
                        )}
                        {/* {serverData?.ResourceGRP} */}
                      </div>
                    </label>
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start"
                    >
                      <div>Region :</div>
                      <div className="w-[14rem] border-b-2 border-slate-600 bg-gray-100">
                        {cloud == "Azure" ? (
                          <div>{serverData?.RegionAzure}</div>
                        ) : (
                          <div>{serverData?.RegionAws}</div>
                        )}
                        {/* {serverData?.Region} */}
                      </div>
                    </label>
                  </div>
                )}

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
                    className="font-semibold text-base flex flex-col justify-start "
                  >
                    <div>OS version :</div>
                    <input
                      type="text"
                      value={serverData?.OS}
                      className="w-[14rem] min-h-[1.7rem] h-[1.7rem] border-b-2 border-slate-600 bg-gray-200"
                    >
                      {/* {serverData && serverData.OS} */}
                    </input>
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
                      disabled
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
                    <div>Data Disk Name:</div>
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
                      disabled={true}
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
                </div>

                <div className="flex justify-center gap-[6.5rem]">
                  {role == "ADMIN" && topoStatus == "Approved By User" && (
                    <label
                      htmlFor=""
                      className="font-semibold text-base flex flex-col justify-start"
                    >
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
                        className="w-[14rem]"
                      >
                        <option disabled={true} value={""}>
                          Select VM Type
                        </option>
                        {vm_types &&
                          vm_types[cloud].map((e: any, i: any) => {
                            return (
                              <option key={i} value={e}>
                                {e}
                              </option>
                            );
                          })}
                      </select>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </form>
          {role == "ADMIN" && topoStatus == "Draft" && (
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
          {role == "ADMIN" && topoStatus == "Approved By User" && (
            <div className="flex flex-row mt-2 mb-2 space-x-2 bottom-4 justify-end">
              <button
                onClick={sendAutomation}
                type="submit"
                className="bg-red-700 text-white px-6 py-1 rounded"
              >
                Automation
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default viewTopology;
