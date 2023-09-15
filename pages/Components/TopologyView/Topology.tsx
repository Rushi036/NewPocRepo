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
  let getVMData: any[];
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
  let arole: any = "";

  const [topoDetails, setTopoDetails] = useState<any>([]);
  const getUniqueVm = (vmData: any) => {
    if (vmData) {
      for (const item of vmData) {
        if (uniqueProductNames.size < 5) {
          uniqueProductNames.add(item.productName);
          if (uniqueProductNames.size <= 5) {
            productPrices[item.productName] = item.unitPrice;
          }
        } else {
          break;
        }
      }
    }
    // setVMData(uniqueProductNames);
    console.log("unique after sorting", uniqueProductNames);
    console.log("unique prices after sorting", productPrices);
    setUniqueProductsPrices(productPrices);
    setApiHit(true);
  };

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
  const selectedPrice =
    (uniqueProductPrices && uniqueProductPrices[selectedProduct]) || 0;
  const serverCount =
    topoDetails && topoDetails.filter((item: any) => item === "Server").length;
  const totalPrice = serverCount && serverCount * selectedPrice;
  console.log("node details in the topo", topoDetails);
  const getData = async () => {
    getVMData = await GetAllVMs();
    getUniqueVm(getVMData);
    setVMData(getVMData);
  };

  const getallVMs = (e: any) => {
    e.preventDefault();
    getData();
  };
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
    setSelectedProduct(e.target.value);
  };

  const [Node, setNode] = useState(3);

  return (
    <>
      <div className="topology-editor">
        <div
          className="creator"
          style={{ width: Object.keys(uniqueProductPrices)[0] ? "50%" : "75%" }}
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
          className="relative editor-options min-h-[50vh]"
          style={{ width: "50%" }}
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
            <>
              <div className={role == 'admin' ? "" : 'hidden'}>
                <div className="flex justify-center">
                  <button
                    className={`btn ${apiHit &&
                      uniqueProductPrices &&
                      Object.keys(uniqueProductPrices)[0]
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-700 text-white hover:bg-red-800"
                      } rounded-md px-4 py-1 mt-6 font-semibold`}
                    disabled={
                      apiHit &&
                      uniqueProductPrices &&
                      Object.keys(uniqueProductPrices)[0]
                    }
                    onClick={(e: any) => getallVMs(e)}
                  >
                    Calculate Estimation
                  </button>
                </div>{" "}
                {apiHit &&
                  uniqueProductPrices &&
                  Object.keys(uniqueProductPrices)[0] && (
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
                                className="px-4 py-1 border mb-2 rounded-lg"
                              >
                                <option value="" disabled>
                                  Select a product
                                </option>
                                {Object.keys(uniqueProductPrices).map(
                                  (productName) => (
                                    <option key={productName} value={productName}>
                                      {productName}
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
                                {uniqueProductPrices && selectedProduct
                                  ? `$${uniqueProductPrices[selectedProduct]}`
                                  : "N/A"}
                              </p>
                            </td>
                          </tr>
                          {/* Add more rows as needed */}
                        </tbody>
                      </table>

                      {/* Total Price Block */}
                      <div className="total-price px-4 py-2 text-lg font-semibold">
                        Total Price: ${totalPrice}
                      </div>
                    </div>
                  )}
              </div>
              <div className={role != 'admin' ? "" : 'hidden'}>
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
                          Server
                        </td>
                        <td className="px-4 py-2 text-center">
                          {serverCount}
                        </td>
                        <td className="px-4 py-2">
                          <p className="border-b-2">
                            {uniqueProductPrices && selectedProduct
                              ? `$${uniqueProductPrices[selectedProduct]}`
                              : "N/A"}
                          </p>
                        </td>
                      </tr>
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>

                  {/* Total Price Block */}
                  <div className="total-price px-4 py-2 text-lg font-semibold">
                    Total Price: ${totalPrice}
                  </div>
                </div>
                <div className="flex flex-row gap-3 absolute bottom-2 right-4">
                  <button className="px-4 py-2 bg-red-700 text-white">Decline</button>
                  <button className="px-4 py-2 bg-green-700 text-white">Accept</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Topology;
