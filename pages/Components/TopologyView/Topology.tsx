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
import router, { useRouter } from "next/router";
import { viewTopologyForAdmin } from "@/pages/api/viewTopologyForAdmin";
import { useAppContext } from "../AppContext";
import { getOldData, sendEstimation } from "@/pages/api/sendEstimation";
import { toast } from "react-toastify";
import { getTopologyData } from "@/pages/api/viewTopology";
import { fetchestimation } from "@/pages/api/fetchEstimation";

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
  const { id } = router.query;
  const [network_icons, setNetworkIcons] = useState<any>(null);
  const [initialNodes, setInitialNodes] = useState<any>(null);
  // let getVMData: any[];
  const [vmData, setVMData] = useState<any>(null);
  const uniqueProductNames = new Set();
  const productPrices: any = {};
  const [uniqueProductPrices, setUniqueProductsPrices] = useState<any>({});
  const first5UniqueProductNames = [];
  const [apiHit, setApiHit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [title, setTitle] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cloud, setCloud] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [topology, setTopology] = useState<any>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [role, setRole] = useState<any>(null);
  const [serverCount, setserverCount] = useState();
  const [selectedPrice, setSelectedPrice] = useState<any>();
  const { estimateCalc, toggleEstimateCalc } = useAppContext();
  const [estimation, setEstimation] = useState({
    product: "",
    quantity: "",
    price: "",
    totalPrice: "",
  });
  const [estimationClicked, setEstimationClicked] = useState(false);
  let arole: any = "";

  const [topoDetails, setTopoDetails] = useState<any>([]);

  useEffect(() => {
    async function dataFetch() {
      let buId = localStorage.getItem("bu_id");
      let userRole = localStorage.getItem("role");
      userRole != "admin"
        ? await fetchestimation(id).then((res) => {
            if (res) {
              // setTitle(res.data[0].title);
              // setCloud(res.data[0].cloud_server);
              // setTopology(res.data[0].flowChart);
              console.log("user", res.data[0]);

              setEstimation((prevEstimation: any) => ({
                ...prevEstimation,
                product: res.data[0].product,
                quantity: res.data[0].quantity, // Example quantity value
                price: res.data[0].price, // Example price value
                totalPrice: res.data[0].totalPrice, // Example total price value
              }));
            }
          })
        : await fetchestimation(id).then((res) => {
            if (res) {
              console.log("admin", res.data[0]);
              setEstimation((prevEstimation: any) => ({
                ...prevEstimation,
                product: res.data[0].product,
                quantity: res.data[0].quantity, // Example quantity value
                price: res.data[0].price, // Example price value
                totalPrice: res.data[0].totalPrice, // Example total price value
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
      setTitle(res.data[0].title);
      setCloud(res.data[0].cloud_server);
      setTopology(res.data[0].flowChart);
      setTopoDetails(res.data[0].node_details);
    });
  }

  const getData = async () => {
    const getVMData = await GetAllVMs();
    // getUniqueVm(getVMData);
    setVMData(getVMData);
    setApiHit(true);
  };
  // console.log("-----------", vmData && vmData.data);
  const getallVMs = (e: any) => {
    e.preventDefault();
    getData();
    setserverCount(
      topoDetails && topoDetails.filter((item: any) => item === "Server").length
    );
  };
  // console.log("-------serercount", serverCount);
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
  const checkEstimation = (e: any) => {
    e.preventDefault();
    setEstimationClicked(true);
  };
  const [Node, setNode] = useState(3);

  useEffect(() => {
    const sendEstimationToUser = async () => {
      if (selectedPrice && selectedProduct && serverCount) {
        await getOldData(id).then(async (res) => {
          let data = res.data[0];
          data = {
            ...data,
            status: "Approval Pending",
            product: selectedProduct,
            quantity: serverCount,
            price: selectedPrice,
            totalPrice: serverCount && serverCount * selectedPrice,
          };
          await sendEstimation(data.id, data).then(() => {
            toast.success("Estimation sent successfully!", {
              position: "bottom-right",
              autoClose: 2000,
            });
          });
        });
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
      await getOldData(id).then(async (res) => {
        let data = res.data[0];
        data = {
          ...data,
          status: "Approved By User",
        };
        await sendEstimation(data.id, data).then(() => {
          toast.success("Approved successfully!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        });
      });
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
          toast.error("Rejected!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        });
      });
    };
    sendEstimationToUser();
  };

  useEffect(() => {
    function findPrice(selectedProduct: any) {
      // console.log("in  function", selectedProduct);

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

      return "N/A"; // Return this if the product is not found or 'vmData' is not available
    }
    findPrice(selectedProduct);
  }, [selectedProduct]);
  // console.log("selected price", selectedPrice);
  return (
    <>
      <div className="topology-editor">
        <div
          className="creator"
          style={{
            width: (vmData && vmData.data) || viewClicked ? "50%" : "75%",
          }}
        >
          {network_icons ? (
            <ReactFlowProvider>
              <AddNodeOnEdgeDrop
                network_icons={network_icons}
                initialNodes={initialNodes}
                setRfInstance={props.setRfInstance}
                topology={props.topology}
              />
            </ReactFlowProvider>
          ) : (
            <>no data found</>
          )}
        </div>
        <div
          className="editor-options min-h-[50vh]"
          style={{
            width: (vmData && vmData.data) || viewClicked ? "50%" : "25%",
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
                <div className="flex justify-center">
                  <button
                    className={`btn ${
                      apiHit && vmData.data
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-700 text-white hover:bg-red-800"
                    } rounded-md px-4 py-1 mt-6 font-semibold`}
                    disabled={apiHit && vmData.data}
                    onClick={(e: any) => getallVMs(e)}
                  >
                    Calculate Estimation
                  </button>
                </div>{" "}
                {apiHit && vmData.data && (
                  <div className="mt-4 w-full bg-white border rounded-lg overflow-hidden shadow-md">
                    <table className="w-full">
                      <thead className="bg-red-700 text-white">
                        <tr>
                          <th className="font-medium">Product</th>
                          <th className="font-medium">Quantity</th>
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
                              {selectedPrice ? selectedPrice : "N/A"}
                            </p>
                          </td>
                        </tr>
                        {/* Add more rows as needed */}
                      </tbody>
                    </table>

                    {/* Total Price Block */}
                    <div className="total-price px-4 py-2 text-lg font-semibold">
                      Total Price: {serverCount && serverCount * selectedPrice}
                    </div>
                  </div>
                )}
              </div>
              <div className={role != "admin" ? "justify-center" : "hidden"}>
                <div className="justify-center">
                  <button
                    className={`btn ${
                      viewClicked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-700 text-white hover:bg-red-800"
                    } rounded-md px-4 py-1 mt-6 font-semibold`}
                    disabled={apiHit && vmData.data}
                    onClick={(e: any) => manageview(e)}
                  >
                    View Estimation
                  </button>
                </div>
                {(estimation && viewClicked) && (
                  <div className="mt-4 w-full bg-white border rounded-lg overflow-hidden shadow-md">
                    <table className="w-full">
                      <thead className="bg-red-700 text-white">
                        <tr>
                          <th className="font-medium">Product</th>

                          <th className="font-medium">Quantity</th>

                          <th className="font-medium">Price</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="pl-4">
                            <div className="font-bold">Server</div>

                            <div className="text-sm">{estimation.product}</div>
                          </td>

                          <td className="px-4 py-2 text-center">
                            {estimation.quantity}
                          </td>

                          <td className="px-4 py-2">
                            <p className="border-b-2">
                              {estimation.totalPrice}
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
                )}

                <div className="flex flex-row gap-3 absolute bottom-4 right-7">
                  <button
                      className={`px-4 rounded-md py-1 ${
                        !viewClicked ? 'bg-gray-400 text-gray-700' : 'bg-red-700 text-white'
                      }`}
                    onClick={(e) => rejectStatus(e)}
                    disabled={!viewClicked}
                  >
                    Decline
                  </button>

                  <button
                   className={`px-4 rounded-md py-1 ${
                    !viewClicked ? 'bg-gray-400 text-gray-700' : 'bg-green-700 text-white'
                  }`}
                    onClick={(e) => approveStatus(e)}
                    disabled={!viewClicked}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Topology;
