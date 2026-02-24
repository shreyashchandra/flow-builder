// src/types/index.ts
export interface SchemaEdge {
  id: string;
  to_node_id: string;
  condition: string;
  parameters?: Record<string, string>;
}

export interface SchemaNode {
  id: string;
  description: string;
  prompt: string;
  isStart: boolean;
  edges: SchemaEdge[];
}

export interface NodeData {
  schemaId: string; // user-defined unique ID
  description: string;
  prompt: string;
  isStart: boolean;
}

export interface EdgeData {
  condition: string;
  parameters: Record<string, string>;
}

export interface ValidationError {
  type: "node" | "edge" | "global";
  refId: string;
  field: string;
  message: string;
}
