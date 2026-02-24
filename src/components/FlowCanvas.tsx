// src/components/FlowCanvas.tsx
import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
} from "reactflow";
import { useFlowStore } from "../store/useFlowStore";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";

const nodeTypes: NodeTypes = { customNode: CustomNode };
const edgeTypes: EdgeTypes = { customEdge: CustomEdge };

export default function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectEdge,
    deleteNode,
    deleteEdge,
    selectedNodeId,
    selectedEdgeId,
  } = useFlowStore();

  // Delete key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (selectedNodeId) deleteNode(selectedNodeId);
        if (selectedEdgeId) deleteEdge(selectedEdgeId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: { id: string }) => {
      selectEdge(edge.id);
    },
    [selectEdge],
  );

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "customEdge" }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={null} // We handle delete manually
        proOptions={{ hideAttribution: true }}
        className="bg-canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#2d3148"
        />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as { isStart?: boolean };
            return d?.isStart ? "#10b981" : "#6366f1";
          }}
          maskColor="rgba(15,17,23,0.8)"
        />
      </ReactFlow>
    </div>
  );
}
