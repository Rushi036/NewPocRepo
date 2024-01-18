import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

const ResizableNode = ({ data }: any) => {
  return (
    <>
      <div className="bg-slate-50 h-full">
        <NodeResizer minWidth={100} minHeight={30} />
        <Handle type="target" position={Position.Left} />
        <div style={{ position:"absolute", top: "-6px", left:"10px", fontSize:'8px', background:"rgb(248,250,252)" }}>{data?.label}</div>
        <Handle type="source" position={Position.Top} id="a" />
        <Handle type="source" position={Position.Right} id="b" />
        <Handle type="source" position={Position.Bottom} id="c" />
        <Handle type="source" position={Position.Left} id="d" />
      </div>
    </>
  );
};

export default memo(ResizableNode);
