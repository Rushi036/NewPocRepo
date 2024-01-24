import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { PiWaveSquareLight, PiWaveSine } from "react-icons/pi";
import { AiOutlineDash } from "react-icons/ai";
import { BsDashLg } from "react-icons/bs";
import ResizableNode from "./ResizableNode";

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

const AddNodeOnEdgeDrop = (props: any) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(props?.initialNodes);
  const [curveLine, setCurveLine] = useState<any>(true);
  const { project, setViewport } = useReactFlow();
  const nodeTypes: any = useMemo(
    () => ({
      selectorNode: DynamicNode,
      resizableNode: (props: any) => (
        <ResizableNode
          {...props}
          nodes={nodes}
          setNodes={setNodes}
          id={getId}
          project={project}
        />
      ),
    }),
    []
  );
  const reactFlowWrapper = useRef<any>(null);
  const connectingNodeId = useRef(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    []
  );
  const [dashedLine, setDashedLine] = useState<any>(true);
  const edgeTypes: any = useMemo(
    () => ({
      floating: (props: any) => (
        <SimpleFloatingEdge
          {...props}
          edges={edges}
          setEdges={setEdges}
          curveLine={curveLine}
          dashedLine={dashedLine}
        />
      ),
    }),
    [curveLine, dashedLine]
  );
  const flowKey = "example-flow";
  const [rfInstance, setRfInstance] = useState<any>(null);

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  useEffect(() => {
    console.log("nodes", nodes);
  }, [nodes]);

  const onConnectEnd = useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        let newNode: any = {
          id,
          type:
            props.network_icons[selectedNode].Name == "Container"
              ? "resizableNode"
              : "selectorNode",
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          connectable: true,
          data: {
            id: id,
            nodes: [],
            label:
              props.network_icons[selectedNode].Name == "Container"
                ? `Container`
                : `Node`,
            Path: props.network_icons[selectedNode].SubCategory
              ? props.network_icons[selectedNode].SubCategory[selectedSubNode]
              : props.network_icons[selectedNode],
          },
        };

        // newNode.data.nodes = [...nodes, newNode];
        newNode.data.nodes =
          props.network_icons[selectedNode].Name == "Container"
            ? [newNode]
            : [];

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
            label: "",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        );
      }
    },
    [project]
  );

  // const onRestore = useCallback(() => {
  //   const restoreFlow = async () => {
  //     let flow: any;
  //     flow = JSON.parse(props.topology || "{}");

  //     if (flow) {
  //       const { x = 0, y = 0, zoom = 1 } = flow.viewport;
  //       setNodes(flow.nodes || []);
  //       setEdges(flow.edges || []);
  //       setViewport({ x, y, zoom });
  //     }
  //   };

  //   restoreFlow();
  // }, [props.topology, setEdges, setNodes, setViewport]);

  const onReset = useCallback(() => {
    const resetFlow = async () => {
      const x = 0,
        y = 0,
        zoom = 1;
      setViewport({ x, y, zoom });
      setNodes([]);
      setEdges([]);
      selectedNode = null;
      selectedSubNode = null;
      props.setSubNode(null);
      props.setNode(null);
      props.setInitialNodes(null);
    };

    resetFlow();
  }, [setEdges, setNodes, setViewport]);

  // console.log(props.topology)
  // useEffect(() => {
  //   props.topology && onRestore();
  // }, [props.topology]);

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
        <div className="flex gap-2">
          <div
            className="select-none cursor-pointer z-20 left-1 px-2 py-1 bg-slate-300 border border-slate-400 rounded-lg flex justify-center items-center"
            onClick={() => {
              setCurveLine(!curveLine);
            }}
          >
            {curveLine ? <PiWaveSine /> : <PiWaveSquareLight />}
          </div>
          <div
            className="select-none cursor-pointer z-20 left-1 px-2 py-1 bg-slate-300 border border-slate-400 rounded-lg flex justify-center items-center"
            onClick={() => {
              setDashedLine(!dashedLine);
            }}
          >
            {dashedLine ? <AiOutlineDash /> : <BsDashLg />}
          </div>
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
      let firstNode: any = [
        {
          id: "0",
          type:
            network_icons[selectedNode].Name == "Container"
              ? "resizableNode"
              : "selectorNode",
          data: {
            id: "0",
            nodes: [],
            setNodes: setNode,
            label:
              network_icons[selectedNode].Name == "Container"
                ? `Container`
                : `Node`,
            Path: network_icons[selectedNode].SubCategory
              ? network_icons[selectedNode].SubCategory[selectedSubNode]
              : network_icons[selectedNode],
          },
          position: { x: 0, y: 50 },
        },
      ];
      firstNode[0].data.nodes = firstNode;
      setInitialNodes(firstNode);
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
                setNode={setNode}
                setSubNode={setSubNode}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <div
          className={
            fullScreen
              ? "editor-options min-h-[50vh] h-[calc(100vh-2rem)] overflow-y-auto"
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
                          if (
                            x.Name == "Container" &&
                            (selectedNode || selectedSubNode)
                          ) {
                            selectedNode = i;
                            setNode(i);
                          } else if (x.Name != "Container") {
                            selectedNode = i;
                            setNode(i);
                          }
                        }}
                        key={i}
                        className={
                          x.Name == "Container"
                            ? selectedNode || selectedSubNode
                              ? Node === i && !x?.SubCategory
                                ? "selected-node flex !flex-col"
                                : "flex !flex-col"
                              : " bg-slate-300 rounded-xl border border-slate-400 grayscale flex !flex-col "
                            : Node === i && !x?.SubCategory
                            ? "selected-node flex !flex-col"
                            : "flex !flex-col "
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
