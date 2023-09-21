import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import DynamicNode from "./DynamicNode/DynamicNode";
import "reactflow/dist/style.css";
import { getIcons } from "@/pages/api/getIcons";
import { GetAllVMs } from "@/pages/api/getallVMs";
import { table } from "console";
import { useRouter } from "next/router";
import { viewTopologyForAdmin } from "@/pages/api/viewTopologyForAdmin";
import { useAppContext } from "../AppContext";
import { getOldData, sendEstimation } from "@/pages/api/sendEstimation";
import { ToastContainer, toast } from "react-toastify";
import { getTopologyData } from "@/pages/api/viewTopology";
import { fetchestimation } from "@/pages/api/fetchEstimation";
import { getAwsVMData } from "@/pages/api/getAwsVMData";
import {
  getOldDataOfTOPO,
  updateCloud,
} from "@/pages/api/getUpdatedDataForAdmin";

// import './Topology.css';

// let network_icons: any = [];

// const network_icons = [
//   {
//     Name: "Cisco Router",
//     Path: "/network_icons/router.png",
//   },
//   {
//     Name: "Wifi Router",
//     Path: "/network_icons/wifi_router.png",
//   },
//   {
//     Name: "Switch",
//     Path: "/network_icons/switch.png",
//   },
//   {
//     Name: "Remote Desktop",
//     Path: "/network_icons/remote_desktop.png",
//   },
//   {
//     Name: "Hub",
//     Path: "/network_icons/hub.png",
//   },
//   {
//     Name: "Voip",
//     Path: "/network_icons/voip.png",
//   },
//   {
//     Name: "Database Server",
//     Path: "/network_icons/database_server.png",
//   },
// ];

let selectedNode = 3;

const proOptions = { hideAttribution: true };
let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 3,
};

const nodeTypes = { selectorNode: DynamicNode };

const AddNodeOnEdgeDrop = (props: any) => {
  const reactFlowWrapper = useRef<any>(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(props?.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project, setViewport } = useReactFlow();
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    []
  );

  const flowKey = "example-flow";
  const [rfInstance, setRfInstance] = useState<any>(null);

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          type: "selectorNode",
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          data: {
            label: `Node ${id}`,
            Path: props.network_icons[selectedNode],
          },
        };

        setNodes((nds: any) => nds.concat(newNode));
        setEdges((eds: any) =>
          eds.concat({
            id,
            source: connectingNodeId.current,
            target: id,
            animated: true,
          })
        );
      }
    },
    [project]
  );

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      let flow: any;
      flow = JSON.parse(props.topology || "{}");

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [props.topology, setEdges, setNodes, setViewport]);

  // console.log(props.topology)
  useEffect(() => {
    props.topology && onRestore();
  }, [props.topology]);

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      {/* <button onClick={onSave}>save</button>
      <button onClick={onRestore}>restore</button> */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onInit={props.setRfInstance}
        proOptions={proOptions}
        fitView
        fitViewOptions={fitViewOptions}
      />
    </div>
  );
};

