import React, { useCallback, useEffect, useRef, useState, } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import DynamicNode from './DynamicNode/DynamicNode';
import 'reactflow/dist/style.css';

// import './Topology.css';

const network_icons = [
  {
    Name: 'Cisco Router',
    Path: '/network_icons/router.png'
  },
  {
    Name: 'Wifi Router',
    Path: '/network_icons/wifi_router.png'
  },
  {
    Name: 'Switch',
    Path: '/network_icons/switch.png'
  },
  {
    Name: 'Remote Desktop',
    Path: '/network_icons/remote_desktop.png'
  },
  {
    Name: 'Hub',
    Path: '/network_icons/hub.png'
  },
  {
    Name: 'Voip',
    Path: '/network_icons/voip.png'
  },
  {
    Name: 'Database Server',
    Path: '/network_icons/database_server.png'
  }
];

let selectedNode = 3;

const proOptions = { hideAttribution: true };

const initialNodes = [
  {
    id: '0',
    type: 'selectorNode',
    data: { label: 'Node', Path: network_icons[3] },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 3,
};
const nodeTypes = { selectorNode: DynamicNode };

const AddNodeOnEdgeDrop = (props: any) => {
  const reactFlowWrapper = useRef<any>(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project, setViewport } = useReactFlow();
  const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

  const flowKey = 'example-flow';
  const [rfInstance, setRfInstance] = useState<any>(null);

  const onConnectStart = useCallback((_: any, { nodeId }: any) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          type: 'selectorNode',
          // we are removing the half of the node width (75) to center the new node
          position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
          data: { label: `Node ${id}`, Path: network_icons[selectedNode] },
        };

        setNodes((nds: any) => nds.concat(newNode));
        setEdges((eds: any) => eds.concat({ id, source: connectingNodeId.current, target: id, animated: true }));
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
    props.topology && onRestore()
  }, [props.topology])

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
  const [Node, setNode] = useState(3);


  return (
    <>
      <div className='topology-editor'>
        <div className='creator'>
          <ReactFlowProvider>
            <AddNodeOnEdgeDrop setRfInstance={props.setRfInstance} topology={props.topology} />
          </ReactFlowProvider>
        </div>
        <div className='editor-options'>
          <div className='modal' style={{ display: "contents" }}>
            <ul>
              {network_icons.map((x: any, i: any) => {
                return <li onClick={() => { selectedNode = i; setNode(i) }} key={i} className={Node === i ? 'selected-node' : ''}><img src={x.Path} /> <p>{x.Name}</p></li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Topology
