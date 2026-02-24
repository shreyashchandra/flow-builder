// src/store/useFlowStore.ts
import { create } from "zustand";
import {
  Node,
  Edge,
  addEdge as rfAddEdge,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { NodeData, EdgeData, ValidationError } from "../types";
import { validateFlow } from "../utils/validation";

interface FlowStore {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  errors: ValidationError[];
  sidebarOpen: boolean;

  // RF handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node operations
  addNode: () => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setStartNode: (id: string) => void;
  selectNode: (id: string | null) => void;

  // Edge operations
  deleteEdge: (id: string) => void;
  updateEdgeData: (id: string, data: Partial<EdgeData>) => void;
  selectEdge: (id: string | null) => void;

  // Misc
  validate: () => void;
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge<EdgeData>[]) => void;
  setSidebarOpen: (open: boolean) => void;
}

const makeDefaultNode = (
  x: number,
  y: number,
  index: number,
): Node<NodeData> => ({
  id: uuidv4(),
  type: "customNode",
  position: { x, y },
  data: {
    schemaId: `node_${index}`,
    description: "",
    prompt: "",
    isStart: false,
  },
});

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [
    {
      ...makeDefaultNode(200, 150, 1),
      data: {
        schemaId: "start_node",
        description: "Entry point of the flow",
        prompt: "Welcome! How can I help you today?",
        isStart: true,
      },
    },
  ],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  errors: [],
  sidebarOpen: false,

  onNodesChange: (changes) => {
    set((s) => ({
      nodes: applyNodeChanges(changes, s.nodes) as Node<NodeData>[],
    }));
    get().validate();
  },

  onEdgesChange: (changes) => {
    set((s) => ({
      edges: applyEdgeChanges(changes, s.edges) as Edge<EdgeData>[],
    }));
    get().validate();
  },

  onConnect: (connection) => {
    const newEdge: Edge<EdgeData> = {
      ...connection,
      id: uuidv4(),
      type: "customEdge",
      data: { condition: "condition", parameters: {} },
      label: "condition",
      source: connection.source!,
      target: connection.target!,
    };
    set((s) => ({ edges: rfAddEdge(newEdge, s.edges) as Edge<EdgeData>[] }));
    get().validate();
  },

  addNode: () => {
    const { nodes } = get();
    const index = nodes.length + 1;
    const x = 100 + ((index - 1) % 3) * 320;
    const y = 100 + Math.floor((index - 1) / 3) * 200;
    const newNode = makeDefaultNode(x, y, index);
    set((s) => ({ nodes: [...s.nodes, newNode] }));
    get().validate();
  },

  deleteNode: (id) => {
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
      sidebarOpen: s.selectedNodeId === id ? false : s.sidebarOpen,
    }));
    get().validate();
  },

  updateNodeData: (id, data) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    }));
    get().validate();
  },

  setStartNode: (id) => {
    set((s) => ({
      nodes: s.nodes.map((n) => ({
        ...n,
        data: { ...n.data, isStart: n.id === id },
      })),
    }));
    get().validate();
  },

  selectNode: (id) => {
    set({ selectedNodeId: id, selectedEdgeId: null, sidebarOpen: !!id });
  },

  deleteEdge: (id) => {
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    }));
    get().validate();
  },

  updateEdgeData: (id, data) => {
    set((s) => ({
      edges: s.edges.map((e) =>
        e.id === id
          ? {
              ...e,
              data: { ...e.data!, ...data },
              label: data.condition ?? e.data?.condition ?? "",
            }
          : e,
      ),
    }));
    get().validate();
  },

  selectEdge: (id) => {
    set({ selectedEdgeId: id, selectedNodeId: null, sidebarOpen: !!id });
  },

  validate: () => {
    const { nodes, edges } = get();
    const errors = validateFlow(nodes, edges);
    set({ errors });
  },

  setNodes: (nodes) => {
    set({ nodes });
    get().validate();
  },
  setEdges: (edges) => {
    set({ edges });
    get().validate();
  },
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