function Topology(props: any) {
  const router = useRouter()
  const { id } = router.query;
  const [network_icons, setNetworkIcons] = useState<any>(null);
  const [initialNodes, setInitialNodes] = useState<any>(null);
  // let getVMData: any[];
  const [vmData, setVMData] = useState<any>(null);
  const [awsVmData, setAwsVMData] = useState<any>(null);
  const uniqueProductNames = new Set();
  const productPrices: any = {};
  const [uniqueProductPrices, setUniqueProductsPrices] = useState<any>({});
  const first5UniqueProductNames = [];
  const [apiHit, setApiHit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAWSProduct, setSelectedAWSProduct] = useState("");
  const [title, setTitle] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cloud, setCloud] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topology, setTopology] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [role, setRole] = useState<any>(null);
  const [serverCount, setserverCount] = useState();
  const [selectedPrice, setSelectedPrice] = useState<any>();
  const [selectedAWSPrice, setSelectedAWSPrice] = useState<any>();
  const [cloudSelection, setCloudSelection] = useState<any>();
  const { estimateCalc, toggleEstimateCalc } = useAppContext();
  const [fetchestCalcDone, setfetchestCalcDone] = useState(false);
  const [estimateStatusUpdated, setEstimateStatusUpdated] =
    useState<any>(false);
  const [estimation, setEstimation] = useState({
    product: "",
    quantity: "",
    price: "",
    totalPrice: "",
    awsProduct: "",
    awsProductPrice: "",
    totalPriceAws: "",
    awsQuantity: "",
    statusOfTopo: "",
  });
  const [estimationClicked, setEstimationClicked] = useState(false);
  let arole: any = "";

  const [topoDetails, setTopoDetails] = useState<any>([]);

  useEffect(() => {
    if (estimation.awsProduct || estimation.product) {
      setfetchestCalcDone(true);
    }
  }, [estimation.awsProduct, estimation.product]);
  console.log("esti----------", fetchestCalcDone);
  useEffect(() => {
    async function dataFetch() {
      let buId = localStorage.getItem("bu_id");
      let userRole = localStorage.getItem("role");
      userRole != "admin" && id
        ? await fetchestimation(id).then((res) => {
            if (res.data[0]) {
              console.log("user", res.data[0]);

              setEstimation((prevEstimation: any) => ({
                ...prevEstimation,
                product: res.data[0].product,
                quantity: res.data[0].quantity,
                price: res.data[0].price,
                totalPrice: res.data[0].totalPrice,
                awsProduct: res.data[0].awsProduct,
                awsProductPrice: res.data[0].awsProductPrice,
                totalPriceAws: res.data[0].totalPriceAws,
                awsQuantity: res.data[0].awsQuantity,
                statusOfTopo: res.data[0].status,
              }));
            }
          })
        : await fetchestimation(id).then((res) => {
            if (res.data[0]) {
              console.log("admin", res.data[0]);
              setEstimation((prevEstimation: any) => ({
                ...prevEstimation,
                product: res.data[0].product,
                quantity: res.data[0].quantity, // Example quantity value
                price: res.data[0].price, // Example price value
                totalPrice: res.data[0].totalPrice, // Example total price value
                awsProduct: res.data[0].awsProduct,
                awsProductPrice: res.data[0].awsProductPrice,
                totalPriceAws: res.data[0].totalPriceAws,
                awsQuantity: res.data[0].awsQuantity,
                statusOfTopo: res.data[0].status,
              }));
            }
          });
    }

    id && dataFetch();
  }, [id]);

  // console.log("estimation in topo",estimation)
  useEffect(() => {
    arole = localStorage.getItem("role");
  }, []);
  useEffect(() => {
    setRole(arole);
  }, [arole]);
  useEffect(() => {
    fetchData();
  }, [id]);
  async function fetchData() {
    await viewTopologyForAdmin(id).then((res) => {
      if(res){
        setTitle(res.data[0].title);
        setCloud(res.data[0].cloud_server);
        setTopology(res.data[0].flowChart);
        setTopoDetails(res.data[0].node_details);
      }
    });
  }

  const getData = async () => {
    if (cloud && cloud.length == 1) {
      if (cloud == "Azure") {
        const getVMData = await GetAllVMs();
        // getUniqueVm(getVMData);
        setVMData(getVMData);
        setApiHit(true);
      } else if (cloud == "AWS") {
        setApiHit(true);
        const getAWSVMData = await getAwsVMData();
        setAwsVMData(getAWSVMData);
      }
    } else if (cloud && cloud.length > 1) {
      const getVMData = await GetAllVMs();
      // getUniqueVm(getVMData);
      setVMData(getVMData);
      const getAWSVMData = await getAwsVMData();
      setAwsVMData(getAWSVMData);
      setApiHit(true);
    }
  };
  // console.log("-----------", vmData && vmData.data);
  const getallVMs = (e: any) => {
    e.preventDefault();
    getData();
    setserverCount(
      topoDetails && topoDetails.filter((item: any) => item === "Server").length
    );
  };
  console.log("-------aws vm data", awsVmData);
  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res) => {
        setNetworkIcons(res.data);
        setInitialNodes([
          {
            id: "0",
            type: "selectorNode",
            data: { label: "Node", Path: res.data[3] },
            position: { x: 0, y: 50 },
          },
        ]);
      });
    }
    dataFetch();
  }, []);
  const handleProductChange = (e: any) => {
    e.preventDefault();
    setSelectedProduct(e.target.value);
  };
  const handleAWSProductChange = (e: any) => {
    e.preventDefault();
    setSelectedAWSProduct(e.target.value);
  };
  const checkEstimation = (e: any) => {
    e.preventDefault();
    setEstimationClicked(true);
  };
  const [Node, setNode] = useState(3);

  useEffect(() => {
    const sendEstimationToUser = async () => {
      if (cloud && cloud.length == 1) {
        if (cloud == "Azure") {
          if (selectedPrice && selectedProduct && serverCount) {
            await getOldData(id).then(async (res) => {
              let data = res.data[0];
              data = {
                ...data,
                status: "Approval Pending",
                product: selectedProduct,
                quantity: serverCount,
                price: selectedPrice && selectedPrice.toFixed(3),
                totalPrice:
                  serverCount &&
                  selectedPrice &&
                  serverCount * selectedPrice.toFixed(3),
              };
              await sendEstimation(data.id, data).then(() => {
                // setEstCalcDone(true);
                toast.success("Estimation sent for Azure successfully!", {
                  position: "bottom-right",
                  autoClose: 1000,
                  onClose: () => {
                    router.push("/Components/AssetsForAdmin");
                  },
                });
              });
            });
          } else if (estimateCalc) {
            toast.error("Please calculate the estimation!", {
              position: "bottom-right",
              autoClose: 2000,
            });
          }
        } else if (cloud == "AWS") {
          if (serverCount) {
            await getOldData(id).then(async (res) => {
              let data = res.data[0];
              data = {
                ...data,
                status: "Approval Pending",
                awsProduct: "AmazonEC2",
                awsQuantity: serverCount,
                awsProductPrice: 0.213,
                totalPriceAws: serverCount && serverCount * 0.213,
              };
              await sendEstimation(data.id, data).then(() => {
                // setEstCalcDone(true);
                toast.success("Estimation sent for AWS successfully!", {
                  position: "bottom-right",
                  autoClose: 1000,
                  onClose: () => {
                    router.push("/Components/AssetsForAdmin");
                  },
                });
              });
            });
          } else if (estimateCalc) {
            toast.error("Please calculate the estimation!", {
              position: "bottom-right",
              autoClose: 2000,
            });
          }
        }
      } else if (cloud && cloud.length > 1) {
        if (serverCount && selectedPrice && selectedProduct) {
          await getOldData(id).then(async (res) => {
            let data = res.data[0];
            data = {
              ...data,
              status: "Approval Pending",
              product: selectedProduct,
              quantity: serverCount,
              price: selectedPrice && selectedPrice.toFixed(3),
              totalPrice:
                serverCount &&
                selectedPrice &&
                serverCount * selectedPrice.toFixed(3),
              awsProduct: "AmazonEC2",
              awsQuantity: serverCount,
              awsProductPrice: 0.213,
              totalPriceAws: serverCount && serverCount * 0.213,
            };
            await sendEstimation(data.id, data).then(() => {
              // setEstCalcDone(true);
              toast.success("Estimation sent successfully!", {
                position: "bottom-right",
                autoClose: 1000,
                onClose: () => {
                  router.push("/Components/AssetsForAdmin");
                },
              });
            });
          });
        } else if (estimateCalc) {
          toast.error("Please calculate the estimation!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      }
    };
    sendEstimationToUser();
  }, [estimateCalc]);
  const [viewClicked, setviewClicked] = useState(false);
  const manageview = (e: any) => {
    e.preventDefault();
    setviewClicked(true);
  };

  const approveStatus = (e: any) => {
    e.preventDefault();
    const sendEstimationToUser = async () => {
      if (cloud && cloud.length > 1) {
        if (cloudSelection && cloudSelection == 1) {
          await getOldData(id).then(async (res) => {
            let data = res.data[0];
            data = {
              ...data,
              status: "Approved By User",
              cloud_server: ["Azure"],
              awsProduct: "",
              awsProductPrice: "",
              totalPriceAws: "",
              awsQuantity: "",
            };
            await sendEstimation(data.id, data).then(() => {
              setEstimateStatusUpdated(true);
              toast.success("Approved Azure Estimation successfully!", {
                position: "bottom-right",
                autoClose: 2000,
              });
            });
          });
          await getOldDataOfTOPO(id).then(async (res) => {
            let data = res.data[0];
            data = {
              ...data,
              cloud_server: ["Azure"],
            };
            await updateCloud(data.id, data).then(() => {});
          });
        } else if (cloudSelection && cloudSelection == 2) {
          await getOldData(id).then(async (res) => {
            let data = res.data[0];
            data = {
              ...data,
              status: "Approved By User",
              cloud_server: ["AWS"],
              product: "",
              quantity: "", // Example quantity value
              price: "", // Example price value
              totalPrice: "",
            };
            await sendEstimation(data.id, data).then(() => {
              setEstimateStatusUpdated(true);
              toast.success("Approved AWS Estimation successfully!", {
                position: "bottom-right",
                autoClose: 2000,
              });
            });
          });
          await getOldDataOfTOPO(id).then(async (res) => {
            let data = res.data[0];
            data = {
              ...data,
              cloud_server: ["AWS"],
            };
            await updateCloud(data.id, data).then(() => {});
          });
        }
      } else if (cloud && cloud.length == 1) {
        await getOldData(id).then(async (res) => {
          let data = res.data[0];
          data = {
            ...data,
            status: "Approved By User",
          };
          await sendEstimation(data.id, data).then(() => {
            setEstimateStatusUpdated(true);
            toast.success("Approved successfully!", {
              position: "bottom-right",
              autoClose: 2000,
            });
          });
        });
      }
    };
    sendEstimationToUser();
  };

  const rejectStatus = (e: any) => {
    e.preventDefault();
    const sendEstimationToUser = async () => {
      await getOldData(id).then(async (res) => {
        let data = res.data[0];
        data = {
          ...data,
          status: "Rejected By User",
        };
        await sendEstimation(data.id, data).then(() => {
          setEstimateStatusUpdated(true);
          toast.error("Rejected!", {
            position: "bottom-right",
            autoClose: 2000,
          });
          // router.push("/Components/Assets");
        });
      });
    };
    sendEstimationToUser();
  };

  const selectCloud = (e: any, cloudNumber: any) => {
    e.preventDefault();
    setCloudSelection(cloudNumber);
  };
  console.log("selected cloud", cloudSelection);
  useEffect(() => {
    function findPrice(selectedProduct: any, selectedAWSProduct: any) {
      // console.log("in  function", selectedProduct);
      if (cloud && cloud.length == 1) {
        if (vmData && vmData.data) {
          // console.log("in  function if");
          const selectedProductData = vmData.data.find(
            (product: any) => product.productName == selectedProduct
          );

          if (selectedProductData) {
            // console.log("in  function if if");
            setSelectedPrice(selectedProductData.unitPrice);
            return `$${selectedProductData.unitPrice}`;
          }
        }
      } else if (cloud && cloud.length > 1) {
        if (vmData && vmData.data) {
          // console.log("in  function if");
          const selectedProductData = vmData.data.find(
            (product: any) => product.productName == selectedProduct
          );

          if (selectedProductData) {
            // console.log("in  function if if");
            setSelectedPrice(selectedProductData.unitPrice);
            return `$${selectedProductData.unitPrice}`;
          }
        }
        if (awsVmData && awsVmData.data) {
          // console.log("in  function if");
          const selectedProductData = awsVmData.data.find(
            (product: any) => product.servicename == selectedAWSProduct
          );

          if (selectedProductData) {
            // console.log("in  function if if");
            setSelectedAWSPrice(selectedProductData.USD);
            return `$${selectedProductData.USD}`;
          }
        }
      }

      return "N/A"; // Return this if the product is not found or 'vmData' is not available
    }
    if (cloud && cloud.length == 1) {
      findPrice(selectedProduct, null);
    } else if (cloud && cloud.length > 1) {
      findPrice(selectedProduct, selectedAWSProduct);
    }
  }, [selectedProduct, selectedAWSProduct]);
  // console.log("selected price", selectedPrice);
  return (
    <>
      <div className="topology-editor">
        <ToastContainer />
        <div
          className="creator"
          style={{
            width:
              (vmData && vmData.data) ||
              (awsVmData && awsVmData.data) ||
              viewClicked
                ? "50%"
                : "75%",
          }}
        >
          {network_icons ? (
              <AddNodeOnEdgeDrop
                network_icons={network_icons}
                initialNodes={initialNodes}
                setRfInstance={props.setRfInstance}
                topology={props.topology}
              />
          ) : (
            <>no data found</>
          )}
        </div>
        <div
          className="relative editor-options min-h-[50vh]"
          style={{
            width:
              (vmData && vmData.data) ||
              (awsVmData && awsVmData.data) ||
              viewClicked
                ? "50%"
                : "25%",
          }}
        >
          {props.editable ? (
            <div className="modal" style={{ display: "contents" }}>
              <ul>
                {network_icons &&
                  network_icons.map((x: any, i: any) => {
                    return (
                      <li
                        onClick={() => {
                          selectedNode = i;
                          setNode(i);
                        }}
                        key={i}
                        className={Node === i ? "selected-node" : ""}
                      >
                        <img src={x.Path} /> <p>{x.Name}</p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : (
            <div>
              <div
                className={`${role === "admin" ? "" : "hidden"} justify-center`}
              >
                {estimation.statusOfTopo == "Draft" ? (
                  <div>
                    <div className="flex justify-center">
                      <button
                        className={`btn ${
                          (apiHit && vmData && vmData.data) ||
                          (apiHit && awsVmData && awsVmData.data)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-700 text-white hover:bg-red-800"
                        } rounded-md px-4 py-1 mt-6 font-semibold`}
                        disabled={
                          (apiHit && vmData && vmData.data) ||
                          (apiHit && awsVmData && awsVmData.data)
                        }
                        onClick={(e: any) => getallVMs(e)}
                      >
                        Calculate Estimation
                      </button>
                    </div>{" "}
                    <div>
                      <div>
                        {cloud && cloud.length == 1 && (
                          <div>
                            {apiHit && vmData && vmData.data && (
                              <div>
                                <p className="mt-4  text-base font-semibold p-1">
                                  {" "}
                                  Azure:{" "}
                                </p>
                                <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                  <table className="w-full">
                                    <thead className="bg-red-700 text-white">
                                      <tr>
                                        <th className="font-medium">Product</th>
                                        <th className="font-medium">
                                          Quantity
                                        </th>
                                        <th className="font-medium">Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <select
                                            id="productDropdown"
                                            onChange={handleProductChange}
                                            value={selectedProduct}
                                            className="px-4 py-1 border mb-2 w-[20.6rem] rounded-lg"
                                            required
                                          >
                                            <option value="" disabled>
                                              Select a product
                                            </option>
                                            {vmData &&
                                              vmData.data.map(
                                                (
                                                  product: any // Rename the variable to 'product'
                                                ) => (
                                                  <option
                                                    key={product.productName}
                                                    value={product.productName}
                                                  >
                                                    {" "}
                                                    {/* Use 'product.productName' as the value */}
                                                    {product.productName}
                                                  </option>
                                                )
                                              )}
                                          </select>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                          {serverCount}
                                        </td>
                                        <td className="px-4 py-2">
                                          <p className="border-b-2">
                                            {" "}
                                            {selectedPrice
                                              ? selectedPrice.toFixed(3)
                                              : "N/A"}
                                          </p>
                                        </td>
                                      </tr>
                                      {/* Add more rows as needed */}
                                    </tbody>
                                  </table>

                                  {/* Total Price Block */}
                                  <div className="total-price px-4 py-2 text-lg font-semibold">
                                    Total Price: $
                                    {serverCount &&
                                      selectedPrice &&
                                      serverCount * selectedPrice.toFixed(3)}
                                  </div>
                                </div>
                              </div>
                            )}
                            {apiHit && awsVmData && awsVmData.data && (
                              <div>
                                <p className="mt-4  text-base font-semibold p-1">
                                  {" "}
                                  AWS:{" "}
                                </p>
                                <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                  <table className="w-full">
                                    <thead className="bg-red-700 text-white">
                                      <tr>
                                        <th className="font-medium">Product</th>
                                        <th className="font-medium">
                                          Quantity
                                        </th>
                                        <th className="font-medium">Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <select
                                            id="productDropdown"
                                            onChange={handleAWSProductChange}
                                            value={selectedAWSProduct}
                                            className="px-4 py-1 border mb-2 w-[20.6rem] rounded-lg"
                                            required
                                          >
                                            <option value="" disabled>
                                              Select a product
                                            </option>
                                            {/* {awsVmData &&
                                     awsVmData.data.map(
                                       (
                                         product: any 
                                       ) => (
                                         <option
                                           key={product.servicename}
                                           value={product.servicename}
                                         > */}{" "}
                                            {/* {product.servicename} */}
                                            {/* </option>
                                       )
                                     )} */}
                                            <option>AmazonEC2</option>
                                          </select>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                          {serverCount}
                                        </td>
                                        <td className="px-4 py-2">
                                          <p className="border-b-2">
                                            {" "}
                                            {/* {selectedAWSPrice ? selectedAWSPrice : "N/A"} */}
                                            {selectedAWSProduct ? 0.213 : "N/A"}
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  {/* Total Price Block */}
                                  <div className="total-price px-4 py-2 text-lg font-semibold">
                                    Total Price:{" "}
                                    {/* {serverCount && serverCount * selectedAWSPrice} */}
                                    $
                                    {selectedAWSProduct &&
                                      serverCount &&
                                      serverCount * 0.213}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        {cloud && cloud.length > 1 && (
                          <div>
                            {apiHit && vmData.data && (
                              <div>
                                <div>
                                  <p className="mt-4  text-base font-semibold p-1">
                                    {" "}
                                    Azure:{" "}
                                  </p>
                                  <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                    <table className="w-full">
                                      <thead className="bg-red-700 text-white">
                                        <tr>
                                          <th className="font-medium">
                                            Product
                                          </th>
                                          <th className="font-medium">
                                            Quantity
                                          </th>
                                          <th className="font-medium">Price</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <select
                                              id="productDropdown"
                                              onChange={handleProductChange}
                                              value={selectedProduct}
                                              className="px-4 py-1 border mb-2 w-[20.6rem] rounded-lg"
                                              required
                                            >
                                              <option value="" disabled>
                                                Select a product
                                              </option>
                                              {vmData &&
                                                vmData.data.map(
                                                  (
                                                    product: any // Rename the variable to 'product'
                                                  ) => (
                                                    <option
                                                      key={product.productName}
                                                      value={
                                                        product.productName
                                                      }
                                                    >
                                                      {" "}
                                                      {/* Use 'product.productName' as the value */}
                                                      {product.productName}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </td>
                                          <td className="px-4 py-2 text-center">
                                            {serverCount}
                                          </td>
                                          <td className="px-4 py-2">
                                            <p className="border-b-2">
                                              {" "}
                                              {selectedPrice
                                                ? selectedPrice.toFixed(3)
                                                : "N/A"}
                                            </p>
                                          </td>
                                        </tr>
                                        {/* Add more rows as needed */}
                                      </tbody>
                                    </table>

                                    {/* Total Price Block */}
                                    <div className="total-price px-4 py-2 text-lg font-semibold">
                                      Total Price: $
                                      {serverCount &&
                                        selectedPrice &&
                                        serverCount * selectedPrice.toFixed(3)}
                                    </div>
                                  </div>
                                </div>
                                {/* {cloud && cloud.length > 1 && ( */}
                                <div>
                                  <p className="mt-4  text-base font-semibold p-1">
                                    {" "}
                                    AWS:{" "}
                                  </p>
                                  <div className="mb-2 w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                    <table className="w-full">
                                      <thead className="bg-red-700 text-white">
                                        <tr>
                                          <th className="font-medium">
                                            Product
                                          </th>
                                          <th className="font-medium">
                                            Quantity
                                          </th>
                                          <th className="font-medium">Price</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            <select
                                              id="productDropdown"
                                              onChange={handleAWSProductChange}
                                              value={selectedAWSProduct}
                                              className="px-4 py-1 border mb-2 w-[20.6rem] rounded-lg"
                                              required
                                            >
                                              <option value="" disabled>
                                                Select a product
                                              </option>
                                              {/* {awsVmData &&
                                        awsVmData.data.map(
                                          (
                                            product: any 
                                          ) => (
                                            <option
                                              key={product.servicename}
                                              value={product.servicename}
                                            > */}{" "}
                                              {/* {product.servicename} */}
                                              {/* </option>
                                          )
                                        )} */}
                                              <option>AmazonEC2</option>
                                            </select>
                                          </td>
                                          <td className="px-4 py-2 text-center">
                                            {serverCount}
                                          </td>
                                          <td className="px-4 py-2">
                                            <p className="border-b-2">
                                              {" "}
                                              {/* {selectedAWSPrice ? selectedAWSPrice : "N/A"} */}
                                              {selectedAWSProduct
                                                ? 0.213
                                                : "N/A"}
                                            </p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>

                                    {/* Total Price Block */}
                                    <div className="total-price px-4 py-2 text-lg font-semibold">
                                      Total Price:{" "}
                                      {/* {serverCount && serverCount * selectedAWSPrice} */}
                                      $
                                      {selectedAWSProduct &&
                                        serverCount &&
                                        serverCount * 0.213}
                                    </div>
                                  </div>
                                </div>
                                {/* // )} */}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="">
                      <div className="justify-center">
                        <button
                          className={`btn ${
                            viewClicked
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-700 text-white hover:bg-red-800"
                          }  rounded-md px-4 py-1 mt-6 font-semibold`}
                          disabled={
                            (apiHit && vmData && vmData.data) ||
                            (apiHit && awsVmData && awsVmData.data)
                          }
                          onClick={(e: any) => manageview(e)}
                        >
                          View Estimation
                        </button>
                      </div>
                      {estimation && viewClicked && (
                        <div>
                          {cloud && cloud.length == 1 && (
                            <div>
                              {!estimateStatusUpdated && !estimation ? (
                                <div className="flex items-center m-2 mt-4">
                                  <input
                                    id="default-radio-1"
                                    type="radio"
                                    value=""
                                    name="default-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500   focus:ring-2"
                                    onFocus={
                                      cloud && cloud == "Azure"
                                        ? (e: any) => selectCloud(e, 1)
                                        : (e: any) => selectCloud(e, 2)
                                    }
                                  />
                                  <label
                                    htmlFor="default-radio-1"
                                    className="ml-2 text-sm font-medium text-gray-900"
                                  >
                                    {cloud && cloud == "Azure" ? (
                                      <div>Azure</div>
                                    ) : (
                                      <div>AWS</div>
                                    )}
                                  </label>
                                </div>
                              ) : (
                                <div className="flex items-center m-2 mt-4">
                                  <label
                                    htmlFor="default-radio-1"
                                    className="ml-2 text-sm font-medium text-gray-900"
                                  >
                                    {cloud && cloud}
                                  </label>
                                </div>
                              )}
                              <div className="w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                <table className="w-full">
                                  <thead className="bg-red-700 text-white">
                                    <tr>
                                      <th className="font-medium w-3/5">
                                        Product
                                      </th>

                                      <th className="font-medium w-1/5">
                                        Quantity
                                      </th>

                                      <th className="font-medium w-1/5">
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="pl-4">
                                        <div className="font-bold">Server</div>
                                        <div className="text-sm">
                                          {cloud && cloud == "Azure" ? (
                                            <div>{estimation.product}</div>
                                          ) : (
                                            <div>{estimation.awsProduct}</div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 text-center">
                                        {cloud && cloud == "Azure" ? (
                                          <div>{estimation.quantity}</div>
                                        ) : (
                                          <div>{estimation.awsQuantity}</div>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-center">
                                        <p className="border-b-2">
                                          {cloud && cloud == "Azure" ? (
                                            <div>{estimation.totalPrice}</div>
                                          ) : (
                                            <div>
                                              {estimation.totalPriceAws}
                                            </div>
                                          )}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          {cloud && cloud.length > 1 && (
                            <div>
                              <div>
                                <div className="flex items-center m-2 mt-4">
                                  <input
                                    id="default-radio-1"
                                    type="radio"
                                    value=""
                                    name="default-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
                                    onFocus={(e: any) => selectCloud(e, 2)}
                                  />
                                  <label
                                    htmlFor="default-radio-1"
                                    className="ml-2 text-sm font-medium text-gray-900"
                                  >
                                    AWS
                                  </label>
                                </div>
                                <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                  <table className="w-full">
                                    <thead className="bg-red-700 text-white">
                                      <tr>
                                        <th className="font-medium w-3/5">
                                          Product
                                        </th>

                                        <th className="font-medium w-1/5">
                                          Quantity
                                        </th>

                                        <th className="font-medium w-1/5">
                                          Price
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="pl-4">
                                          <div className="font-bold">
                                            Server
                                          </div>

                                          <div className="text-sm">
                                            {estimation.awsProduct}
                                          </div>
                                        </td>

                                        <td className="px-4 py-2 text-center">
                                          {estimation.awsQuantity}
                                        </td>

                                        <td className="px-4 py-2  text-center">
                                          <p className="border-b-2">
                                            {estimation.totalPriceAws}
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center m-2 mt-4">
                                  <input
                                    id="default-radio-1"
                                    type="radio"
                                    value=""
                                    name="default-radio"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
                                    onFocus={(e: any) => selectCloud(e, 1)}
                                  />
                                  <label
                                    htmlFor="default-radio-1"
                                    className="ml-2 text-sm font-medium text-gray-900"
                                  >
                                    Azure
                                  </label>
                                </div>
                                <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                                  <table className="w-full">
                                    <thead className="bg-red-700 text-white">
                                      <tr>
                                        <th className="font-medium w-3/5">
                                          Product
                                        </th>

                                        <th className="font-medium w-1/5">
                                          Quantity
                                        </th>

                                        <th className="font-medium w-1/5">
                                          Price
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      <tr>
                                        <td className="pl-4">
                                          <div className="font-bold">
                                            Server
                                          </div>

                                          <div className="text-sm">
                                            {estimation.product}
                                          </div>
                                        </td>

                                        <td className="px-4 py-2 text-center">
                                          {estimation.quantity}
                                        </td>

                                        <td className="px-4 py-2  text-center">
                                          <p className="border-b-2">
                                            {estimation.totalPrice}
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-row mt-2 mb-2 space-x-2 bottom-4 justify-end">
                        <button className="px-4 rounded-md py-1 bg-red-700 text-white">
                          Automation
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={role != "admin" ? "justify-center" : "hidden"}>
                <div className="justify-center">
                  <button
                    className={`btn 
                    }  rounded-md px-4 py-1 mt-6 font-semibold ${
                      !fetchestCalcDone
                        ? "bg-gray-300"
                        : "bg-red-700 text-white"
                    }`}
                    disabled={
                      (apiHit && vmData && vmData.data) ||
                      (apiHit && awsVmData && awsVmData.data) ||
                      !fetchestCalcDone
                    }
                    onClick={(e: any) => manageview(e)}
                  >
                    View Estimation
                  </button>
                </div>
                {estimation && viewClicked && (
                  <div>
                    {cloud && cloud.length == 1 && (
                      <div>
                        {!estimateStatusUpdated && !estimation ? (
                          <div className="flex items-center m-2 mt-4">
                            <input
                              id="default-radio-1"
                              type="radio"
                              value=""
                              name="default-radio"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500   focus:ring-2"
                              onFocus={
                                cloud && cloud == "Azure"
                                  ? (e: any) => selectCloud(e, 1)
                                  : (e: any) => selectCloud(e, 2)
                              }
                            />
                            <label
                              htmlFor="default-radio-1"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              {cloud && cloud == "Azure" ? (
                                <div>Azure</div>
                              ) : (
                                <div>AWS</div>
                              )}
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center m-2 mt-4">
                            {/* <input
                              id="default-radio-1"
                              type="radio"
                              value=""
                              name="default-radio"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500   focus:ring-2"
                            /> */}
                            <label
                              htmlFor="default-radio-1"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              {cloud && cloud}
                            </label>
                          </div>
                        )}

                        <div className="w-full bg-white border rounded-lg overflow-hidden shadow-md">
                          <table className="w-full">
                            <thead className="bg-red-700 text-white">
                              <tr>
                                <th className="font-medium w-3/5">Product</th>

                                <th className="font-medium w-1/5">Quantity</th>

                                <th className="font-medium w-1/5">Price</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                <td className="pl-4">
                                  <div className="font-bold">Server</div>

                                  <div className="text-sm">
                                    {cloud && cloud == "Azure" ? (
                                      <div>{estimation.product}</div>
                                    ) : (
                                      <div>{estimation.awsProduct}</div>
                                    )}
                                  </div>
                                </td>

                                <td className="px-4 py-2 text-center">
                                  {cloud && cloud == "Azure" ? (
                                    <div>{estimation.quantity}</div>
                                  ) : (
                                    <div>{estimation.awsQuantity}</div>
                                  )}
                                </td>

                                <td className="px-4 py-2 text-center">
                                  <p className="border-b-2">
                                    {cloud && cloud == "Azure" ? (
                                      <div>{estimation.totalPrice}</div>
                                    ) : (
                                      <div>{estimation.totalPriceAws}</div>
                                    )}
                                  </p>
                                </td>
                              </tr>

                              {/* Add more rows as needed */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {cloud && cloud.length > 1 && (
                      <div>
                        <div>
                          <div className="flex items-center m-2 mt-4">
                            <input
                              id="default-radio-1"
                              type="radio"
                              value=""
                              name="default-radio"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
                              onFocus={(e: any) => selectCloud(e, 2)}
                            />
                            <label
                              htmlFor="default-radio-1"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              AWS
                            </label>
                          </div>
                          <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                            <table className="w-full">
                              <thead className="bg-red-700 text-white">
                                <tr>
                                  <th className="font-medium w-3/5">Product</th>

                                  <th className="font-medium w-1/5">
                                    Quantity
                                  </th>

                                  <th className="font-medium w-1/5">Price</th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td className="pl-4">
                                    <div className="font-bold">Server</div>

                                    <div className="text-sm">
                                      {estimation.awsProduct}
                                    </div>
                                  </td>

                                  <td className="px-4 py-2 text-center">
                                    {estimation.awsQuantity}
                                  </td>

                                  <td className="px-4 py-2  text-center">
                                    <p className="border-b-2">
                                      {estimation.totalPriceAws}
                                    </p>
                                  </td>
                                </tr>

                                {/* Add more rows as needed */}
                              </tbody>
                            </table>

                            {/* Total Price Block */}

                            <div className="total-price px-4 py-2 text-lg font-semibold">
                              {/* Total Price: ${totalPrice} */}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center m-2 mt-4">
                            <input
                              id="default-radio-1"
                              type="radio"
                              value=""
                              name="default-radio"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
                              onFocus={(e: any) => selectCloud(e, 1)}
                            />
                            <label
                              htmlFor="default-radio-1"
                              className="ml-2 text-sm font-medium text-gray-900"
                            >
                              Azure
                            </label>
                          </div>
                          <div className=" w-full bg-white border rounded-lg overflow-hidden shadow-md">
                            <table className="w-full">
                              <thead className="bg-red-700 text-white">
                                <tr>
                                  <th className="font-medium w-3/5">Product</th>

                                  <th className="font-medium w-1/5">
                                    Quantity
                                  </th>

                                  <th className="font-medium w-1/5">Price</th>
                                </tr>
                              </thead>

                              <tbody>
                                <tr>
                                  <td className="pl-4">
                                    <div className="font-bold">Server</div>

                                    <div className="text-sm">
                                      {estimation.product}
                                    </div>
                                  </td>

                                  <td className="px-4 py-2 text-center">
                                    {estimation.quantity}
                                  </td>

                                  <td className="px-4 py-2  text-center">
                                    <p className="border-b-2">
                                      {estimation.totalPrice}
                                    </p>
                                  </td>
                                </tr>

                                {/* Add more rows as needed */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {fetchestCalcDone && viewClicked && (
                  <div className="flex flex-row mt-2 mb-2 space-x-2 bottom-4 justify-end">
                    <button
                      className={`px-4 rounded-md py-1 ${
                        estimation.statusOfTopo == "Approved By User" ||
                        estimation.statusOfTopo == "Rejected By User"
                          ? "bg-gray-400 text-gray-700"
                          : "bg-red-700 text-white"
                      }`}
                      onClick={(e) => rejectStatus(e)}
                      disabled={
                        estimation.statusOfTopo == "Approved By User" ||
                        estimation.statusOfTopo == "Rejected By User"
                      }
                    >
                      Decline
                    </button>

                    <button
                      className={`px-4 rounded-md py-1 ${
                        estimation.statusOfTopo == "Approved By User" ||
                        estimation.statusOfTopo == "Rejected By User"
                          ? "bg-gray-400 text-gray-700"
                          : "bg-green-700 text-white"
                      }`}
                      onClick={(e) => approveStatus(e)}
                      disabled={
                        estimation.statusOfTopo == "Approved By User" ||
                        estimation.statusOfTopo == "Rejected By User"
                      }
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Topology;
