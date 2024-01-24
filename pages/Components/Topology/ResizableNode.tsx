import { getIcons } from "@/pages/api/getIcons";
import { memo, useEffect, useState } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

let selectedNode: any = null;
let selectedSubNode: any = null;
const ResizableNode = ({ data, nodes, setNodes,id, project }: any) => {
  const [network_icons, setNetworkIcons] = useState<any>(null);
  const [Node, setNode] = useState(null);
  const [subNode, setSubNode] = useState(null);
  const [firstNodeOptionsMenu, setFirstNodeOptionsMenu] = useState(false);
  // console.log("data", data);
  useEffect(() => {
    async function dataFetch() {
      await getIcons().then((res: any) => {
        setNetworkIcons(res.data);
      });
    }
    dataFetch();
  }, []);

  useEffect(() => {
    if (network_icons && selectedNode != null) {
      console.log("nodes nodes", nodes);
      console.log("nodes data.nodes", data.nodes);
      let parentNode:any = data.nodes;
      // delete parentNode.data.nodes;
      let newNodes = [
        ...nodes,
        ...parentNode,
        {
          id: data?.id + "-0",
          type:
            network_icons[selectedNode].Name == "Container"
              ? "resizableNode"
              : "selectorNode",
          data: {
            network_icons: network_icons,
            label:
              network_icons[selectedNode].Name == "Container"
                ? `Container`
                : `Node`,
            Path: network_icons[selectedNode].SubCategory
              ? network_icons[selectedNode].SubCategory[selectedSubNode]
              : network_icons[selectedNode],
          },
          position: { x: 0, y: 50 },
          parentNode: data?.id,
          extent: "parent",
        },
      ];
      console.log("nodes newNodes", newNodes);
      setNodes(newNodes);
    }
  }, [network_icons, selectedNode, nodes]);
  return (
    <>
      <div className="custom-node relative z-[99999] bg-slate-50 h-full min-w-[450px] min-h-[350px] flex justify-center items-center">
        <NodeResizer minWidth={450} minHeight={350} />
        <Handle type="target" position={Position.Left} />
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "10px",
            padding: "0 2px",
            fontSize: "12px",
            background:
              "linear-gradient(to bottom,rgba(248,250,252,0) 0 45%, white 45% 54% ,rgb(248,250,252) 54% 100%)",
          }}
        >
          {data?.label}
        </div>
        {!selectedNode && (
          <div
            onClick={() => setFirstNodeOptionsMenu(!firstNodeOptionsMenu)}
            className="h-10 w-10 rounded border bg-slate-100 flex justify-center items-center cursor-pointer"
          >
            +
          </div>
        )}
        {!selectedNode && firstNodeOptionsMenu && (
          <div
            className={
              "editor-options editor-options-container h-fit overflow-y-auto absolute right-0 top-0 !w-[7.5rem] translate-x-[105%] "
            }
          >
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
                          Node === i && !x?.SubCategory
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
                                    ? "selected-node flex gap-2 ml-3"
                                    : "flex gap-2 ml-3"
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
          </div>
        )}
        <Handle type="source" position={Position.Top} id="a" />
        <Handle type="source" position={Position.Right} id="b" />
        <Handle type="source" position={Position.Bottom} id="c" />
        <Handle type="source" position={Position.Left} id="d" />
      </div>
    </>
  );
};

export default memo(ResizableNode);
