// src/components/CustomNode.tsx
import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Play, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { NodeData } from "../types";
import { useFlowStore } from "../store/useFlowStore";

const CustomNode = memo(({ id, data, selected }: NodeProps<NodeData>) => {
  const { errors, selectNode } = useFlowStore();

  const nodeErrors = errors.filter((e) => e.refId === id && e.type === "node");
  const hasError = nodeErrors.some((e) => e.field !== "connectivity");
  const isDisconnected = nodeErrors.some((e) => e.field === "connectivity");
  const isValid =
    !hasError && !isDisconnected && data.schemaId && data.description;

  const handleClick = useCallback(() => {
    selectNode(id);
  }, [id, selectNode]);

  return (
    <div
      className={`custom-node relative min-w-[200px] max-w-[240px] rounded-xl border-2 cursor-pointer transition-all duration-200
        ${selected ? "border-accent shadow-lg shadow-accent/20" : "border-border"}
        ${hasError ? "border-danger/60" : ""}
        ${isDisconnected && !hasError ? "border-warning/60" : ""}
        bg-panel`}
      onClick={handleClick}
    >
      {/* Start badge */}
      {data.isStart && (
        <div className="absolute -top-3 left-3 flex items-center gap-1 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          <Play size={8} fill="white" />
          START
        </div>
      )}

      {/* Status icon */}
      <div className="absolute -top-2 -right-2">
        {hasError ? (
          <div className="bg-danger rounded-full p-0.5">
            <AlertCircle size={14} className="text-white" />
          </div>
        ) : isDisconnected ? (
          <div className="bg-warning rounded-full p-0.5">
            <AlertTriangle size={14} className="text-white" />
          </div>
        ) : isValid ? (
          <div className="bg-success rounded-full p-0.5">
            <CheckCircle size={14} className="text-white" />
          </div>
        ) : null}
      </div>

      <div className="p-3">
        {/* Node ID */}
        <div
          className={`font-bold text-sm truncate mb-1 ${
            data.isStart ? "text-success" : "text-white"
          }`}
        >
          {data.schemaId || <span className="text-muted italic">Unnamed</span>}
        </div>

        {/* Description */}
        {data.description ? (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        ) : (
          <p className="text-xs text-danger/70 italic">No description</p>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-panel !border-2 !border-accent"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-panel !border-2 !border-accent"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
export default CustomNode;
