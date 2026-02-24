// src/utils/validation.ts
import { Node, Edge } from "reactflow";
import { NodeData, EdgeData, ValidationError } from "../types";

export function validateFlow(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[],
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for start node
  const startNodes = nodes.filter((n) => n.data.isStart);
  if (startNodes.length === 0) {
    errors.push({
      type: "global",
      refId: "global",
      field: "startNode",
      message: "No start node defined. Mark one node as the start node.",
    });
  }

  // Collect all schema IDs for uniqueness check
  const schemaIds = nodes.map((n) => n.data.schemaId.trim().toLowerCase());
  const idCounts: Record<string, number> = {};
  schemaIds.forEach((id) => {
    idCounts[id] = (idCounts[id] || 0) + 1;
  });

  nodes.forEach((node) => {
    const sid = node.data.schemaId.trim();

    // ID validation
    if (!sid) {
      errors.push({
        type: "node",
        refId: node.id,
        field: "schemaId",
        message: "Node ID is required.",
      });
    } else if (!/^[a-zA-Z0-9_-]+$/.test(sid)) {
      errors.push({
        type: "node",
        refId: node.id,
        field: "schemaId",
        message: "Node ID can only contain letters, numbers, _ and -.",
      });
    } else if (idCounts[sid.toLowerCase()] > 1) {
      errors.push({
        type: "node",
        refId: node.id,
        field: "schemaId",
        message: `Node ID "${sid}" is not unique.`,
      });
    }

    // Description validation
    if (!node.data.description.trim()) {
      errors.push({
        type: "node",
        refId: node.id,
        field: "description",
        message: "Description is required.",
      });
    }

    // Prompt validation
    if (!node.data.prompt.trim()) {
      errors.push({
        type: "node",
        refId: node.id,
        field: "prompt",
        message: "Prompt is required.",
      });
    }

    // Disconnected node warning (not start, no edges in or out)
    const isStart = node.data.isStart;
    const hasOutgoing = edges.some((e) => e.source === node.id);
    const hasIncoming = edges.some((e) => e.target === node.id);
    if (!isStart && !hasOutgoing && !hasIncoming) {
      errors.push({
        type: "node",
        refId: node.id,
        field: "connectivity",
        message: "Node is disconnected — no edges connect to it.",
      });
    }
  });

  // Edge validations
  edges.forEach((edge) => {
    if (!edge.data?.condition?.trim()) {
      errors.push({
        type: "edge",
        refId: edge.id,
        field: "condition",
        message: "Edge condition is required.",
      });
    }
  });

  return errors;
}
