import { useCallback, useEffect, useState } from "react";
import {
  useStore,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "reactflow";
import { getEdgeParams } from "./utils";
import { FaEdit } from "react-icons/fa";


function SimpleFloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  label,
  edges,
  setEdges,
  curveLine,
  dashedLine,
}: any) {
  const [labelTag, setLabelTag] = useState<any>("");
  const [labelEdit, setLabelEdit] = useState<any>(false);
  // console.log("first",id, source, target, markerEnd, style)
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  useEffect(() => setLabelTag(label), [label]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePathCurve, labelXCurve, labelYCurve] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const onEdgeClick = () => {
    setLabelEdit(true);
  };
  const onSaveClick = (e: any) => {
    e.preventDefault();
    // edges.filter((obj: any, i: any) => {
    //   if (obj.id == id) {
    //     edges[i].label = labelTag;
    //   }
    // });
    setEdges((edges: any) => edges.map((e: any) => {
      if (e.id === id)
        return { ...e, label: labelTag }
      else
        return e
    }));
    setLabelEdit(false);
  };

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={curveLine ? edgePathCurve : edgePath}
        strokeWidth={5}
        markerEnd={markerEnd}
        style={style}
        strokeDasharray={dashedLine ? "4" : "0"}
      />
      {/* <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} /> */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${
              curveLine ? labelXCurve : labelX
            }px,${curveLine ? labelYCurve : labelY}px)`,
            fontSize: 10,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: "all",
          }}
          className="nodrag nopan cursor-pointer"
        >
          {labelEdit ? (
            <div className="flex">
              <input
                type="text"
                className="border pl-1"
                value={labelTag}
                onChange={(e: any) => {
                  setLabelTag(e.target.value);
                }}
              />
              <button
                onClick={onSaveClick}
                className="bg-slate-400 border px-1 cursor-pointer z-50"
              >
                save
              </button>
            </div>
          ) : (
            <div onClick={onEdgeClick}>{labelTag || <FaEdit />}</div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default SimpleFloatingEdge;
