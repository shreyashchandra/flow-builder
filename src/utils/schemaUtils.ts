// src/utils/schemaUtils.ts
import { Node, Edge } from "reactflow";
import { NodeData, EdgeData, SchemaNode } from "../types";

export function buildSchema(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[],
): SchemaNode[] {
  return nodes.map((node) => {
    const outgoing = edges.filter((e) => e.source === node.id);
    return {
      id: node.data.schemaId || node.id,
      description: node.data.description,
      prompt: node.data.prompt,
      isStart: node.data.isStart,
      edges: outgoing.map((e) => {
        const targetNode = nodes.find((n) => n.id === e.target);
        return {
          id: e.id,
          to_node_id: targetNode?.data.schemaId || e.target,
          condition: e.data?.condition || "",
          ...(e.data?.parameters && Object.keys(e.data.parameters).length > 0
            ? { parameters: e.data.parameters }
            : {}),
        };
      }),
    };
  });
}

export function importSchema(json: string): {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
} | null {
  try {
    const parsed = JSON.parse(json);
    const schemaNodes: SchemaNode[] = Array.isArray(parsed)
      ? parsed
      : parsed.nodes || [];

    const COLS = 3;
    const H_GAP = 320;
    const V_GAP = 200;

    const rfNodes: Node<NodeData>[] = schemaNodes.map((n, i) => ({
      id: n.id,
      type: "customNode",
      position: {
        x: (i % COLS) * H_GAP + 80,
        y: Math.floor(i / COLS) * V_GAP + 80,
      },
      data: {
        schemaId: n.id,
        description: n.description || "",
        prompt: n.prompt || "",
        isStart: n.isStart || false,
      },
    }));

    const rfEdges: Edge<EdgeData>[] = schemaNodes.flatMap((n) =>
      (n.edges || []).map((e) => ({
        id: e.id,
        source: n.id,
        target: e.to_node_id,
        type: "customEdge",
        data: {
          condition: e.condition,
          parameters: e.parameters || {},
        },
        label: e.condition,
      })),
    );

    return { nodes: rfNodes, edges: rfEdges };
  } catch {
    return null;
  }
}
