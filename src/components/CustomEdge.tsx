// src/components/CustomEdge.tsx
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { X } from "lucide-react";
import { EdgeData } from "../types";
import { useFlowStore } from "../store/useFlowStore";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<EdgeData>) {
  const { selectEdge, deleteEdge, errors } = useFlowStore();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const hasError = errors.some((e) => e.refId === id && e.type === "edge");

  const strokeColor = hasError ? "#ef4444" : selected ? "#6366f1" : "#475569";

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 2.5 : 2,
          strokeDasharray: hasError ? "5,5" : undefined,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div
            className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all
              border ${
                selected
                  ? "bg-accent text-white border-accent"
                  : hasError
                    ? "bg-danger/20 text-danger border-danger/40"
                    : "bg-card text-slate-300 border-border hover:border-accent/60"
              }`}
            onClick={(e) => {
              e.stopPropagation();
              selectEdge(id);
            }}
          >
            <span className="max-w-[120px] truncate">
              {data?.condition || (
                <span className="italic opacity-60">no condition</span>
              )}
            </span>
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
              onClick={(e) => {
                e.stopPropagation();
                deleteEdge(id);
              }}
            >
              <X size={10} />
            </button>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
