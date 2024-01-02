import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Controls,
  ControlButton,
  MarkerType,
} from "reactflow";
import DynamicNode from "./DynamicNode/DynamicNode";
import "reactflow/dist/style.css";
import { getIcons } from "@/pages/api/getIcons";
import SimpleFloatingEdge from "./SimpleFloatingEdge";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

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

let selectedNode: any = null;
let selectedSubNode: any = null;

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
  const edgeTypes: any = {
    floating: SimpleFloatingEdge,
  };

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
          connectable: true,
          data: {
            label: `Node ${id}`,
            Path: props.network_icons[selectedNode].SubCategory? props.network_icons[selectedNode].SubCategory[selectedSubNode] : props.network_icons[selectedNode],
          },
        };

        setNodes((nds: any) => nds.concat(newNode));
        setEdges((eds: any) =>
          eds.concat({
            id,
            source: connectingNodeId.current,
            target: id,
            // floating: FloatingEdge,
            animated: false,
            // type: "smoothstep",
            type: "floating",
            // markerEnd: {
            //   type: MarkerType.Arrow,
            // },
            markerEnd: { type: MarkerType.ArrowClosed },
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

  const onReset = useCallback(() => {
    const resetFlow = async () => {
      const x = 0,
        y = 0,
        zoom = 1;
      setNodes([]);
      setEdges([]);
      setViewport({ x, y, zoom });
      selectedNode = null;
      props.setInitialNodes(null);
    };

    resetFlow();
  }, [setEdges, setNodes, setViewport]);

  // console.log(props.topology)
  useEffect(() => {
    props.topology && onRestore();
  }, [props.topology]);

  return (
    <div className="wrapper relative" ref={reactFlowWrapper}>
      {/* <button onClick={onSave}>save</button> */}
      {/* <button className="z-30 absolute top-0 left-10" onClick={onRestore}>
        Restore
      </button> */}
      <div className="flex gap-2 absolute p-2 justify-between w-full">
        <button
          className=" z-20 left-1 px-2 py-1 bg-slate-300 border border-slate-400 rounded-lg"
          onClick={onReset}
        >
          Reset
        </button>
        {!props.fullScreen && (
          <button
            className=" z-20 left-1 px-2 py-1 bg-slate-300 border border-slate-400 rounded-lg"
            onClick={() => {
              props.setFullScreen(true);
            }}
          >
            <MdFullscreen />
          </button>
        )}
        {props.fullScreen && (
          <button
            className=" z-20 left-1 px-2 py-1 bg-slate-300 border border-slate-400 rounded-lg"
            onClick={() => {
              props.setFullScreen(false);
            }}
          >
            <MdFullscreenExit />
          </button>
        )}
      </div>

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
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={fitViewOptions}
      >
        <Controls></Controls>
      </ReactFlow>
    </div>
  );
};
function Topology(props: any) {
  const [fullScreen, setFullScreen] = useState<any>(false);
  const [network_icons, setNetworkIcons] = useState<any>(null);
  const [initialNodes, setInitialNodes] = useState<any>(null);
  const [Node, setNode] = useState(selectedNode);
  const [subNode, setSubNode] = useState(selectedSubNode);

  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res) => {
        setNetworkIcons(res.data);
      });
    }
    dataFetch();
  }, []);

  useEffect(() => {
    if (network_icons && selectedNode != null && !initialNodes) {
      setInitialNodes([
        {
          id: "0",
          type: "selectorNode",
          data: { label: "Node", Path: network_icons[selectedNode].SubCategory? network_icons[selectedNode].SubCategory[selectedSubNode]:network_icons[selectedNode] },
          position: { x: 0, y: 50 },
        },
      ]);
    }
  }, [initialNodes, network_icons, selectedNode]);

  return (
    <>
      <div
        className={
          fullScreen
            ? "topology-editor !fixed !top-0 !left-0 !w-[100vw] !h-[100vh] !z-[10000] !bg-white !m-0 p-4"
            : "topology-editor relative"
        }
      >
        <div className="creator z-10">
          {network_icons && initialNodes ? (
            <>
              <AddNodeOnEdgeDrop
                network_icons={network_icons}
                initialNodes={initialNodes}
                setRfInstance={props.setRfInstance}
                topology={props.topology}
                setInitialNodes={setInitialNodes}
                setFullScreen={setFullScreen}
                fullScreen={fullScreen}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <div
          className={
            fullScreen
              ? "editor-options min-h-[50vh] h-fit max-h-[90vh] overflow-y-auto"
              : "editor-options min-h-[50vh] h-fit max-h-[60vh] overflow-y-auto"
          }
        >
          {props.editable && (
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
                        className={
                          Node === i &&  !x?.SubCategory
                            ? "selected-node flex !flex-col"
                            : "flex !flex-col"
                        }
                      >
                        <div className="flex gap-2">
                          <img src={x.Path} /> <p>{x.Name}</p>
                        </div>
                        <div className={"flex flex-col"}>
                          {x?.SubCategory?.map((y: any, j: any) => {
                            return (
                              <div
                                key={j}
                                onClick={() => {
                                  selectedSubNode = j;
                                  setSubNode(j);
                                }}
                                className={
                                  Node === i && subNode === j
                                    ? "selected-node flex gap-2 ml-3 my-1 p-1"
                                    : "flex gap-2 ml-3 my-1 p-1"
                                }
                              >
                                <img key={j} src={y.Path} /> <p>{y.Name}</p>
                              </div>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Topology;
